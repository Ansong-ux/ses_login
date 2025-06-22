import { Pool } from 'pg';

// Simple in-memory data store for development
const inMemoryData = {
  students: [
    { id: 1, student_id: 'STU001', first_name: 'John', last_name: 'Doe', email: 'john.doe@student.edu', phone: '+233-20-123-4567', level: 100 },
    { id: 2, student_id: 'STU002', first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@student.edu', phone: '+233-20-123-4568', level: 100 },
    { id: 3, student_id: 'STU003', first_name: 'Michael', last_name: 'Johnson', email: 'michael.johnson@student.edu', phone: '+233-20-123-4569', level: 200 }
  ],
  courses: [
    { id: 1, course_code: 'SENG 101', course_name: 'Calculus I (+pre-Maths): Single Variable', credits: 4, description: 'Introduction to calculus and mathematical foundations' },
    { id: 2, course_code: 'SENG 103', course_name: 'Mechanics I: Statics', credits: 3, description: 'Static equilibrium and force analysis' },
    { id: 3, course_code: 'SENG 105', course_name: 'Engineering Graphics', credits: 3, description: 'Technical drawing and CAD fundamentals' },
    { id: 4, course_code: 'SENG 107', course_name: 'Introduction to Engineering', credits: 2, description: 'Overview of engineering disciplines and practices' },
    { id: 5, course_code: 'SENG 111', course_name: 'General Physics', credits: 3, description: 'Fundamental physics principles for engineers' },
    { id: 6, course_code: 'CPEN 103', course_name: 'Computer Engineering Innovations', credits: 3, description: 'Introduction to computer engineering concepts' },
    { id: 7, course_code: 'UGRC 110', course_name: 'Academic Writing I', credits: 3, description: 'Academic writing and communication skills' }
  ],
  lecturers: [
    { id: 1, lecturer_id: 'LEC001', first_name: 'Dr. Robert', last_name: 'Wilson', email: 'robert.wilson@faculty.edu', phone: '+233-20-123-4572', department: 'Computer Engineering' },
    { id: 2, lecturer_id: 'LEC002', first_name: 'Dr. Mary', last_name: 'Davis', email: 'mary.davis@faculty.edu', phone: '+233-20-123-4573', department: 'Mathematics' },
    { id: 3, lecturer_id: 'LEC003', first_name: 'Prof. James', last_name: 'Miller', email: 'james.miller@faculty.edu', phone: '+233-20-123-4574', department: 'Physics' }
  ],
  assignments: [
    { id: 1, course_id: 1, title: 'Engineering Mathematics Assignment 1', description: 'Complete problems 1-10 from Chapter 2', due_date: '2024-10-15T23:59:00Z', total_points: 100 },
    { id: 2, course_id: 1, title: 'Engineering Mathematics Assignment 2', description: 'Complete problems 1-15 from Chapter 3', due_date: '2024-11-01T23:59:00Z', total_points: 100 },
    { id: 3, course_id: 2, title: 'Applied Electricity Lab Report', description: 'Submit lab report for circuit analysis experiment', due_date: '2024-10-20T23:59:00Z', total_points: 50 },
    { id: 4, course_id: 3, title: 'Engineering Graphics Project', description: 'Complete CAD drawing of mechanical component', due_date: '2024-11-10T23:59:00Z', total_points: 100 }
  ],
  announcements: [
    { id: 1, title: 'Welcome to the New Academic Year', content: 'Welcome all students to the 2024/2025 academic year. Please check your course schedules and ensure all fees are paid.', author_id: 1 },
    { id: 2, title: 'Assignment Submission Guidelines', content: 'All assignments must be submitted through the online portal. Late submissions will not be accepted without prior approval.', author_id: 1 },
    { id: 3, title: 'Library Hours Update', content: 'The library will now be open from 8:00 AM to 10:00 PM on weekdays and 9:00 AM to 6:00 PM on weekends.', author_id: 1 }
  ],
  fees: [
    { id: 1, student_id: 1, amount_paid: 500.00, payment_date: '2024-09-15T10:00:00Z', payment_method: 'Bank Transfer', reference_number: 'REF001' },
    { id: 2, student_id: 2, amount_paid: 750.00, payment_date: '2024-09-20T14:30:00Z', payment_method: 'Mobile Money', reference_number: 'REF002' },
    { id: 3, student_id: 3, amount_paid: 1000.00, payment_date: '2024-09-25T09:15:00Z', payment_method: 'Cash', reference_number: 'REF003' }
  ],
  fee_structure: [
    { level: 100, amount: 5500.00 },
    { level: 200, amount: 5500.00 },
    { level: 300, amount: 6000.00 },
    { level: 400, amount: 6000.00 }
  ]
};

// Mock pool for development
const mockPool = {
  connect: async () => ({
    query: async (sql: string, params: any[] = []) => {
      // Simple mock query handler
      if (sql.includes('SELECT COUNT(*) FROM students')) {
        return { rows: [{ count: inMemoryData.students.length.toString() }] };
      }
      if (sql.includes('SELECT COUNT(*) FROM courses')) {
        return { rows: [{ count: inMemoryData.courses.length.toString() }] };
      }
      if (sql.includes('SELECT COUNT(*) FROM lecturers')) {
        return { rows: [{ count: inMemoryData.lecturers.length.toString() }] };
      }
      if (sql.includes('SELECT * FROM students')) {
        return { rows: inMemoryData.students };
      }
      if (sql.includes('SELECT * FROM courses')) {
        return { rows: inMemoryData.courses };
      }
      if (sql.includes('SELECT * FROM lecturers')) {
        return { rows: inMemoryData.lecturers };
      }
      if (sql.includes('SELECT * FROM assignments')) {
        return { rows: inMemoryData.assignments };
      }
      if (sql.includes('SELECT * FROM announcements')) {
        return { rows: inMemoryData.announcements };
      }
      if (sql.includes('SELECT * FROM fee_structure')) {
        return { rows: inMemoryData.fee_structure };
      }
      if (sql.includes('SELECT * FROM fees')) {
        return { rows: inMemoryData.fees };
      }
      if (sql.includes('SELECT version()')) {
        return { rows: [{ version: 'Mock Database v1.0' }] };
      }
      return { rows: [] };
    },
    release: () => {}
  }),
  query: async (sql: string, params: any[] = []) => {
    return await mockPool.connect().then(client => client.query(sql, params));
  },
  on: () => {},
  end: async () => {}
};

// Try to create real pool, fallback to mock
let pool: any;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ce_department_db',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  // Test connection
  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();
  
  console.log('Connected to PostgreSQL database');
} catch (error) {
  console.log('PostgreSQL not available, using mock database');
  pool = mockPool;
}

export { pool };

/**
 * Fetches dashboard statistics: counts of students, courses, lecturers,
 * and total outstanding fees.
 */
export async function getDashboardStats() {
  const client = await pool.connect();

  try {
    const studentRes = await client.query('SELECT COUNT(*) FROM students');
    const courseRes = await client.query('SELECT COUNT(*) FROM courses');
    const lecturerRes = await client.query('SELECT COUNT(*) FROM lecturers');

    const outstandingRes = await client.query(`
      SELECT SUM(1000.00 - COALESCE(paid.total_paid, 0)) AS total_outstanding
      FROM students s
             LEFT JOIN (
        SELECT student_id, SUM(amount_paid) AS total_paid
        FROM fees
        GROUP BY student_id
      ) paid ON s.student_id = paid.student_id
    `);

    return {
      students: parseInt(studentRes.rows[0].count, 10),
      courses: parseInt(courseRes.rows[0].count, 10),
      lecturers: parseInt(lecturerRes.rows[0].count, 10),
      totalOutstanding: parseFloat(outstandingRes.rows[0].total_outstanding) || 0,
    };
  } finally {
    client.release();
  }
}

/**
 * Returns a list of students with outstanding fees, including
 * their full name, email, amount outstanding, and amount paid.
 */
export async function getOutstandingFees() {
  const res = await pool.query(`
    SELECT
      s.student_id,
      s.first_name || ' ' || s.last_name AS full_name,
      s.email,
      COALESCE(paid.total_paid, 0) AS total_paid,
      1000.00 - COALESCE(paid.total_paid, 0) AS outstanding,
      CASE 
        WHEN COALESCE(paid.total_paid, 0) >= 1000.00 THEN 'Paid'
        WHEN COALESCE(paid.total_paid, 0) > 0 THEN 'Partial'
        ELSE 'Unpaid'
      END AS payment_status
    FROM students s
           LEFT JOIN (
      SELECT student_id, SUM(amount_paid) AS total_paid
      FROM fees
      GROUP BY student_id
    ) paid ON s.student_id = paid.student_id
    ORDER BY s.student_id;
  `);
  return res.rows;
}

export async function getStudents() {
  const res = await pool.query(`
    SELECT s.student_id, s.first_name, s.last_name, s.email, s.phone,
           COALESCE(paid.total_paid, 0) AS total_paid,
           1000.00 - COALESCE(paid.total_paid, 0) AS outstanding
    FROM students s
    LEFT JOIN (
      SELECT student_id, SUM(amount_paid) AS total_paid
      FROM fees
      GROUP BY student_id
    ) paid ON s.student_id = paid.student_id
    ORDER BY s.student_id ASC;
  `);
  return res.rows;
}

export async function getLecturers() {
  const res = await pool.query(`
    SELECT lecturer_id, first_name, last_name, email, phone, department
    FROM lecturers
    ORDER BY lecturer_id ASC;
  `);
  return res.rows;
}

export async function getCourses() {
  const res = await pool.query(`
    SELECT course_id, course_code, course_name, credits
    FROM courses
    ORDER BY course_id ASC;
  `);
  return res.rows;
}

export async function getFeeStructure() {
  const res = await pool.query('SELECT * FROM fee_structure ORDER BY level');
  return res.rows;
}

export async function getUserById(userId: number) {
  const res = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
  return res.rows[0];
}

// Grade Management Functions
// =========================

/**
 * Get academic terms/semesters
 */
export async function getAcademicTerms() {
  const res = await pool.query(`
    SELECT term_id, term_name, start_date, end_date, is_active
    FROM academic_terms
    ORDER BY start_date DESC;
  `);
  return res.rows;
}

/**
 * Get assignments for a course
 */
export async function getAssignments(courseId?: number, termId?: number) {
  let query = `
    SELECT 
      a.assignment_id,
      a.title,
      a.description,
      a.max_score,
      a.weight,
      a.assignment_type,
      a.due_date,
      a.term_id,
      c.course_name,
      c.course_code,
      COALESCE(u.first_name || ' ' || u.last_name, u.email) as created_by_email
    FROM assignments a
    JOIN courses c ON a.course_id = c.course_id
    LEFT JOIN users u ON a.created_by = u.user_id
  `;
  
  const params: any[] = [];
  const conditions: string[] = [];
  
  if (courseId) {
    conditions.push(`a.course_id = $${params.length + 1}`);
    params.push(courseId);
  }
  
  if (termId) {
    conditions.push(`a.term_id = $${params.length + 1}`);
    params.push(termId);
  }
  
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  
  query += ` ORDER BY a.due_date DESC;`;
  
  const res = await pool.query(query, params);
  return res.rows;
}

/**
 * Get student assignments with submission status
 */
export async function getStudentAssignments(studentId: number) {
  try {
    const res = await pool.query(`
      SELECT 
        a.assignment_id,
        a.title,
        a.description,
        a.max_score,
        a.weight,
        a.assignment_type,
        a.due_date,
        a.term_id,
        c.course_name,
        c.course_code,
        COALESCE(sa.submission_status, 'pending') as submission_status,
        sa.submitted_at,
        sa.grade,
        sa.feedback,
        sa.file_url,
        sa.file_name
      FROM assignments a
      JOIN courses c ON a.course_id = c.course_id
      JOIN enrollments e ON c.course_id = e.course_id
      LEFT JOIN student_assignments sa ON a.assignment_id = sa.assignment_id AND sa.student_id = e.student_id
      WHERE e.student_id = $1 AND e.status = 'enrolled'
      ORDER BY a.due_date DESC;
    `, [studentId]);
    return res.rows;
  } catch (error) {
    console.error('Error getting student assignments:', error);
    return [];
  }
}

/**
 * Get student grades for a course
 */
export async function getStudentCourseGrades(studentId: number, courseId: number, termId?: number) {
  const res = await pool.query(
    `SELECT * FROM get_student_course_grades($1, $2, $3)`,
    [studentId, courseId, termId]
  );
  return res.rows[0]?.get_student_course_grades || [];
}

/**
 * Get course grade summary
 */
export async function getCourseGradeSummary(courseId: number, termId?: number) {
  const res = await pool.query(
    `SELECT * FROM get_course_grade_summary($1, $2)`,
    [courseId, termId]
  );
  return res.rows[0]?.get_course_grade_summary || [];
}

/**
 * Get student GPA
 */
export async function getStudentGPA(studentId: number, termId?: number) {
  const res = await pool.query(
    `SELECT get_student_gpa($1, $2) as gpa`,
    [studentId, termId]
  );
  return parseFloat(res.rows[0]?.gpa || '0.00');
}

/**
 * Add or update a grade
 */
export async function upsertGrade(gradeData: {
  studentId: number;
  assignmentId: number;
  courseId: number;
  score: number;
  comments?: string;
  gradedBy: number;
}) {
  const res = await pool.query(`
    INSERT INTO grades (student_id, assignment_id, course_id, score, comments, graded_by)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (student_id, assignment_id)
    DO UPDATE SET 
      score = EXCLUDED.score,
      comments = EXCLUDED.comments,
      graded_by = EXCLUDED.graded_by,
      graded_at = CURRENT_TIMESTAMP
    RETURNING *;
  `, [
    gradeData.studentId,
    gradeData.assignmentId,
    gradeData.courseId,
    gradeData.score,
    gradeData.comments,
    gradeData.gradedBy
  ]);
  
  return res.rows[0];
}

/**
 * Create a new assignment
 */
export async function createAssignment(assignmentData: {
  courseId: number;
  title: string;
  description?: string;
  maxScore: number;
  weight: number;
  assignmentType: string;
  dueDate?: Date;
  termId: number;
  createdBy: number;
}) {
  const res = await pool.query(`
    INSERT INTO assignments (course_id, title, description, max_score, weight, assignment_type, due_date, term_id, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `, [
    assignmentData.courseId,
    assignmentData.title,
    assignmentData.description,
    assignmentData.maxScore,
    assignmentData.weight,
    assignmentData.assignmentType,
    assignmentData.dueDate,
    assignmentData.termId,
    assignmentData.createdBy
  ]);
  
  return res.rows[0];
}

// Role-based Access Control Functions
// ==================================

/**
 * Check if user has permission for a resource and action
 */
export async function checkUserPermission(userId: number, resource: string, action: string) {
  const res = await pool.query(
    `SELECT check_user_permission($1, $2, $3) as has_permission`,
    [userId, resource, action]
  );
  return res.rows[0]?.has_permission || false;
}

/**
 * Get user role and permissions
 */
export async function getUserRole(userId: number) {
  const res = await pool.query(`
    SELECT u.role, u.permissions, rp.permissions as role_permissions
    FROM users u
    LEFT JOIN role_permissions rp ON u.role = rp.role_name
    WHERE u.user_id = $1 AND u.is_active = true
  `, [userId]);
  
  return res.rows[0];
}

/**
 * Log user activity
 */
export async function logActivity(activityData: {
  userId: number;
  action: string;
  tableName?: string;
  recordId?: number;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  await pool.query(`
    SELECT log_user_activity($1, $2, $3, $4, $5, $6, $7, $8)
  `, [
    activityData.userId,
    activityData.action,
    activityData.tableName,
    activityData.recordId,
    activityData.oldValues ? JSON.stringify(activityData.oldValues) : null,
    activityData.newValues ? JSON.stringify(activityData.newValues) : null,
    activityData.ipAddress,
    activityData.userAgent
  ]);
}

/**
 * Get user activity logs
 */
export async function getActivityLogs(userId?: number, limit: number = 50) {
  let query = `
    SELECT 
      al.log_id,
      al.action,
      al.table_name,
      al.record_id,
      al.old_values,
      al.new_values,
      al.ip_address,
      al.created_at,
      u.email as user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.user_id
  `;
  
  const params: any[] = [];
  
  if (userId) {
    query += ` WHERE al.user_id = $1`;
    params.push(userId);
  }
  
  query += ` ORDER BY al.created_at DESC LIMIT $${params.length + 1}`;
  params.push(limit);
  
  const res = await pool.query(query, params);
  return res.rows;
}

// Attendance Management Functions
export async function getClassSchedules(termId?: number) {
  try {
    const query = `
      SELECT 
        cs.schedule_id,
        cs.room_number,
        cs.building,
        cs.day_of_week,
        cs.start_time,
        cs.end_time,
        cs.is_active,
        c.course_name,
        c.course_code,
        l.first_name as lecturer_first_name,
        l.last_name as lecturer_last_name,
        at.term_name
      FROM class_schedules cs
      JOIN courses c ON cs.course_id = c.course_id
      JOIN lecturers l ON cs.lecturer_id = l.lecturer_id
      JOIN academic_terms at ON cs.term_id = at.term_id
      ${termId ? 'WHERE cs.term_id = $1' : ''}
      ORDER BY cs.day_of_week, cs.start_time
    `;
    
    const result = await pool.query(query, termId ? [termId] : []);
    return result.rows;
  } catch (error) {
    console.error('Error fetching class schedules:', error);
    return [];
  }
}

export async function getAttendanceByDate(date: string, courseId?: number) {
  try {
    const query = `
      SELECT 
        a.attendance_id,
        a.attendance_date,
        a.status,
        a.check_in_time,
        a.check_out_time,
        a.notes,
        s.first_name,
        s.last_name,
        s.email,
        c.course_name,
        c.course_code,
        u.email as recorded_by_email
      FROM attendance a
      JOIN students s ON a.student_id = s.student_id
      JOIN courses c ON a.course_id = c.course_id
      LEFT JOIN users u ON a.recorded_by = u.user_id
      WHERE a.attendance_date = $1
      ${courseId ? 'AND a.course_id = $2' : ''}
      ORDER BY c.course_name, s.last_name, s.first_name
    `;
    
    const result = await pool.query(query, courseId ? [date, courseId] : [date]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
}

export async function getStudentAttendance(studentId: number, termId?: number) {
  try {
    const query = `
      SELECT 
        a.attendance_id,
        a.attendance_date as date,
        a.status,
        a.check_in_time,
        a.check_out_time,
        a.notes,
        c.course_name,
        c.course_code,
        cs.room_number,
        cs.building,
        cs.day_of_week,
        cs.start_time,
        cs.end_time
      FROM attendance a
      JOIN courses c ON a.course_id = c.course_id
      JOIN class_schedules cs ON a.schedule_id = cs.schedule_id
      WHERE a.student_id = $1
      ${termId ? 'AND cs.term_id = $2' : ''}
      ORDER BY a.attendance_date DESC, cs.start_time
    `;
    
    const result = await pool.query(query, termId ? [studentId, termId] : [studentId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return [];
  }
}

export async function getAttendanceSummary(studentId: number, termId?: number) {
  try {
    const query = `
      SELECT 
        as.summary_id,
        as.total_classes,
        as.classes_present,
        as.classes_absent,
        as.classes_late,
        as.classes_excused,
        as.attendance_percentage,
        c.course_name,
        c.course_code,
        at.term_name
      FROM attendance_summary as
      JOIN courses c ON as.course_id = c.course_id
      JOIN academic_terms at ON as.term_id = at.term_id
      WHERE as.student_id = $1
      ${termId ? 'AND as.term_id = $2' : ''}
      ORDER BY c.course_name
    `;
    
    const result = await pool.query(query, termId ? [studentId, termId] : [studentId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    return [];
  }
}

export async function markAttendance(attendanceData: {
  studentId: number;
  courseId: number;
  scheduleId: number;
  attendanceDate: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  recordedBy: number;
}) {
  try {
    const query = `
      INSERT INTO attendance (
        student_id, course_id, schedule_id, attendance_date, 
        status, check_in_time, check_out_time, notes, recorded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (student_id, course_id, attendance_date) 
      DO UPDATE SET 
        status = EXCLUDED.status,
        check_in_time = EXCLUDED.check_in_time,
        check_out_time = EXCLUDED.check_out_time,
        notes = EXCLUDED.notes,
        recorded_by = EXCLUDED.recorded_by,
        created_at = CURRENT_TIMESTAMP
      RETURNING attendance_id
    `;
    
    const result = await pool.query(query, [
      attendanceData.studentId,
      attendanceData.courseId,
      attendanceData.scheduleId,
      attendanceData.attendanceDate,
      attendanceData.status,
      attendanceData.checkInTime,
      attendanceData.checkOutTime,
      attendanceData.notes,
      attendanceData.recordedBy
    ]);
    
    return result.rows[0]?.attendance_id;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
}

export async function getAttendanceAlerts(termId?: number) {
  try {
    const query = `
      SELECT 
        aa.alert_id,
        aa.alert_type,
        aa.alert_message,
        aa.threshold_value,
        aa.current_value,
        aa.is_resolved,
        aa.created_at,
        s.first_name,
        s.last_name,
        s.email,
        c.course_name,
        c.course_code
      FROM attendance_alerts aa
      JOIN students s ON aa.student_id = s.student_id
      JOIN courses c ON aa.course_id = c.course_id
      ${termId ? 'WHERE aa.term_id = $1' : ''}
      ORDER BY aa.created_at DESC
    `;
    
    const result = await pool.query(query, termId ? [termId] : []);
    return result.rows;
  } catch (error) {
    console.error('Error fetching attendance alerts:', error);
    return [];
  }
}

export async function getCoursesByLecturer(lecturerId: number) {
  const res = await pool.query(
    `SELECT c.* FROM courses c
     JOIN lecturer_courses lc ON c.course_id = lc.course_id
     WHERE lc.lecturer_id = $1`,
    [lecturerId]
  );
  return res.rows;
}

export async function getStudentsByCourse(courseId: number) {
  const res = await pool.query(
    `SELECT s.* FROM students s
     JOIN enrollments e ON s.student_id = e.student_id
     WHERE e.course_id = $1`,
    [courseId]
  );
  return res.rows;
}

export async function getStudentDashboardData(studentId: number) {
    const client = await pool.connect();
    try {
        // 1. Get student info
        const studentInfoPromise = client.query('SELECT * FROM students WHERE student_id = $1', [studentId]);

        const studentInfoResult = await studentInfoPromise;
        const student = studentInfoResult.rows[0];

        if (!student) {
            console.error(`No student found for student ID: ${studentId}`);
            client.release();
            return null;
        }

        // 2. Get enrolled courses (with error handling)
        let enrolledCoursesResult;
        try {
            enrolledCoursesResult = await client.query(`
            SELECT c.course_id, c.course_code, c.course_name, c.credits
            FROM courses c
                JOIN enrollments e ON c.course_id = e.course_id
                WHERE e.student_id = $1
        `, [studentId]);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            enrolledCoursesResult = { rows: [] };
        }

        // 3. Get recent grades (with error handling)
        let gradesResult;
        try {
            gradesResult = await client.query(`
            SELECT a.title, g.score, a.max_score
            FROM grades g
            JOIN assignments a ON g.assignment_id = a.assignment_id
            WHERE g.student_id = $1
            ORDER BY g.graded_at DESC
            LIMIT 5
        `, [studentId]);
        } catch (error) {
            console.error('Error fetching grades:', error);
            gradesResult = { rows: [] };
        }

        // 4. Get fee status (with error handling)
        let feesResult;
        try {
            feesResult = await client.query(`
                SELECT
                    fs.amount AS total_due,
                    COALESCE(p.total_paid, 0) AS total_paid
                FROM students s
                LEFT JOIN fee_structure fs ON s.level = fs.level
                LEFT JOIN (
                    SELECT student_id, SUM(amount_paid) AS total_paid
                    FROM fees
                    GROUP BY student_id
                ) p ON s.student_id = p.student_id
                WHERE s.student_id = $1
            `, [studentId]);
        } catch (error) {
            console.error('Error fetching fees:', error);
            feesResult = { rows: [{ total_due: 0, total_paid: 0 }] };
        }

        const feeData = feesResult.rows[0] || { total_due: 0, total_paid: 0 };
        const outstanding_balance = parseFloat(feeData.total_due) - parseFloat(feeData.total_paid);

        return {
            student: student,
            courses: enrolledCoursesResult.rows,
            grades: gradesResult.rows,
            fees: {
                total_paid: parseFloat(feeData.total_paid),
                total_due: parseFloat(feeData.total_due),
                outstanding_balance
            }
        };
    } catch (error) {
        console.error('Error fetching student dashboard data:', error);
        return null;
    } finally {
        client.release();
    }
}

/**
 * ============================================================================
 * Communication System Functions
 * ============================================================================
 */

export async function getAnnouncements() {
  try {
    const res = await pool.query(`
      SELECT 
        a.announcement_id,
        a.title,
        a.content,
        a.announcement_type,
        a.priority,
        a.target_audience,
        a.is_active,
        a.publish_date,
        a.expiry_date,
        COALESCE(u.first_name || ' ' || u.last_name, 'System Admin') AS author_name,
        COALESCE(u.email, 'admin@ses.edu.gh') AS author_email
      FROM announcements a
      LEFT JOIN users u ON a.author_id = u.user_id
      WHERE a.is_active = true 
      AND (a.expiry_date IS NULL OR a.expiry_date > CURRENT_TIMESTAMP)
      ORDER BY 
        CASE a.priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'normal' THEN 3
          WHEN 'low' THEN 4
        END,
        a.publish_date DESC;
    `);
    return res.rows;
  } catch (error) {
    console.error('Error getting announcements:', error);
    // Return empty array if table doesn't exist or other error
    return [];
  }
}

/**
 * ============================================================================
 * Course Registration Functions
 * ============================================================================
 */

export async function getAvailableCourses(studentId: number) {
  try {
    const res = await pool.query(`
      SELECT 
        c.course_id,
        c.course_code,
        c.course_name,
        c.description,
        c.credits,
        c.level,
        c.semester,
        c.prerequisites,
        c.max_capacity,
        COALESCE(e.enrolled_count, 0) as enrolled_count,
        (c.max_capacity - COALESCE(e.enrolled_count, 0)) as available_seats,
        l.first_name || ' ' || l.last_name as lecturer_name,
        l.email as lecturer_email
      FROM courses c
      LEFT JOIN lecturers l ON c.lecturer_id = l.lecturer_id
      LEFT JOIN (
        SELECT course_id, COUNT(*) as enrolled_count
        FROM enrollments
        WHERE status = 'enrolled'
        GROUP BY course_id
      ) e ON c.course_id = e.course_id
      WHERE c.is_active = true
      AND c.course_id NOT IN (
        SELECT course_id 
        FROM enrollments 
        WHERE student_id = $1 AND status = 'enrolled'
      )
      AND (c.max_capacity - COALESCE(e.enrolled_count, 0)) > 0
      ORDER BY c.course_code;
    `, [studentId]);
    return res.rows;
  } catch (error) {
    console.error('Error getting available courses:', error);
    return [];
  }
}

export async function getStudentEnrollments(studentId: number) {
  try {
    const res = await pool.query(`
      SELECT 
        e.enrollment_id,
        e.course_id,
        e.student_id,
        e.enrollment_date,
        e.status,
        e.grade,
        c.course_code,
        c.course_name,
        c.description,
        c.credits,
        c.level,
        c.semester,
        l.first_name || ' ' || l.last_name as lecturer_name,
        l.email as lecturer_email
      FROM enrollments e
      JOIN courses c ON e.course_id = c.course_id
      LEFT JOIN lecturers l ON c.lecturer_id = l.lecturer_id
      WHERE e.student_id = $1
      ORDER BY c.course_code;
    `, [studentId]);
    return res.rows;
  } catch (error) {
    console.error('Error getting student enrollments:', error);
    return [];
  }
}

export async function registerForCourse(studentId: number, courseId: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check if course is available
    const courseCheck = await client.query(`
      SELECT 
        c.course_id,
        c.max_capacity,
        COALESCE(e.enrolled_count, 0) as enrolled_count
      FROM courses c
      LEFT JOIN (
        SELECT course_id, COUNT(*) as enrolled_count
        FROM enrollments
        WHERE status = 'enrolled'
        GROUP BY course_id
      ) e ON c.course_id = e.course_id
      WHERE c.course_id = $1 AND c.is_active = true
    `, [courseId]);
    
    if (courseCheck.rows.length === 0) {
      throw new Error('Course not found or inactive');
    }
    
    const course = courseCheck.rows[0];
    const availableSeats = course.max_capacity - course.enrolled_count;
    
    if (availableSeats <= 0) {
      throw new Error('Course is full');
    }
    
    // Check if student is already enrolled
    const existingEnrollment = await client.query(`
      SELECT enrollment_id FROM enrollments 
      WHERE student_id = $1 AND course_id = $2 AND status = 'enrolled'
    `, [studentId, courseId]);
    
    if (existingEnrollment.rows.length > 0) {
      throw new Error('Student is already enrolled in this course');
    }
    
    // Register the student
    const result = await client.query(`
      INSERT INTO enrollments (student_id, course_id, enrollment_date, status)
      VALUES ($1, $2, CURRENT_TIMESTAMP, 'enrolled')
      RETURNING enrollment_id;
    `, [studentId, courseId]);
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error registering for course:', error);
    throw error;
  } finally {
    client.release();
  }
}

export async function dropCourse(studentId: number, courseId: number) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check if student is enrolled
    const enrollmentCheck = await client.query(`
      SELECT enrollment_id, status FROM enrollments 
      WHERE student_id = $1 AND course_id = $2
    `, [studentId, courseId]);
    
    if (enrollmentCheck.rows.length === 0) {
      throw new Error('Student is not enrolled in this course');
    }
    
    const enrollment = enrollmentCheck.rows[0];
    
    if (enrollment.status !== 'enrolled') {
      throw new Error('Cannot drop course with status: ' + enrollment.status);
    }
    
    // Update enrollment status to dropped
    const result = await client.query(`
      UPDATE enrollments 
      SET status = 'dropped', updated_at = CURRENT_TIMESTAMP
      WHERE enrollment_id = $1
      RETURNING enrollment_id;
    `, [enrollment.enrollment_id]);
    
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error dropping course:', error);
    throw error;
    } finally {
        client.release();
    }
}
