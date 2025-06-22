-- Attendance Management System
-- =============================

-- Class Schedule/Time Table
CREATE TABLE IF NOT EXISTS class_schedules (
    schedule_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    lecturer_id INT REFERENCES lecturers(lecturer_id) ON DELETE CASCADE,
    room_number VARCHAR(20),
    building VARCHAR(50),
    day_of_week VARCHAR(10) NOT NULL, -- Monday, Tuesday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    term_id INT REFERENCES academic_terms(term_id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, day_of_week, start_time, term_id)
);

-- Daily Attendance Records
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    schedule_id INT REFERENCES class_schedules(schedule_id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'present', -- present, absent, late, excused
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    recorded_by INT REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, attendance_date)
);

-- Attendance Summary (calculated)
CREATE TABLE IF NOT EXISTS attendance_summary (
    summary_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    term_id INT REFERENCES academic_terms(term_id),
    total_classes INT DEFAULT 0,
    classes_present INT DEFAULT 0,
    classes_absent INT DEFAULT 0,
    classes_late INT DEFAULT 0,
    classes_excused INT DEFAULT 0,
    attendance_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN total_classes = 0 THEN 0
            ELSE ROUND((classes_present::DECIMAL / total_classes::DECIMAL) * 100, 2)
        END
    ) STORED,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, term_id)
);

-- Attendance Alerts/Notifications
CREATE TABLE IF NOT EXISTS attendance_alerts (
    alert_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- low_attendance, consecutive_absences, etc.
    alert_message TEXT NOT NULL,
    threshold_value INT, -- e.g., attendance percentage or consecutive absences
    current_value INT, -- current attendance percentage or absences
    is_resolved BOOLEAN DEFAULT false,
    resolved_by INT REFERENCES users(user_id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample class schedules
INSERT INTO class_schedules (course_id, lecturer_id, room_number, building, day_of_week, start_time, end_time, term_id) VALUES
(1, 1, '101', 'Engineering Building', 'Monday', '09:00:00', '10:30:00', 1),
(1, 1, '101', 'Engineering Building', 'Wednesday', '09:00:00', '10:30:00', 1),
(2, 2, '202', 'Engineering Building', 'Tuesday', '11:00:00', '12:30:00', 1),
(2, 2, '202', 'Engineering Building', 'Thursday', '11:00:00', '12:30:00', 1),
(3, 3, '303', 'Engineering Building', 'Monday', '14:00:00', '15:30:00', 1),
(3, 3, '303', 'Engineering Building', 'Friday', '14:00:00', '15:30:00', 1)
ON CONFLICT DO NOTHING;

-- Add comments
COMMENT ON TABLE class_schedules IS 'Class schedules and time tables';
COMMENT ON TABLE attendance IS 'Daily attendance records for students';
COMMENT ON TABLE attendance_summary IS 'Calculated attendance summaries';
COMMENT ON TABLE attendance_alerts IS 'Attendance alerts and notifications';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_course_date ON attendance(course_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_schedule_course_term ON class_schedules(course_id, term_id);
CREATE INDEX IF NOT EXISTS idx_attendance_summary_student ON attendance_summary(student_id); 