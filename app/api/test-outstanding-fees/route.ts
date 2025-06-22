import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    
    console.log('Testing get_outstanding_fees function...')
    
    // Test the function directly
    const result = await client.query('SELECT get_outstanding_fees()')
    
    console.log('Function result:', result.rows[0])
    
    client.release()
    
    return NextResponse.json({
      success: true,
      data: result.rows[0]?.get_outstanding_fees,
      message: 'Function executed successfully'
    })
    
  } catch (error) {
    console.error('Error testing get_outstanding_fees:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 