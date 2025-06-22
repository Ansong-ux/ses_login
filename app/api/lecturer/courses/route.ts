import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCoursesByLecturer } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.lecturer_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const courses = await getCoursesByLecturer(session.user.lecturer_id);
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching lecturer courses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 