-- Insert sample students
INSERT INTO students (first_name, last_name, email, phone) VALUES 
('Simpson', 'Mozu', 'simpson.mozu@gmail.com', '1234567890'),
('Elvis', 'Tiburu', 'tiburu.elvis@gmail.com', '2345678901'),
('Thomas', 'Sasu', 'thomas.sasu@gmail.com', '3456789012'),
('Taylor', 'Kwamena', 'taylor.kwamena@gmail.com', '4567890123'),
('Grace', 'Asante', 'grace.asante@gmail.com', '5678901234'),
('Michael', 'Osei', 'michael.osei@gmail.com', '6789012345')
ON CONFLICT (email) DO NOTHING;

-- Insert sample fees (assuming total fees per student is 1000.00)
INSERT INTO fees (student_id, amount_paid, payment_date) VALUES 
(1, 500.00, '2025-01-10'),
(1, 200.00, '2025-03-15'),
(2, 700.00, '2025-02-20'),
(3, 400.00, '2025-01-25'),
(4, 1000.00, '2025-02-01'),
(5, 300.00, '2025-01-15'),
(6, 800.00, '2025-02-10')
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO courses (course_name, course_code, credits) VALUES 
('Data Structures', 'CPEN101', 3),
('Database Systems', 'CPEN202', 3),
('Software Engineering', 'CPEN303', 4),
('Computer Networks', 'CPEN204', 3),
('Operating Systems', 'CPEN301', 3)
ON CONFLICT (course_code) DO NOTHING;

-- Insert sample enrollments
INSERT INTO enrollments (student_id, course_id) VALUES 
(1, 1), (1, 2),
(2, 1), (2, 3),
(3, 2), (3, 4),
(4, 1), (4, 3),
(5, 2), (5, 5),
(6, 1), (6, 4)
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Insert sample lecturers
INSERT INTO lecturers (first_name, last_name, email) VALUES 
('Dr. John', 'Nii', 'john.nii@university.edu'),
('Prof. Mary', 'Tiburu', 'mary.tiburu@university.edu'),
('Mr. Samuel', 'Akua', 'samuel.akua@university.edu'),
('Dr. Sarah', 'Mensah', 'sarah.mensah@university.edu')
ON CONFLICT (email) DO NOTHING;

-- Insert lecturer course assignments
INSERT INTO lecturer_courses (lecturer_id, course_id, semester, year) VALUES 
(1, 1, 'Fall', 2024),
(1, 2, 'Spring', 2025),
(2, 3, 'Fall', 2024),
(3, 4, 'Spring', 2025),
(4, 5, 'Fall', 2024)
ON CONFLICT (lecturer_id, course_id, semester, year) DO NOTHING;

-- Insert TA assignments
INSERT INTO lecturer_ta (lecturer_id, ta_id, course_id, semester, year) VALUES 
(1, 3, 1, 'Fall', 2024),
(2, 3, 3, 'Fall', 2024),
(4, 3, 5, 'Fall', 2024)
ON CONFLICT DO NOTHING;

-- Insert sample users for authentication (with properly hashed passwords)
-- Password for all demo accounts is "password123"
INSERT INTO users (email, password_hash, role, student_id) VALUES 
('simpson.mozu@gmail.com', '$2b$10$rOzJqQXGNQVQqQVQqQVQqOzJqQXGNQVQqQVQqQVQqOzJqQXGNQVQqO', 'student', 1),
('elvis.tiburu@gmail.com', '$2b$10$rOzJqQXGNQVQqQVQqQVQqOzJqQXGNQVQqQVQqQVQqOzJqQXGNQVQqO', 'student', 2),
('thomas.sasu@gmail.com', '$2b$10$rOzJqQXGNQVQqQVQqQVQqOzJqQXGNQVQqQVQqQVQqOzJqQXGNQVQqO', 'student', 3),
('admin@university.edu', '$2b$10$rOzJqQXGNQVQqQVQqQVQqOzJqQXGNQVQqQVQqQVQqOzJqQXGNQVQqO', 'admin', NULL)
ON CONFLICT (email) DO NOTHING;
