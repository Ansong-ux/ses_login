// Simple mock database for development
// This provides sample data without requiring a real database connection

const mockData = {
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

// Mock pool that mimics the PostgreSQL pool interface
const mockPool = {
  connect: async () => ({
    query: async (sql: string, params: any[] = []) => {
      // Simple mock query handler
      if (sql.includes('SELECT COUNT(*) FROM students')) {
        return { rows: [{ count: mockData.students.length.toString() }] };
      }
      if (sql.includes('SELECT COUNT(*) FROM courses')) {
        return { rows: [{ count: mockData.courses.length.toString() }] };
      }
      if (sql.includes('SELECT COUNT(*) FROM lecturers')) {
        return { rows: [{ count: mockData.lecturers.length.toString() }] };
      }
      if (sql.includes('SELECT * FROM students')) {
        return { rows: mockData.students };
      }
      if (sql.includes('SELECT * FROM courses')) {
        return { rows: mockData.courses };
      }
      if (sql.includes('SELECT * FROM lecturers')) {
        return { rows: mockData.lecturers };
      }
      if (sql.includes('SELECT * FROM assignments')) {
        return { rows: mockData.assignments };
      }
      if (sql.includes('SELECT * FROM announcements')) {
        return { rows: mockData.announcements };
      }
      if (sql.includes('SELECT * FROM fee_structure')) {
        return { rows: mockData.fee_structure };
      }
      if (sql.includes('SELECT * FROM fees')) {
        return { rows: mockData.fees };
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

export const pool = mockPool;

// Export all the functions that the app expects
export async function getDashboardStats() {
  return {
    students: mockData.students.length,
    courses: mockData.courses.length,
    lecturers: mockData.lecturers.length,
    totalOutstanding: 1500.00, // Mock value
  };
}

export async function getStudents() {
  return mockData.students.map(student => ({
    ...student,
    total_paid: mockData.fees.find(f => f.student_id === student.id)?.amount_paid || 0,
    outstanding: 1000.00 - (mockData.fees.find(f => f.student_id === student.id)?.amount_paid || 0)
  }));
}

export async function getLecturers() {
  return mockData.lecturers;
}

export async function getCourses() {
  return mockData.courses;
}

export async function getAssignments() {
  return mockData.assignments;
}

export async function getAnnouncements() {
  return mockData.announcements;
}

export async function getFeeStructure() {
  return mockData.fee_structure;
}

export async function getOutstandingFees() {
  return mockData.students.map(student => {
    const paid = mockData.fees.find(f => f.student_id === student.id)?.amount_paid || 0;
    return {
      student_id: student.student_id,
      full_name: `${student.first_name} ${student.last_name}`,
      email: student.email,
      total_paid: paid,
      outstanding: 1000.00 - paid,
      payment_status: paid >= 1000.00 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid'
    };
  });
}

export async function getUserById(userId: number) {
  return { user_id: userId, email: 'admin@example.com', role: 'admin' };
}

export async function getAcademicTerms() {
  return [
    { term_id: 1, term_name: '2024/2025 First Semester', start_date: '2024-09-01', end_date: '2024-12-31', is_active: true },
    { term_id: 2, term_name: '2024/2025 Second Semester', start_date: '2025-01-01', end_date: '2025-05-31', is_active: false }
  ];
}

// Add other functions as needed
export async function getStudentAssignments(studentId: number) {
  return mockData.assignments.map(assignment => ({
    ...assignment,
    submitted: false,
    grade: null,
    feedback: null
  }));
}

export async function getStudentCourseGrades(studentId: number, courseId: number) {
  return [];
}

export async function getCourseGradeSummary(courseId: number) {
  return {
    total_students: 25,
    average_grade: 78.5,
    highest_grade: 95.0,
    lowest_grade: 45.0
  };
}

export async function getStudentGPA(studentId: number) {
  return 3.2;
} 