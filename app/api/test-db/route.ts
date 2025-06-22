import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    // Test basic connection
    const client = await pool.connect()
    
    // Check if students table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'students'
      );
    `)
    
    const studentsTableExists = tableCheck.rows[0].exists
    
    if (!studentsTableExists) {
      client.release()
      return NextResponse.json({ 
        error: 'Students table does not exist',
        tables: await getExistingTables(client)
      })
    }
    
    // Try to get students
    const students = await client.query('SELECT COUNT(*) FROM students')
    const studentsCount = students.rows[0].count
    
    // Check fees table
    const feesCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'fees'
      );
    `)
    
    const feesTableExists = feesCheck.rows[0].exists
    
    client.release()
    
    return NextResponse.json({
      success: true,
      studentsTableExists,
      feesTableExists,
      studentsCount: parseInt(studentsCount),
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

async function getExistingTables(client: any) {
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `)
  return tables.rows.map((row: any) => row.table_name)
} 