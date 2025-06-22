import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    
    // List of tables that should exist
    const expectedTables = [
      'students',
      'fees', 
      'courses',
      'enrollments',
      'lecturers',
      'lecturer_courses',
      'lecturer_ta',
      'users',
      'fee_structure',
      'assignments',
      'grades',
      'course_grades',
      'academic_terms',
      'role_permissions',
      'user_activity_logs'
    ]
    
    const results: any = {}
    
    for (const tableName of expectedTables) {
      try {
        const checkTable = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [tableName])
        
        results[tableName] = checkTable.rows[0].exists ? 'EXISTS' : 'MISSING'
      } catch (error) {
        results[tableName] = 'ERROR: ' + (error instanceof Error ? error.message : 'Unknown error')
      }
    }
    
    // Get all existing tables
    const allTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `)
    
    client.release()
    
    return NextResponse.json({
      success: true,
      expectedTables: results,
      allTables: allTables.rows.map((row: any) => row.table_name),
      message: 'Table existence check completed'
    })
    
  } catch (error) {
    console.error('Table test error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 