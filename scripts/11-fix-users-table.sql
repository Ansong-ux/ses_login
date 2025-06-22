-- This script will reset the users table to the correct schema.
-- WARNING: This will delete all existing data in the users table.

-- Drop the existing users table if it exists
DROP TABLE IF EXISTS users;

-- Recreate the users table with the correct columns and constraints
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' NOT NULL,
    student_id INT UNIQUE,
    lecturer_id INT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_student
        FOREIGN KEY(student_id) 
        REFERENCES students(student_id)
        ON DELETE SET NULL,
        
    CONSTRAINT fk_lecturer
        FOREIGN KEY(lecturer_id) 
        REFERENCES lecturers(lecturer_id)
        ON DELETE SET NULL
);

-- Add comments for clarity
COMMENT ON TABLE users IS 'Authentication and authorization data. Links to students or lecturers.';
COMMENT ON COLUMN users.student_id IS 'Foreign key to the students table for student users.';
COMMENT ON COLUMN users.lecturer_id IS 'Foreign key to the lecturers table for lecturer users.';

-- Re-insert the sample data after running this script by executing 03-insert-sample-data.sql
-- Example: psql -U your_username -d your_database -f scripts/03-insert-sample-data.sql 