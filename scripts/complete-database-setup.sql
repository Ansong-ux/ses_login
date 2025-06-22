-- Complete Database Setup for Computer Engineering Department System
-- Run this script in your PostgreSQL database to fix all issues

-- 1. Create academic_terms table
CREATE TABLE IF NOT EXISTS academic_terms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample academic terms
INSERT INTO academic_terms (name, start_date, end_date, is_active) VALUES
('2024/2025 First Semester', '2024-09-01', '2024-12-31', true),
('2024/2025 Second Semester', '2025-01-01', '2025-05-31', false),
('2023/2024 First Semester', '2023-09-01', '2023-12-31', false),
('2023/2024 Second Semester', '2024-01-01', '2024-05-31', false)
ON CONFLICT DO NOTHING;

-- 2. Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    total_points INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create student_assignments table for submissions
CREATE TABLE IF NOT EXISTS student_assignments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER,
    assignment_id INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(500),
    grade DECIMAL(5,2),
    feedback TEXT,
    UNIQUE(student_id, assignment_id)
);

-- 4. Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Update existing users with placeholder names if they don't have first_name/last_name
UPDATE users 
SET first_name = COALESCE(first_name, 'Student'),
    last_name = COALESCE(last_name, 'User')
WHERE first_name IS NULL OR last_name IS NULL;

-- 5. Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits INTEGER DEFAULT 3,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample courses if they don't exist
INSERT INTO courses (course_code, course_name, credits, description) VALUES
('SENG 101', 'Calculus I (+pre-Maths): Single Variable', 4, 'Introduction to calculus and mathematical foundations'),
('SENG 103', 'Mechanics I: Statics', 3, 'Static equilibrium and force analysis'),
('SENG 105', 'Engineering Graphics', 3, 'Technical drawing and CAD fundamentals'),
('SENG 107', 'Introduction to Engineering', 2, 'Overview of engineering disciplines and practices'),
('SENG 111', 'General Physics', 3, 'Fundamental physics principles for engineers'),
('CPEN 103', 'Computer Engineering Innovations', 3, 'Introduction to computer engineering concepts'),
('UGRC 110', 'Academic Writing I', 3, 'Academic writing and communication skills'),
('SENG 102', 'Calculus II: Multivariable', 4, 'Advanced calculus and multivariable functions'),
('SENG 104', 'Mechanics II: Dynamics', 3, 'Dynamic systems and motion analysis'),
('SENG 106', 'Applied Electricity', 3, 'Electrical circuit analysis and applications'),
('SENG 108', 'Basic Electronics', 3, 'Electronic components and circuit design'),
('SENG 112', 'Engineering Computational Tools', 3, 'Programming and computational methods'),
('CPEN 104', 'Engineering Design', 2, 'Engineering design principles and methodology'),
('UGRC 150', 'Critical Thinking & Practical Reasoning', 3, 'Logical reasoning and critical analysis')
ON CONFLICT (course_code) DO NOTHING;

-- 6. Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    level INTEGER DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample students if they don't exist
INSERT INTO students (student_id, first_name, last_name, email, phone, level) VALUES
('STU001', 'John', 'Doe', 'john.doe@student.edu', '+233-20-123-4567', 100),
('STU002', 'Jane', 'Smith', 'jane.smith@student.edu', '+233-20-123-4568', 100),
('STU003', 'Michael', 'Johnson', 'michael.johnson@student.edu', '+233-20-123-4569', 200),
('STU004', 'Sarah', 'Williams', 'sarah.williams@student.edu', '+233-20-123-4570', 200),
('STU005', 'David', 'Brown', 'david.brown@student.edu', '+233-20-123-4571', 300)
ON CONFLICT (student_id) DO NOTHING;

-- 7. Create lecturers table if it doesn't exist
CREATE TABLE IF NOT EXISTS lecturers (
    id SERIAL PRIMARY KEY,
    lecturer_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample lecturers if they don't exist
INSERT INTO lecturers (lecturer_id, first_name, last_name, email, phone, department) VALUES
('LEC001', 'Dr. Robert', 'Wilson', 'robert.wilson@faculty.edu', '+233-20-123-4572', 'Computer Engineering'),
('LEC002', 'Dr. Mary', 'Davis', 'mary.davis@faculty.edu', '+233-20-123-4573', 'Mathematics'),
('LEC003', 'Prof. James', 'Miller', 'james.miller@faculty.edu', '+233-20-123-4574', 'Physics'),
('LEC004', 'Dr. Lisa', 'Garcia', 'lisa.garcia@faculty.edu', '+233-20-123-4575', 'Electrical Engineering'),
('LEC005', 'Prof. Thomas', 'Martinez', 'thomas.martinez@faculty.edu', '+233-20-123-4576', 'Mechanical Engineering')
ON CONFLICT (lecturer_id) DO NOTHING;

-- 8. Create fees table if it doesn't exist
CREATE TABLE IF NOT EXISTS fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create fee_structure table if it doesn't exist
CREATE TABLE IF NOT EXISTS fee_structure (
    level INTEGER PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL
);

-- Insert fee structure if it doesn't exist
INSERT INTO fee_structure (level, amount) VALUES
(100, 5500.00),
(200, 5500.00),
(300, 6000.00),
(400, 6000.00)
ON CONFLICT (level) DO NOTHING;

-- 10. Insert sample assignments
INSERT INTO assignments (course_id, title, description, due_date, total_points) VALUES
(1, 'Engineering Mathematics Assignment 1', 'Complete problems 1-10 from Chapter 2', '2024-10-15 23:59:00', 100),
(1, 'Engineering Mathematics Assignment 2', 'Complete problems 1-15 from Chapter 3', '2024-11-01 23:59:00', 100),
(2, 'Applied Electricity Lab Report', 'Submit lab report for circuit analysis experiment', '2024-10-20 23:59:00', 50),
(3, 'Engineering Graphics Project', 'Complete CAD drawing of mechanical component', '2024-11-10 23:59:00', 100),
(4, 'Communication Skills Essay', 'Write a 1000-word essay on technical communication', '2024-10-25 23:59:00', 75),
(5, 'Computer Hardware Report', 'Submit report on CPU architecture analysis', '2024-11-05 23:59:00', 100)
ON CONFLICT DO NOTHING;

-- 11. Insert sample student assignment submissions
INSERT INTO student_assignments (student_id, assignment_id, grade, feedback) VALUES
(1, 1, 85.5, 'Good work on most problems. Review problem 7.'),
(1, 2, 92.0, 'Excellent work!'),
(1, 3, 45.0, 'Lab report needs more detail in methodology section.'),
(2, 1, 78.0, 'Good effort. Check your calculations in problems 3 and 8.'),
(2, 2, 88.5, 'Well done overall.'),
(3, 1, 95.0, 'Outstanding work!'),
(3, 3, 48.0, 'Good lab work but report needs improvement.')
ON CONFLICT DO NOTHING;

-- 12. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_student_id ON student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_assignment_id ON student_assignments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_academic_terms_active ON academic_terms(is_active);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_lecturers_email ON lecturers(email);
CREATE INDEX IF NOT EXISTS idx_fees_student_id ON fees(student_id);

-- 13. Create announcements table if it doesn't exist
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample announcements
INSERT INTO announcements (title, content, author_id) VALUES
('Welcome to the New Academic Year', 'Welcome all students to the 2024/2025 academic year. Please check your course schedules and ensure all fees are paid.', 1),
('Assignment Submission Guidelines', 'All assignments must be submitted through the online portal. Late submissions will not be accepted without prior approval.', 1),
('Library Hours Update', 'The library will now be open from 8:00 AM to 10:00 PM on weekdays and 9:00 AM to 6:00 PM on weekends.', 1),
('Career Fair Announcement', 'The annual engineering career fair will be held on November 15th. All students are encouraged to attend.', 1),
('Exam Schedule Released', 'The final examination schedule for the current semester has been released. Please check your student portal.', 1)
ON CONFLICT DO NOTHING;

-- Print completion message
SELECT 'Database setup completed successfully!' as status;
SELECT 'Tables created/updated: academic_terms, assignments, student_assignments, courses, students, lecturers, fees, announcements' as tables_updated;
SELECT 'Sample data inserted for testing' as data_status; 