-- Outstanding fees function
CREATE OR REPLACE FUNCTION get_outstanding_fees() 
RETURNS JSON AS $$ 
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'student_id', s.student_id,
            'full_name', s.first_name || ' ' || s.last_name,
            'email', s.email,
            'total_paid', COALESCE(SUM(f.amount_paid), 0),
            'outstanding', 1000.00 - COALESCE(SUM(f.amount_paid), 0),
            'payment_status', CASE 
                WHEN COALESCE(SUM(f.amount_paid), 0) >= 1000.00 THEN 'Paid'
                WHEN COALESCE(SUM(f.amount_paid), 0) > 0 THEN 'Partial'
                ELSE 'Unpaid'
            END
        )
    )
    INTO result
    FROM students s
    LEFT JOIN fees f ON s.student_id = f.student_id
    GROUP BY s.student_id, s.first_name, s.last_name, s.email
    ORDER BY s.student_id;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- Function to get student enrollment details
CREATE OR REPLACE FUNCTION get_student_enrollments(p_student_id INT)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'course_id', c.course_id,
            'course_name', c.course_name,
            'course_code', c.course_code,
            'credits', c.credits,
            'enrollment_date', e.enrollment_date,
            'status', e.status
        )
    )
    INTO result
    FROM enrollments e
    JOIN courses c ON e.course_id = c.course_id
    WHERE e.student_id = p_student_id;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- Grade Management Functions
-- =========================

-- Function to get student grades for a course
CREATE OR REPLACE FUNCTION get_student_course_grades(p_student_id INT, p_course_id INT, p_term_id INT DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'assignment_id', a.assignment_id,
            'title', a.title,
            'max_score', a.max_score,
            'weight', a.weight,
            'assignment_type', a.assignment_type,
            'due_date', a.due_date,
            'score', g.score,
            'percentage', g.percentage,
            'letter_grade', g.letter_grade,
            'comments', g.comments,
            'graded_at', g.graded_at
        )
    )
    INTO result
    FROM assignments a
    LEFT JOIN grades g ON a.assignment_id = g.assignment_id AND g.student_id = p_student_id
    WHERE a.course_id = p_course_id
    AND (p_term_id IS NULL OR a.term_id = p_term_id)
    ORDER BY a.due_date;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- Function to get course grade summary
CREATE OR REPLACE FUNCTION get_course_grade_summary(p_course_id INT, p_term_id INT DEFAULT NULL)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(
        json_build_object(
            'student_id', s.student_id,
            'student_name', s.first_name || ' ' || s.last_name,
            'email', s.email,
            'total_score', cg.total_score,
            'final_percentage', cg.final_percentage,
            'final_letter_grade', cg.final_letter_grade,
            'gpa_points', cg.gpa_points
        )
    )
    INTO result
    FROM course_grades cg
    JOIN students s ON cg.student_id = s.student_id
    WHERE cg.course_id = p_course_id
    AND (p_term_id IS NULL OR cg.term_id = p_term_id);
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and update course grades
CREATE OR REPLACE FUNCTION calculate_course_grades(p_course_id INT, p_term_id INT)
RETURNS VOID AS $$
BEGIN
    -- Delete existing course grades for this course and term
    DELETE FROM course_grades 
    WHERE course_id = p_course_id AND term_id = p_term_id;
    
    -- Insert calculated course grades
    INSERT INTO course_grades (student_id, course_id, term_id, total_score, final_percentage, final_letter_grade)
    SELECT 
        g.student_id,
        g.course_id,
        p_term_id,
        SUM(g.score * a.weight / 100) as total_score,
        (SUM(g.score * a.weight / 100) / SUM(a.max_score * a.weight / 100)) * 100 as final_percentage,
        CASE 
            WHEN (SUM(g.score * a.weight / 100) / SUM(a.max_score * a.weight / 100)) * 100 >= 90 THEN 'A'
            WHEN (SUM(g.score * a.weight / 100) / SUM(a.max_score * a.weight / 100)) * 100 >= 80 THEN 'B'
            WHEN (SUM(g.score * a.weight / 100) / SUM(a.max_score * a.weight / 100)) * 100 >= 70 THEN 'C'
            WHEN (SUM(g.score * a.weight / 100) / SUM(a.max_score * a.weight / 100)) * 100 >= 60 THEN 'D'
            ELSE 'F'
        END as final_letter_grade
    FROM grades g
    JOIN assignments a ON g.assignment_id = a.assignment_id
    WHERE g.course_id = p_course_id AND a.term_id = p_term_id
    GROUP BY g.student_id, g.course_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get student GPA
CREATE OR REPLACE FUNCTION get_student_gpa(p_student_id INT, p_term_id INT DEFAULT NULL)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    gpa DECIMAL(3,2);
BEGIN
    SELECT COALESCE(AVG(cg.gpa_points), 0.00)
    INTO gpa
    FROM course_grades cg
    WHERE cg.student_id = p_student_id
    AND (p_term_id IS NULL OR cg.term_id = p_term_id);
    
    RETURN gpa;
END;
$$ LANGUAGE plpgsql;

-- Role-based Access Control Functions
-- ==================================

-- Function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(p_user_id INT, p_resource VARCHAR(50), p_action VARCHAR(20))
RETURNS BOOLEAN AS $$
DECLARE
    user_role VARCHAR(20);
    user_perms JSONB;
    role_perms JSONB;
    has_permission BOOLEAN := false;
BEGIN
    -- Get user role and permissions
    SELECT role, permissions INTO user_role, user_perms
    FROM users WHERE user_id = p_user_id AND is_active = true;
    
    IF user_role IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check user-specific permissions first
    IF user_perms ? p_resource AND user_perms->p_resource ? p_action THEN
        RETURN true;
    END IF;
    
    -- Check role-based permissions
    SELECT permissions INTO role_perms
    FROM role_permissions WHERE role_name = user_role;
    
    IF role_perms ? p_resource AND role_perms->p_resource ? p_action THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
    p_user_id INT,
    p_action VARCHAR(100),
    p_table_name VARCHAR(50) DEFAULT NULL,
    p_record_id INT DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO activity_logs (
        user_id, action, table_name, record_id, 
        old_values, new_values, ip_address, user_agent
    ) VALUES (
        p_user_id, p_action, p_table_name, p_record_id,
        p_old_values, p_new_values, p_ip_address, p_user_agent
    );
END;
$$ LANGUAGE plpgsql;
