import { NextResponse } from 'next/server';
import { getStudentsByCourse } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const courseId = parseInt(params.id, 10);

  if (isNaN(courseId)) {
    return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
  }

  try {
    const students = await getStudentsByCourse(courseId);
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching course students:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 