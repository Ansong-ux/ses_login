-- Fix Database Issues
-- ===================

-- 1. Create missing grades table
CREATE TABLE IF NOT EXISTS grades (
    grade_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    assignment_id INT REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (score / (SELECT max_score FROM assignments WHERE assignment_id = grades.assignment_id) * 100) STORED,
    letter_grade VARCHAR(2) GENERATED ALWAYS AS (
        CASE 
            WHEN percentage >= 90 THEN 'A'
            WHEN percentage >= 80 THEN 'B'
            WHEN percentage >= 70 THEN 'C'
            WHEN percentage >= 60 THEN 'D'
            ELSE 'F'
        END
    ) STORED,
    comments TEXT,
    graded_by INT REFERENCES users(user_id),
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create missing assignments table
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    term_id INT REFERENCES academic_terms(term_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    max_score DECIMAL(5,2) NOT NULL,
    weight DECIMAL(5,2) DEFAULT 100.00,
    assignment_type VARCHAR(50) DEFAULT 'assignment', -- assignment, quiz, exam, project
    due_date TIMESTAMP WITH TIME ZONE,
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create missing academic_terms table
CREATE TABLE IF NOT EXISTS academic_terms (
    term_id SERIAL PRIMARY KEY,
    term_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create missing course_grades table
CREATE TABLE IF NOT EXISTS course_grades (
    course_grade_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    term_id INT REFERENCES academic_terms(term_id),
    total_score DECIMAL(5,2),
    final_percentage DECIMAL(5,2),
    final_letter_grade VARCHAR(2),
    gpa_points DECIMAL(3,2) GENERATED ALWAYS AS (
        CASE 
            WHEN final_letter_grade = 'A' THEN 4.0
            WHEN final_letter_grade = 'B' THEN 3.0
            WHEN final_letter_grade = 'C' THEN 2.0
            WHEN final_letter_grade = 'D' THEN 1.0
            ELSE 0.0
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, term_id)
);

-- 5. Create missing enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'enrolled', -- enrolled, dropped, completed, failed
    grade VARCHAR(2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

-- 6. Create missing student_assignments table
CREATE TABLE IF NOT EXISTS student_assignments (
    submission_id SERIAL PRIMARY KEY,
    assignment_id INT REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    submission_comment TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    submission_status VARCHAR(20) DEFAULT 'pending', -- pending, submitted, late, graded
    grade DECIMAL(5,2),
    feedback TEXT,
    graded_by INT REFERENCES users(user_id),
    graded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

-- 7. Add missing columns to courses table
DO $$
BEGIN
    -- Add max_capacity column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'max_capacity') THEN
        ALTER TABLE courses ADD COLUMN max_capacity INT DEFAULT 30;
    END IF;
    
    -- Add is_active column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'is_active') THEN
        ALTER TABLE courses ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Add prerequisites column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'prerequisites') THEN
        ALTER TABLE courses ADD COLUMN prerequisites TEXT;
    END IF;
    
    -- Add semester column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'semester') THEN
        ALTER TABLE courses ADD COLUMN semester VARCHAR(20) DEFAULT 'Fall';
    END IF;
END $$;

-- 8. Insert sample academic terms
INSERT INTO academic_terms (term_name, start_date, end_date, is_active) VALUES
('Fall 2024', '2024-09-01', '2024-12-20', true),
('Spring 2025', '2025-01-15', '2025-05-15', false)
ON CONFLICT DO NOTHING;

-- 9. Insert sample assignments
INSERT INTO assignments (course_id, term_id, title, description, max_score, weight, assignment_type, due_date, created_by) VALUES
(1, 1, 'Introduction to Programming Quiz', 'Basic programming concepts quiz', 100.00, 10.00, 'quiz', '2024-09-15 23:59:00', 1),
(1, 1, 'Programming Assignment 1', 'Write a simple calculator program', 100.00, 20.00, 'assignment', '2024-09-30 23:59:00', 1),
(2, 1, 'Mathematics Midterm', 'Midterm examination covering calculus', 100.00, 30.00, 'exam', '2024-10-15 23:59:00', 1)
ON CONFLICT DO NOTHING;

-- 10. Insert sample grades
INSERT INTO grades (student_id, assignment_id, course_id, score, comments, graded_by) VALUES
(1, 1, 1, 85.00, 'Good work on basic concepts', 1),
(1, 2, 1, 92.00, 'Excellent implementation', 1),
(1, 3, 2, 78.00, 'Needs improvement in calculus', 1),
(2, 1, 1, 90.00, 'Very good understanding', 1),
(2, 2, 1, 88.00, 'Good work, minor issues', 1)
ON CONFLICT DO NOTHING;

-- 11. Insert sample enrollments
INSERT INTO enrollments (student_id, course_id, enrollment_date, status) VALUES
(1, 1, '2024-09-01 10:00:00', 'enrolled'),
(1, 2, '2024-09-01 10:30:00', 'enrolled'),
(2, 1, '2024-09-01 11:00:00', 'enrolled'),
(3, 3, '2024-09-01 11:30:00', 'enrolled')
ON CONFLICT DO NOTHING;

-- 12. Insert sample student assignments
INSERT INTO student_assignments (assignment_id, student_id, submission_status, submitted_at) VALUES
(1, 1, 'submitted', '2024-09-14 15:30:00'),
(2, 1, 'pending', NULL),
(1, 2, 'submitted', '2024-09-14 16:45:00'),
(3, 1, 'pending', NULL)
ON CONFLICT DO NOTHING;

-- 13. Update courses with missing data
UPDATE courses SET 
    max_capacity = COALESCE(max_capacity, 30),
    is_active = COALESCE(is_active, true),
    semester = COALESCE(semester, 'Fall 2024'),
    prerequisites = COALESCE(prerequisites, 'None')
WHERE max_capacity IS NULL OR is_active IS NULL OR semester IS NULL OR prerequisites IS NULL;

-- 14. Fix users table if it doesn't have first_name and last_name columns
-- First, check if the columns exist
DO $$
BEGIN
    -- Add first_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'first_name') THEN
        ALTER TABLE users ADD COLUMN first_name VARCHAR(50);
    END IF;
    
    -- Add last_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_name') THEN
        ALTER TABLE users ADD COLUMN last_name VARCHAR(50);
    END IF;
END $$;

-- 15. Update existing users with sample names if they don't have names
UPDATE users SET 
    first_name = COALESCE(first_name, 'Admin'),
    last_name = COALESCE(last_name, 'User')
WHERE first_name IS NULL OR last_name IS NULL;

-- 16. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_grades_student ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_assignment ON grades(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_assignments_term ON assignments(term_id);
CREATE INDEX IF NOT EXISTS idx_course_grades_student ON course_grades(student_id);
CREATE INDEX IF NOT EXISTS idx_course_grades_course ON course_grades(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);
CREATE INDEX IF NOT EXISTS idx_student_assignments_assignment ON student_assignments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_student ON student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_status ON student_assignments(submission_status);

-- 17. Add comments
COMMENT ON TABLE grades IS 'Student grades for individual assignments';
COMMENT ON TABLE assignments IS 'Course assignments, quizzes, and exams';
COMMENT ON TABLE academic_terms IS 'Academic terms/semesters';
COMMENT ON TABLE course_grades IS 'Calculated final grades for courses';
COMMENT ON TABLE enrollments IS 'Student course enrollments and registration';
COMMENT ON TABLE student_assignments IS 'Student assignment submissions and grades';

-- 18. Verify tables were created
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_name IN ('grades', 'assignments', 'academic_terms', 'course_grades', 'enrollments', 'student_assignments')
AND table_schema = 'public'; 