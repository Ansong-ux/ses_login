-- Fix missing database tables and columns

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
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
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
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
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

-- 5. Insert sample assignments
INSERT INTO assignments (course_id, title, description, due_date, total_points) VALUES
(1, 'Engineering Mathematics Assignment 1', 'Complete problems 1-10 from Chapter 2', '2024-10-15 23:59:00', 100),
(1, 'Engineering Mathematics Assignment 2', 'Complete problems 1-15 from Chapter 3', '2024-11-01 23:59:00', 100),
(2, 'Applied Electricity Lab Report', 'Submit lab report for circuit analysis experiment', '2024-10-20 23:59:00', 50),
(3, 'Engineering Graphics Project', 'Complete CAD drawing of mechanical component', '2024-11-10 23:59:00', 100),
(4, 'Communication Skills Essay', 'Write a 1000-word essay on technical communication', '2024-10-25 23:59:00', 75),
(5, 'Computer Hardware Report', 'Submit report on CPU architecture analysis', '2024-11-05 23:59:00', 100)
ON CONFLICT DO NOTHING;

-- 6. Insert sample student assignment submissions
INSERT INTO student_assignments (student_id, assignment_id, grade, feedback) VALUES
(2, 1, 85.5, 'Good work on most problems. Review problem 7.'),
(2, 2, 92.0, 'Excellent work!'),
(2, 3, 45.0, 'Lab report needs more detail in methodology section.'),
(3, 1, 78.0, 'Good effort. Check your calculations in problems 3 and 8.'),
(3, 2, 88.5, 'Well done overall.'),
(4, 1, 95.0, 'Outstanding work!'),
(4, 3, 48.0, 'Good lab work but report needs improvement.')
ON CONFLICT DO NOTHING;

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assignments_course_id ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_student_id ON student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_assignment_id ON student_assignments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_academic_terms_active ON academic_terms(is_active); 