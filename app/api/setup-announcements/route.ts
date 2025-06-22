import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const client = await pool.connect()
    
    console.log('Setting up announcements table...')
    
    // Create announcements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        announcement_id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        announcement_type VARCHAR(50) DEFAULT 'general',
        priority VARCHAR(20) DEFAULT 'normal',
        target_audience VARCHAR(50) DEFAULT 'all',
        course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
        author_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        is_active BOOLEAN DEFAULT true,
        publish_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expiry_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)
    
    // Insert sample announcements
    await client.query(`
      INSERT INTO announcements (title, content, announcement_type, priority, target_audience, author_id) VALUES
      ('Welcome to Fall 2024 Semester', 'Welcome back students! Classes begin on September 1st, 2024. Please check your schedules and ensure all fees are paid.', 'academic', 'high', 'students', 1),
      ('Midterm Exam Schedule', 'Midterm examinations will be held from October 15-20, 2024. Please check the exam schedule posted on the notice board.', 'academic', 'high', 'students', 1),
      ('Faculty Meeting', 'All faculty members are requested to attend the monthly meeting on Friday at 2 PM in the conference room.', 'general', 'normal', 'lecturers', 1),
      ('Library Hours Extended', 'The library will now be open until 10 PM on weekdays to accommodate evening study sessions.', 'general', 'normal', 'all', 1)
      ON CONFLICT DO NOTHING;
    `)
    
    // Check if announcements were created
    const result = await client.query('SELECT COUNT(*) FROM announcements')
    const count = result.rows[0].count
    
    client.release()
    
    return NextResponse.json({
      success: true,
      message: 'Announcements table created and populated successfully',
      announcementsCount: parseInt(count)
    })
    
  } catch (error) {
    console.error('Error setting up announcements:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 