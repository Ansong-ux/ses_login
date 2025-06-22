-- MySQL Database Setup for Computer Engineering Department System
-- This script creates all necessary tables and sample data

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ce_department_db;
USE ce_department_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role ENUM('admin', 'lecturer', 'student') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    level INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lecturers table
CREATE TABLE IF NOT EXISTS lecturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits INT DEFAULT 3,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create academic_terms table
CREATE TABLE IF NOT EXISTS academic_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    total_points INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create student_assignments table
CREATE TABLE IF NOT EXISTS student_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    assignment_id INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(500),
    grade DECIMAL(5,2),
    feedback TEXT,
    UNIQUE KEY unique_student_assignment (student_id, assignment_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);

-- Create fees table
CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Create fee_structure table
CREATE TABLE IF NOT EXISTS fee_structure (
    level INT PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

-- Insert sample data

-- Insert sample students
INSERT INTO students (student_id, first_name, last_name, email, phone, level) VALUES
('STU001', 'John', 'Doe', 'john.doe@student.edu', '+233-20-123-4567', 100),
('STU002', 'Jane', 'Smith', 'jane.smith@student.edu', '+233-20-123-4568', 100),
('STU003', 'Michael', 'Johnson', 'michael.johnson@student.edu', '+233-20-123-4569', 200)
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);

-- Insert sample lecturers
INSERT INTO lecturers (lecturer_id, first_name, last_name, email, phone, department) VALUES
('LEC001', 'Dr. Robert', 'Wilson', 'robert.wilson@faculty.edu', '+233-20-123-4572', 'Computer Engineering'),
('LEC002', 'Dr. Mary', 'Davis', 'mary.davis@faculty.edu', '+233-20-123-4573', 'Mathematics'),
('LEC003', 'Prof. James', 'Miller', 'james.miller@faculty.edu', '+233-20-123-4574', 'Physics')
ON DUPLICATE KEY UPDATE first_name = VALUES(first_name);

-- Insert sample courses
INSERT INTO courses (course_code, course_name, credits, description) VALUES
('SENG 101', 'Calculus I (+pre-Maths): Single Variable', 4, 'Introduction to calculus and mathematical foundations'),
('SENG 103', 'Mechanics I: Statics', 3, 'Static equilibrium and force analysis'),
('SENG 105', 'Engineering Graphics', 3, 'Technical drawing and CAD fundamentals'),
('SENG 107', 'Introduction to Engineering', 2, 'Overview of engineering disciplines and practices'),
('SENG 111', 'General Physics', 3, 'Fundamental physics principles for engineers'),
('CPEN 103', 'Computer Engineering Innovations', 3, 'Introduction to computer engineering concepts'),
('UGRC 110', 'Academic Writing I', 3, 'Academic writing and communication skills')
ON DUPLICATE KEY UPDATE course_name = VALUES(course_name);

-- Insert sample academic terms
INSERT INTO academic_terms (name, start_date, end_date, is_active) VALUES
('2024/2025 First Semester', '2024-09-01', '2024-12-31', TRUE),
('2024/2025 Second Semester', '2025-01-01', '2025-05-31', FALSE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample assignments
INSERT INTO assignments (course_id, title, description, due_date, total_points) VALUES
(1, 'Engineering Mathematics Assignment 1', 'Complete problems 1-10 from Chapter 2', '2024-10-15 23:59:00', 100),
(1, 'Engineering Mathematics Assignment 2', 'Complete problems 1-15 from Chapter 3', '2024-11-01 23:59:00', 100),
(2, 'Applied Electricity Lab Report', 'Submit lab report for circuit analysis experiment', '2024-10-20 23:59:00', 50),
(3, 'Engineering Graphics Project', 'Complete CAD drawing of mechanical component', '2024-11-10 23:59:00', 100);

-- Insert sample fees
INSERT INTO fees (student_id, amount_paid, payment_method, reference_number) VALUES
(1, 500.00, 'Bank Transfer', 'REF001'),
(2, 750.00, 'Mobile Money', 'REF002'),
(3, 1000.00, 'Cash', 'REF003');

-- Insert fee structure
INSERT INTO fee_structure (level, amount) VALUES
(100, 5500.00),
(200, 5500.00),
(300, 6000.00),
(400, 6000.00)
ON DUPLICATE KEY UPDATE amount = VALUES(amount);

-- Insert sample announcements
INSERT INTO announcements (title, content, author_id) VALUES
('Welcome to the New Academic Year', 'Welcome all students to the 2024/2025 academic year. Please check your course schedules and ensure all fees are paid.', 1),
('Assignment Submission Guidelines', 'All assignments must be submitted through the online portal. Late submissions will not be accepted without prior approval.', 1),
('Library Hours Update', 'The library will now be open from 8:00 AM to 10:00 PM on weekdays and 9:00 AM to 6:00 PM on weekends.', 1);

-- Create indexes for better performance
CREATE INDEX idx_assignments_course_id ON assignments(course_id);
CREATE INDEX idx_student_assignments_student_id ON student_assignments(student_id);
CREATE INDEX idx_student_assignments_assignment_id ON student_assignments(assignment_id);
CREATE INDEX idx_academic_terms_active ON academic_terms(is_active);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_lecturers_email ON lecturers(email);
CREATE INDEX idx_fees_student_id ON fees(student_id);

-- Show completion message
SELECT 'Database setup completed successfully!' as status;
SELECT 'All tables and sample data have been created' as details; 