import { NextResponse } from 'next/server';
import { getAcademicTerms, getAssignments, getCourses } from '@/lib/db';

export async function GET() {
  try {
    // Test if the new database functions work
    const terms = await getAcademicTerms();
    const courses = await getCourses();
    const assignments = await getAssignments();

    return NextResponse.json({
      success: true,
      message: 'Grade management system is working!',
      data: {
        terms: terms.length,
        courses: courses.length,
        assignments: assignments.length,
        sampleTerms: terms.slice(0, 2),
        sampleCourses: courses.slice(0, 2)
      }
    });
  } catch (error: any) {
    console.error('Test Grades API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Grade management system needs database setup'
    }, { status: 500 });
  }
} 