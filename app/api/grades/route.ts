import { NextRequest, NextResponse } from 'next/server';
import { getAssignments, getStudentCourseGrades, getCourseGradeSummary, upsertGrade, createAssignment, getAcademicTerms } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) {
    throw new Error("No authentication token");
  }

  const decoded = jwt.verify(token.value, JWT_SECRET) as any;
  return decoded;
}

// GET /api/grades - Get assignments and grades
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    const { searchParams } = new URL(request.url);
    
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');
    const termId = searchParams.get('termId');
    const type = searchParams.get('type'); // 'assignments', 'grades', 'summary'

    if (type === 'assignments') {
      const assignments = await getAssignments(
        courseId ? parseInt(courseId) : undefined,
        termId ? parseInt(termId) : undefined
      );
      return NextResponse.json({ assignments });
    }

    if (type === 'grades' && studentId && courseId) {
      const grades = await getStudentCourseGrades(
        parseInt(studentId),
        parseInt(courseId),
        termId ? parseInt(termId) : undefined
      );
      return NextResponse.json({ grades });
    }

    if (type === 'summary' && courseId) {
      const summary = await getCourseGradeSummary(
        parseInt(courseId),
        termId ? parseInt(termId) : undefined
      );
      return NextResponse.json({ summary });
    }

    if (type === 'terms') {
      const terms = await getAcademicTerms();
      return NextResponse.json({ terms });
    }

    return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });

  } catch (error: any) {
    console.error('Grades API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/grades - Create assignment or add grade
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'create_assignment') {
      const assignment = await createAssignment({
        courseId: data.courseId,
        title: data.title,
        description: data.description,
        maxScore: data.maxScore,
        weight: data.weight,
        assignmentType: data.assignmentType,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        termId: data.termId,
        createdBy: user.user_id
      });

      return NextResponse.json({ assignment, message: 'Assignment created successfully' });
    }

    if (action === 'add_grade') {
      const grade = await upsertGrade({
        studentId: data.studentId,
        assignmentId: data.assignmentId,
        courseId: data.courseId,
        score: data.score,
        comments: data.comments,
        gradedBy: user.user_id
      });

      return NextResponse.json({ grade, message: 'Grade added successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Grades API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 