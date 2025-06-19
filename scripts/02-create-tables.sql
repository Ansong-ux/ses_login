-- Students table: Personal Info
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fees Payments
CREATE TABLE IF NOT EXISTS fees (
    fee_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    credits INT DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Course Enrollment
CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active',
    UNIQUE(student_id, course_id)
);

-- Lecturers
CREATE TABLE IF NOT EXISTS lecturers (
    lecturer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(100) DEFAULT 'Computer Engineering',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lecturer to Course Assignment
CREATE TABLE IF NOT EXISTS lecturer_courses (
    id SERIAL PRIMARY KEY,
    lecturer_id INT REFERENCES lecturers(lecturer_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    semester VARCHAR(20),
    year INT,
    UNIQUE(lecturer_id, course_id, semester, year)
);

-- Lecturer to TA Assignment
CREATE TABLE IF NOT EXISTS lecturer_ta (
    id SERIAL PRIMARY KEY,
    lecturer_id INT REFERENCES lecturers(lecturer_id) ON DELETE CASCADE,
    ta_id INT REFERENCES lecturers(lecturer_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    semester VARCHAR(20),
    year INT
);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    student_id INT REFERENCES students(student_id),
    lecturer_id INT REFERENCES lecturers(lecturer_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add comments to tables
COMMENT ON TABLE students IS 'Stores student personal information';
COMMENT ON TABLE fees IS 'Tracks student fee payments';
COMMENT ON TABLE courses IS 'Contains course information';
COMMENT ON TABLE enrollments IS 'Manages student course enrollments';
COMMENT ON TABLE lecturers IS 'Stores lecturer information';
COMMENT ON TABLE lecturer_courses IS 'Assigns lecturers to courses';
COMMENT ON TABLE lecturer_ta IS 'Assigns TAs to lecturers and courses';
COMMENT ON TABLE users IS 'Authentication and authorization data';
