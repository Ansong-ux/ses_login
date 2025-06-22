-- Grade Management System
-- =======================

-- Academic Terms/Semesters
CREATE TABLE IF NOT EXISTS academic_terms (
    term_id SERIAL PRIMARY KEY,
    term_name VARCHAR(50) NOT NULL, -- e.g., "Fall 2024", "Spring 2025"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assignments/Assessments
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    max_score DECIMAL(5,2) NOT NULL,
    weight DECIMAL(5,2) NOT NULL, -- Percentage weight in final grade
    due_date TIMESTAMP WITH TIME ZONE,
    assignment_type VARCHAR(50) DEFAULT 'assignment', -- assignment, quiz, exam, project
    term_id INT REFERENCES academic_terms(term_id),
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student Grades
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

-- Course Grades Summary (calculated)
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

-- Enhanced Role-based Access Control
-- =================================

-- User Roles (extended)
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255);

-- Role Permissions Template
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    permissions JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions for better security
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default role permissions
INSERT INTO role_permissions (role_name, permissions, description) VALUES
('admin', '{
    "dashboard": ["read", "write"],
    "students": ["read", "write", "delete"],
    "courses": ["read", "write", "delete"],
    "lecturers": ["read", "write", "delete"],
    "fees": ["read", "write", "delete"],
    "grades": ["read", "write", "delete"],
    "users": ["read", "write", "delete"],
    "reports": ["read", "write"],
    "settings": ["read", "write"]
}', 'Full system access'),
('lecturer', '{
    "dashboard": ["read"],
    "students": ["read"],
    "courses": ["read"],
    "grades": ["read", "write"],
    "reports": ["read"]
}', 'Can manage grades and view course data'),
('student', '{
    "dashboard": ["read"],
    "grades": ["read"],
    "fees": ["read"]
}', 'Can view own grades and fees'),
('ta', '{
    "dashboard": ["read"],
    "students": ["read"],
    "grades": ["read", "write"],
    "reports": ["read"]
}', 'Teaching Assistant permissions')
ON CONFLICT (role_name) DO NOTHING;

-- Insert sample academic term
INSERT INTO academic_terms (term_name, start_date, end_date, is_active) VALUES
('Fall 2024', '2024-09-01', '2024-12-20', true),
('Spring 2025', '2025-01-15', '2025-05-10', false)
ON CONFLICT DO NOTHING;

-- Add comments
COMMENT ON TABLE academic_terms IS 'Academic terms/semesters';
COMMENT ON TABLE assignments IS 'Course assignments and assessments';
COMMENT ON TABLE grades IS 'Individual student grades for assignments';
COMMENT ON TABLE course_grades IS 'Calculated final grades for courses';
COMMENT ON TABLE role_permissions IS 'Role-based permission templates';
COMMENT ON TABLE user_sessions IS 'User session management for security';
COMMENT ON TABLE activity_logs IS 'System activity audit trail'; 