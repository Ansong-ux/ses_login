import { Pool } from 'pg';

// Check environment variable early
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables.');
}

// Create a single pool instance to be shared
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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
      1000.00 - COALESCE(paid.total_paid, 0) AS outstanding,
      COALESCE(paid.total_paid, 0) AS total_paid
    FROM students s
           LEFT JOIN (
      SELECT student_id, SUM(amount_paid) AS total_paid
      FROM fees
      GROUP BY student_id
    ) paid ON s.student_id = paid.student_id
    WHERE (1000.00 - COALESCE(paid.total_paid, 0)) > 0
    ORDER BY outstanding DESC;
  `);

  return res.rows;
}

export async function getStudents() {
  const res = await pool.query(`
    SELECT
      student_id,
      first_name,
      last_name,
      email,
      phone,
      COALESCE(paid.total_paid, 0) AS total_paid,
      1000.00 - COALESCE(paid.total_paid, 0) AS outstanding
    FROM students s
    LEFT JOIN (
      SELECT student_id, SUM(amount_paid) AS total_paid
      FROM fees
      GROUP BY student_id
    ) paid ON s.student_id = paid.student_id
    ORDER BY student_id ASC;
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
    SELECT course_id, course_code, course_name, credits, department
    FROM courses
    ORDER BY course_id ASC;
  `);
  return res.rows;
}
