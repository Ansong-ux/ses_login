// app/api/students/route.ts

import { NextResponse } from 'next/server';
import { getStudents } from '@/lib/queries';

// This runs when you GET /api/students
export async function GET() {
    const students = await getStudents();
    return NextResponse.json(students);
}
