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
