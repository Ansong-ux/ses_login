import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { markAttendance } from '@/lib/db';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const lecturerId = session?.user?.lecturer_id;

  if (!lecturerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { attendance, courseId, date, scheduleId } = await request.json();

  if (!attendance || !courseId || !date || !scheduleId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const promises = Object.entries(attendance).map(([studentId, status]) => {
      return markAttendance({
        studentId: parseInt(studentId, 10),
        courseId: parseInt(courseId, 10),
        scheduleId: parseInt(scheduleId, 10), 
        attendanceDate: date,
        status: status as string,
        recordedBy: lecturerId,
      });
    });

    await Promise.all(promises);
    
    return NextResponse.json({ message: 'Attendance saved successfully' });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 