import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    
    console.log('Querying outstanding fees directly...')
    
    // Do the query directly instead of using the function
    const result = await client.query(`
      SELECT 
        s.student_id,
        s.first_name || ' ' || s.last_name AS full_name,
        s.email,
        COALESCE(paid.total_paid, 0) AS total_paid,
        1000.00 - COALESCE(paid.total_paid, 0) AS outstanding,
        CASE 
          WHEN COALESCE(paid.total_paid, 0) >= 1000.00 THEN 'Paid'
          WHEN COALESCE(paid.total_paid, 0) > 0 THEN 'Partial'
          ELSE 'Unpaid'
        END AS payment_status
      FROM students s
      LEFT JOIN (
        SELECT student_id, SUM(amount_paid) AS total_paid
        FROM fees
        GROUP BY student_id
      ) paid ON s.student_id = paid.student_id
      ORDER BY s.student_id;
    `)
    
    console.log('Query result:', result.rows.length, 'students found')
    
    client.release()
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      message: 'Outstanding fees queried successfully'
    })
    
  } catch (error) {
    console.error('Error querying outstanding fees:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 