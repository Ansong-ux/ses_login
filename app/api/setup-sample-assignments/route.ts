import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// POST /api/setup-sample-assignments - Add sample assignments to the database
export async function POST(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // First, make sure we have academic terms
      await client.query(`
        INSERT INTO academic_terms (term_name, start_date, end_date, is_active) VALUES
        ('Fall 2024', '2024-09-01', '2024-12-20', true),
        ('Spring 2025', '2025-01-15', '2025-05-15', false)
        ON CONFLICT DO NOTHING;
      `);
      
      // Add sample assignments
      await client.query(`
        INSERT INTO assignments (course_id, term_id, title, description, max_score, weight, assignment_type, due_date, created_by) VALUES
        (1, 1, 'Introduction to Programming Quiz', 'Basic programming concepts quiz covering variables, loops, and functions', 100.00, 10.00, 'quiz', '2024-09-15 23:59:00', 1),
        (1, 1, 'Programming Assignment 1', 'Write a simple calculator program that can perform basic arithmetic operations', 100.00, 20.00, 'assignment', '2024-09-30 23:59:00', 1),
        (2, 1, 'Mathematics Midterm', 'Midterm examination covering calculus, algebra, and trigonometry', 100.00, 30.00, 'exam', '2024-10-15 23:59:00', 1),
        (1, 1, 'Final Project', 'Create a complete web application using HTML, CSS, and JavaScript', 100.00, 40.00, 'project', '2024-12-10 23:59:00', 1),
        (3, 1, 'Database Design Assignment', 'Design and implement a simple database schema', 100.00, 25.00, 'assignment', '2024-10-30 23:59:00', 1)
        ON CONFLICT DO NOTHING;
      `);
      
      // Add sample enrollments
      await client.query(`
        INSERT INTO enrollments (student_id, course_id, enrollment_date, status) VALUES
        (1, 1, '2024-09-01 10:00:00', 'enrolled'),
        (1, 2, '2024-09-01 10:30:00', 'enrolled'),
        (2, 1, '2024-09-01 11:00:00', 'enrolled'),
        (3, 3, '2024-09-01 11:30:00', 'enrolled')
        ON CONFLICT DO NOTHING;
      `);
      
      // Add sample student assignments (some submitted, some pending)
      await client.query(`
        INSERT INTO student_assignments (assignment_id, student_id, submission_status, submitted_at) VALUES
        (1, 1, 'submitted', '2024-09-14 15:30:00'),
        (2, 1, 'pending', NULL),
        (1, 2, 'submitted', '2024-09-14 16:45:00'),
        (3, 1, 'pending', NULL),
        (4, 1, 'pending', NULL),
        (5, 3, 'submitted', '2024-10-25 14:20:00')
        ON CONFLICT DO NOTHING;
      `);
      
      // Add some grades for submitted assignments
      await client.query(`
        INSERT INTO grades (student_id, assignment_id, course_id, score, comments, graded_by) VALUES
        (1, 1, 1, 85.00, 'Good work on basic concepts', 1),
        (2, 1, 1, 90.00, 'Very good understanding', 1),
        (3, 5, 3, 92.00, 'Excellent database design', 1)
        ON CONFLICT DO NOTHING;
      `);
      
      await client.query('COMMIT');
      
      return NextResponse.json({
        success: true,
        message: 'Sample assignments, enrollments, and grades added successfully'
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error('Setup sample assignments error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to setup sample assignments' },
      { status: 500 }
    );
  }
} 