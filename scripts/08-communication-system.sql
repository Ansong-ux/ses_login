-- Communication System
-- ====================

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
    announcement_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) DEFAULT 'general', -- general, academic, event, emergency
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    target_audience VARCHAR(50) DEFAULT 'all', -- all, students, lecturers, staff, specific_course
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    author_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    publish_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Internal Messages
CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    recipient_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Message Attachments
CREATE TABLE IF NOT EXISTS message_attachments (
    attachment_id SERIAL PRIMARY KEY,
    message_id INT REFERENCES messages(message_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    file_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- attendance, grade, fee, announcement, message
    reference_id INT, -- ID of related record (attendance_id, grade_id, etc.)
    reference_table VARCHAR(50), -- Table name for the reference
    is_read BOOLEAN DEFAULT false,
    is_important BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Calendar Events
CREATE TABLE IF NOT EXISTS calendar_events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) DEFAULT 'general', -- general, academic, exam, holiday, meeting
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(200),
    organizer_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    target_audience VARCHAR(50) DEFAULT 'all', -- all, students, lecturers, staff
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    is_all_day BOOLEAN DEFAULT false,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Event Participants
CREATE TABLE IF NOT EXISTS event_participants (
    participant_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES calendar_events(event_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    response VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, maybe
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Insert sample announcements
INSERT INTO announcements (title, content, announcement_type, priority, target_audience, author_id) VALUES
('Welcome to Fall 2024 Semester', 'Welcome back students! Classes begin on September 1st, 2024. Please check your schedules and ensure all fees are paid.', 'academic', 'high', 'students', 1),
('Midterm Exam Schedule', 'Midterm examinations will be held from October 15-20, 2024. Please check the exam schedule posted on the notice board.', 'academic', 'high', 'students', 1),
('Faculty Meeting', 'All faculty members are requested to attend the monthly meeting on Friday at 2 PM in the conference room.', 'general', 'normal', 'lecturers', 1),
('Library Hours Extended', 'The library will now be open until 10 PM on weekdays to accommodate evening study sessions.', 'general', 'normal', 'all', 1)
ON CONFLICT DO NOTHING;

-- Insert sample calendar events
INSERT INTO calendar_events (title, description, event_type, start_date, end_date, location, organizer_id, target_audience, color) VALUES
('Fall Semester Begins', 'First day of classes for Fall 2024 semester', 'academic', '2024-09-01 08:00:00', '2024-09-01 17:00:00', 'All Buildings', 1, 'all', '#10B981'),
('Labor Day Holiday', 'University closed for Labor Day', 'holiday', '2024-09-02 00:00:00', '2024-09-02 23:59:59', 'Campus Wide', 1, 'all', '#EF4444'),
('Midterm Examinations', 'Midterm exam period', 'exam', '2024-10-15 08:00:00', '2024-10-20 17:00:00', 'Various Classrooms', 1, 'students', '#F59E0B'),
('Faculty Development Workshop', 'Professional development session for faculty members', 'meeting', '2024-10-25 14:00:00', '2024-10-25 16:00:00', 'Conference Room A', 1, 'lecturers', '#8B5CF6')
ON CONFLICT DO NOTHING;

-- Add comments
COMMENT ON TABLE announcements IS 'System-wide announcements and notifications';
COMMENT ON TABLE messages IS 'Internal messaging system between users';
COMMENT ON TABLE message_attachments IS 'File attachments for messages';
COMMENT ON TABLE notifications IS 'User-specific notifications and alerts';
COMMENT ON TABLE calendar_events IS 'Academic calendar and event management';
COMMENT ON TABLE event_participants IS 'Event participation tracking';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active, publish_date);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(start_date, end_date); 