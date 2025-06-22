import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { pool } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

// POST /api/assignments/submit - Submit an assignment
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const assignmentId = formData.get('assignmentId') as string;
    const studentId = formData.get('studentId') as string;
    const comment = formData.get('comment') as string;
    
    if (!file || !assignmentId || !studentId) {
      return NextResponse.json(
        { error: 'File, assignment ID, and student ID are required' },
        { status: 400 }
      );
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported. Please upload PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, or TXT files.' },
        { status: 400 }
      );
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'assignments');
    await mkdir(uploadsDir, { recursive: true });
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `assignment_${assignmentId}_student_${studentId}_${timestamp}${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Save submission to database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Check if submission already exists
      const existingSubmission = await client.query(`
        SELECT submission_id FROM student_assignments 
        WHERE assignment_id = $1 AND student_id = $2
      `, [assignmentId, studentId]);
      
      if (existingSubmission.rows.length > 0) {
        // Update existing submission
        await client.query(`
          UPDATE student_assignments 
          SET 
            file_url = $1,
            file_name = $2,
            submission_comment = $3,
            submitted_at = CURRENT_TIMESTAMP,
            submission_status = 'submitted'
          WHERE assignment_id = $4 AND student_id = $5
        `, [`/uploads/assignments/${fileName}`, file.name, comment, assignmentId, studentId]);
      } else {
        // Create new submission
        await client.query(`
          INSERT INTO student_assignments (
            assignment_id, 
            student_id, 
            file_url, 
            file_name, 
            submission_comment, 
            submitted_at, 
            submission_status
          ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, 'submitted')
        `, [assignmentId, studentId, `/uploads/assignments/${fileName}`, file.name, comment]);
      }
      
      await client.query('COMMIT');
      
      return NextResponse.json({
        success: true,
        message: 'Assignment submitted successfully',
        fileName: file.name,
        fileUrl: `/uploads/assignments/${fileName}`
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error('Assignment submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit assignment' },
      { status: 500 }
    );
  }
} 