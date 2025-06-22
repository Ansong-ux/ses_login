-- Parent Portal System
-- ====================

-- Parents table
CREATE TABLE IF NOT EXISTS parents (
    parent_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    relationship VARCHAR(50) DEFAULT 'parent', -- parent, guardian, emergency_contact
    occupation VARCHAR(100),
    employer VARCHAR(100),
    emergency_contact BOOLEAN DEFAULT false,
    can_pickup BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student-Parent Relationships
CREATE TABLE IF NOT EXISTS student_parents (
    relationship_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    parent_id INT REFERENCES parents(parent_id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) DEFAULT 'parent', -- parent, guardian, emergency_contact
    is_primary BOOLEAN DEFAULT false,
    can_view_grades BOOLEAN DEFAULT true,
    can_view_attendance BOOLEAN DEFAULT true,
    can_view_fees BOOLEAN DEFAULT true,
    can_receive_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, parent_id)
);

-- Parent Portal Access
CREATE TABLE IF NOT EXISTS parent_users (
    parent_user_id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES parents(parent_id) ON DELETE CASCADE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Parent Notifications
CREATE TABLE IF NOT EXISTS parent_notifications (
    notification_id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES parents(parent_id) ON DELETE CASCADE,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- grade, attendance, fee, behavior, academic
    reference_id INT,
    reference_table VARCHAR(50),
    is_read BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Parent Communication Log
CREATE TABLE IF NOT EXISTS parent_communications (
    communication_id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES parents(parent_id) ON DELETE CASCADE,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    communication_type VARCHAR(50) NOT NULL, -- email, phone, meeting, note
    subject VARCHAR(200),
    content TEXT,
    initiated_by VARCHAR(50) DEFAULT 'school', -- school, parent
    staff_member_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    communication_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'completed' -- scheduled, completed, cancelled, pending
);

-- Parent Meeting Requests
CREATE TABLE IF NOT EXISTS parent_meetings (
    meeting_id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES parents(parent_id) ON DELETE CASCADE,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    requested_by VARCHAR(50) NOT NULL, -- parent, teacher, admin
    meeting_type VARCHAR(50) DEFAULT 'general', -- general, academic, behavioral, disciplinary
    subject VARCHAR(200) NOT NULL,
    description TEXT,
    preferred_date DATE,
    preferred_time TIME,
    duration_minutes INT DEFAULT 30,
    staff_member_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, scheduled, completed, cancelled
    scheduled_date TIMESTAMP WITH TIME ZONE,
    scheduled_location VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample parents
INSERT INTO parents (first_name, last_name, email, phone, relationship, occupation, emergency_contact, can_pickup) VALUES
('Sarah', 'Johnson', 'sarah.johnson@email.com', '+1234567890', 'parent', 'Software Engineer', true, true),
('Michael', 'Wilson', 'michael.wilson@email.com', '+1234567891', 'parent', 'Business Analyst', true, true),
('Emily', 'Brown', 'emily.brown@email.com', '+1234567892', 'guardian', 'Teacher', true, false),
('David', 'Davis', 'david.davis@email.com', '+1234567893', 'parent', 'Doctor', false, true)
ON CONFLICT DO NOTHING;

-- Insert sample student-parent relationships
INSERT INTO student_parents (student_id, parent_id, relationship_type, is_primary, can_view_grades, can_view_attendance, can_view_fees) VALUES
(1, 1, 'parent', true, true, true, true),
(2, 2, 'parent', true, true, true, true),
(3, 3, 'guardian', true, true, true, true),
(4, 4, 'parent', true, true, true, true)
ON CONFLICT DO NOTHING;

-- Insert sample parent notifications
INSERT INTO parent_notifications (parent_id, student_id, title, message, notification_type, is_important) VALUES
(1, 1, 'Grade Update', 'Alice Johnson received an A in Introduction to Computer Engineering', 'grade', false),
(2, 2, 'Attendance Alert', 'Bob Wilson was absent from Data Structures class today', 'attendance', true),
(3, 3, 'Fee Reminder', 'Outstanding fee payment of $100 for Charlie Brown', 'fee', false),
(4, 4, 'Academic Achievement', 'David Davis has been selected for the Dean\'s List', 'academic', false)
ON CONFLICT DO NOTHING;

-- Add comments
COMMENT ON TABLE parents IS 'Parent and guardian information';
COMMENT ON TABLE student_parents IS 'Student-parent relationship management';
COMMENT ON TABLE parent_users IS 'Parent portal access credentials';
COMMENT ON TABLE parent_notifications IS 'Notifications sent to parents';
COMMENT ON TABLE parent_communications IS 'Communication log with parents';
COMMENT ON TABLE parent_meetings IS 'Parent meeting requests and scheduling';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_parents_student ON student_parents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_parents_parent ON student_parents(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_notifications_parent ON parent_notifications(parent_id, is_read);
CREATE INDEX IF NOT EXISTS idx_parent_communications_parent ON parent_communications(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_meetings_status ON parent_meetings(status, scheduled_date); 