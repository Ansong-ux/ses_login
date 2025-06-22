'use server'
// lib/auth.ts
import { Pool } from 'pg';
import type { User } from '@/types/db';
import bcrypt from 'bcrypt'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/ce_department_db',
});

// Mock user data for development
const mockUsers = [
  {
    user_id: 1,
    email: 'admin@example.com',
    password_hash: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ',
    role: 'admin',
    student_id: null,
    lecturer_id: null,
    first_name: 'Admin',
    last_name: 'User'
  },
  {
    user_id: 2,
    email: 'simpson.mozu@gmail.com',
    password_hash: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ',
    role: 'student',
    student_id: 1,
    lecturer_id: null,
    first_name: 'Simpson',
    last_name: 'Mozu'
  },
  {
    user_id: 3,
    email: 'john.nii@university.edu',
    password_hash: '$2b$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ',
    role: 'lecturer',
    student_id: null,
    lecturer_id: 1,
    first_name: 'Dr. John',
    last_name: 'Nii'
  }
];

// For demo purposes, all passwords are "password123"
const DEMO_PASSWORD = 'password123';

export async function getUserByEmail(email: string) {
  try {
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    return null;
  }
}

export async function authenticateUser(email: string, password_raw: string): Promise<any | null> {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      console.log(`Authentication failed: User not found for email: ${email}`);
      return null;
    }

    // For demo purposes, accept "password123" for all users
    if (password_raw === DEMO_PASSWORD) {
      console.log(`Authentication successful for email: ${email}`);
      return user;
    }

    console.log(`Authentication failed: Password mismatch for email: ${email}`);
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Create a new user (mock implementation) - server-side only
export async function createUser(email: string, password: string, role = "student") {
  
  const newUser = {
    user_id: mockUsers.length + 1,
    email,
    password_hash: await bcrypt.hash(password, 10),
    role,
    student_id: role === 'student' ? mockUsers.length + 1 : null,
    lecturer_id: role === 'lecturer' ? mockUsers.length + 1 : null,
    first_name: 'New',
    last_name: 'User'
  };
  
  mockUsers.push(newUser);
  return newUser;
}

// Get user by ID (mock implementation)
export async function getUserById(userId: number): Promise<any | null> {
  try {
    const user = mockUsers.find(u => u.user_id === userId);
    return user || null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
