import { NextRequest, NextResponse } from 'next/server'
import { getAssignments, getStudentAssignments } from '@/lib/db'

// GET /api/test-assignments - Test assignments database functions
export async function GET(request: NextRequest) {
  try {
    // Test getAssignments function
    const assignments = await getAssignments();
    
    // Test getStudentAssignments function
    const studentAssignments = await getStudentAssignments(1);
    
    return NextResponse.json({
      success: true,
      assignments: assignments,
      studentAssignments: studentAssignments,
      assignmentsCount: assignments.length,
      studentAssignmentsCount: studentAssignments.length
    });
    
  } catch (error: any) {
    console.error('Test assignments error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to test assignments' },
      { status: 500 }
    );
  }
} 