import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    
    console.log('Testing database connection...')
    
    // Test basic connection
    const testResult = await client.query('SELECT NOW() as current_time')
    
    // Check if grades table exists
    const gradesTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'grades'
      ) as exists;
    `)
    
    // Check if announcements table exists
    const announcementsTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'announcements'
      ) as exists;
    `)
    
    // Check users table structure
    const usersColumnsCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND table_schema = 'public'
      ORDER BY column_name;
    `)
    
    client.release()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test completed',
      currentTime: testResult.rows[0].current_time,
      gradesTableExists: gradesTableCheck.rows[0].exists,
      announcementsTableExists: announcementsTableCheck.rows[0].exists,
      usersColumns: usersColumnsCheck.rows.map(row => row.column_name)
    })
    
  } catch (error) {
    console.error('Error testing database:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 