export type User = {
    user_id: number;
    email: string;
    password_hash: string;
    role: 'student' | 'lecturer' | 'admin';
    student_id?: number;
    lecturer_id?: number;
    first_name?: string;
    last_name?: string;
    created_at?: Date;
};

export type Student = {
    student_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    created_at?: Date;
};

export type Lecturer = {
    lecturer_id: number;
    first_name: string;
    last_name: string;
    email: string;
    department?: string;
    created_at?: Date;
};

export type Course = {
    course_id: number;
    course_name: string;
    course_code: string;
    credits: number;
    created_at?: Date;
};

export type Enrollment = {
    enrollment_id: number;
    student_id: number;
    course_id: number;
    enrollment_date: Date;
    status: string;
};

export type Fee = {
    fee_id: number;
    student_id: number;
    amount_paid: number;
    payment_date: Date;
    created_at?: Date;
};

export type FeeStructure = {
    level: number;
    amount: number;
}; 