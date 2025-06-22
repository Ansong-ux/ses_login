import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { registerForCourse, dropCourse } from '@/lib/db'

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

// POST /api/course-registration - Register for a course
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    const { studentId, courseId } = await request.json();
    
    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'Student ID and Course ID are required' },
        { status: 400 }
      );
    }
    
    const result = await registerForCourse(studentId, courseId);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully registered for course',
      enrollmentId: result.enrollment_id
    });
    
  } catch (error: any) {
    console.error('Course registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register for course' },
      { status: 500 }
    );
  }
}

// DELETE /api/course-registration - Drop a course
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUser();
    const { searchParams } = new URL(request.url);
    
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');
    
    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'Student ID and Course ID are required' },
        { status: 400 }
      );
    }
    
    const result = await dropCourse(parseInt(studentId), parseInt(courseId));
    
    return NextResponse.json({
      success: true,
      message: 'Successfully dropped course',
      enrollmentId: result.enrollment_id
    });
    
  } catch (error: any) {
    console.error('Course drop error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to drop course' },
      { status: 500 }
    );
  }
} 