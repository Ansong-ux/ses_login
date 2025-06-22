import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    
    // List of functions that should exist from 04-create-functions.sql
    const expectedFunctions = [
      'get_outstanding_fees',
      'get_student_enrollments', 
      'get_student_course_grades',
      'get_course_grade_summary',
      'calculate_course_grades',
      'get_student_gpa',
      'check_user_permission',
      'log_user_activity'
    ]
    
    const results: any = {}
    
    for (const funcName of expectedFunctions) {
      try {
        const checkFunction = await client.query(`
          SELECT routine_name 
          FROM information_schema.routines 
          WHERE routine_schema = 'public' 
          AND routine_name = $1
        `, [funcName])
        
        results[funcName] = checkFunction.rows.length > 0 ? 'EXISTS' : 'MISSING'
      } catch (error) {
        results[funcName] = 'ERROR: ' + (error instanceof Error ? error.message : 'Unknown error')
      }
    }
    
    // Test the get_outstanding_fees function if it exists
    if (results.get_outstanding_fees === 'EXISTS') {
      try {
        const testResult = await client.query('SELECT get_outstanding_fees()')
        results.get_outstanding_fees_test = 'SUCCESS'
        results.get_outstanding_fees_data = testResult.rows[0].get_outstanding_fees
      } catch (error) {
        results.get_outstanding_fees_test = 'ERROR: ' + (error instanceof Error ? error.message : 'Unknown error')
      }
    }
    
    client.release()
    
    return NextResponse.json({
      success: true,
      functions: results,
      message: 'Function existence check completed'
    })
    
  } catch (error) {
    console.error('Function test error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 