-- Create missing tables for the complete system

-- Academic Terms table
CREATE TABLE IF NOT EXISTS academic_terms (
    term_id SERIAL PRIMARY KEY,
    term_name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    max_score DECIMAL(5,2) NOT NULL,
    weight DECIMAL(3,2) NOT NULL,
    assignment_type VARCHAR(50) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    term_id INT REFERENCES academic_terms(term_id) ON DELETE CASCADE,
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Grades table
CREATE TABLE IF NOT EXISTS grades (
    grade_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    assignment_id INT REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    comments TEXT,
    graded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, assignment_id)
);

-- Class Schedules table
CREATE TABLE IF NOT EXISTS class_schedules (
    schedule_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    lecturer_id INT REFERENCES lecturers(lecturer_id) ON DELETE CASCADE,
    term_id INT REFERENCES academic_terms(term_id) ON DELETE CASCADE,
    room_number VARCHAR(20),
    building VARCHAR(50),
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    schedule_id INT REFERENCES class_schedules(schedule_id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    notes TEXT,
    recorded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, attendance_date)
);

-- Attendance Summary table
CREATE TABLE IF NOT EXISTS attendance_summary (
    summary_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    term_id INT REFERENCES academic_terms(term_id) ON DELETE CASCADE,
    total_classes INT DEFAULT 0,
    classes_present INT DEFAULT 0,
    classes_absent INT DEFAULT 0,
    classes_late INT DEFAULT 0,
    classes_excused INT DEFAULT 0,
    attendance_percentage DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, term_id)
);

-- Attendance Alerts table
CREATE TABLE IF NOT EXISTS attendance_alerts (
    alert_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    term_id INT REFERENCES academic_terms(term_id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    alert_message TEXT NOT NULL,
    threshold_value DECIMAL(5,2),
    current_value DECIMAL(5,2),
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs table
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

-- Insert default academic term
INSERT INTO academic_terms (term_name, start_date, end_date, is_active) VALUES 
('Fall 2024', '2024-09-01', '2024-12-20', true),
('Spring 2025', '2025-01-15', '2025-05-15', false)
ON CONFLICT DO NOTHING;

-- Insert sample assignments
INSERT INTO assignments (course_id, title, description, max_score, weight, assignment_type, due_date, term_id, created_by) VALUES 
(1, 'Data Structures Quiz 1', 'Basic concepts of arrays and linked lists', 100.00, 0.15, 'quiz', '2024-10-15 23:59:00', 1, 4),
(1, 'Data Structures Project', 'Implementation of binary search tree', 200.00, 0.30, 'project', '2024-11-20 23:59:00', 1, 4),
(2, 'Database Design Assignment', 'ERD and normalization', 150.00, 0.25, 'assignment', '2024-10-30 23:59:00', 1, 5),
(3, 'Software Requirements Document', 'Requirements gathering and documentation', 300.00, 0.40, 'project', '2024-12-10 23:59:00', 1, 6)
ON CONFLICT DO NOTHING;

-- Insert sample grades
INSERT INTO grades (student_id, assignment_id, course_id, score, graded_by) VALUES 
(1, 1, 1, 85.00, 4),
(1, 2, 1, 180.00, 4),
(2, 1, 1, 92.00, 4),
(2, 3, 2, 140.00, 5),
(3, 3, 2, 125.00, 5),
(4, 1, 1, 78.00, 4),
(5, 3, 2, 135.00, 5),
(6, 1, 1, 88.00, 4)
ON CONFLICT DO NOTHING;

-- Insert sample class schedules
INSERT INTO class_schedules (course_id, lecturer_id, term_id, room_number, building, day_of_week, start_time, end_time) VALUES 
(1, 1, 1, '101', 'Engineering Building', 'Monday', '09:00:00', '10:30:00'),
(1, 1, 1, '101', 'Engineering Building', 'Wednesday', '09:00:00', '10:30:00'),
(2, 2, 1, '202', 'Engineering Building', 'Tuesday', '11:00:00', '12:30:00'),
(2, 2, 1, '202', 'Engineering Building', 'Thursday', '11:00:00', '12:30:00'),
(3, 3, 1, '303', 'Engineering Building', 'Monday', '14:00:00', '15:30:00'),
(3, 3, 1, '303', 'Engineering Building', 'Wednesday', '14:00:00', '15:30:00')
ON CONFLICT DO NOTHING;

-- Add comments to new tables
COMMENT ON TABLE academic_terms IS 'Academic terms/semesters';
COMMENT ON TABLE assignments IS 'Course assignments and assessments';
COMMENT ON TABLE grades IS 'Student grades for assignments';
COMMENT ON TABLE class_schedules IS 'Class schedules and timetables';
COMMENT ON TABLE attendance IS 'Student attendance records';
COMMENT ON TABLE attendance_summary IS 'Attendance summary statistics';
COMMENT ON TABLE attendance_alerts IS 'Attendance alerts and notifications';
COMMENT ON TABLE activity_logs IS 'System activity logging'; 