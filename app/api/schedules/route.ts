import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const date = searchParams.get('date');

  if (!courseId || !date) {
    return NextResponse.json({ error: 'Missing courseId or date' }, { status: 400 });
  }

  // Convert date to day of the week (e.g., 'Monday')
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

  try {
    const schedules = await pool.query(
      `SELECT * FROM class_schedules 
       WHERE course_id = $1 AND day_of_week = $2`,
      [courseId, dayOfWeek]
    );
    return NextResponse.json(schedules.rows);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 