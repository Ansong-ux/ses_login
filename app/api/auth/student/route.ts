import { NextResponse } from 'next/server';
import { getStudents } from '@/lib/db';

// This runs when you GET /api/auth/student
export async function GET() {
    try {
        const students = await getStudents();
        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
} 