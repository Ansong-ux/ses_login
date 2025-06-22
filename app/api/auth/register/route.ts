// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, level } = await request.json();

    if (!fullName || !email || !password || !level) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Split full name into first and last names
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Use a transaction to ensure data integrity
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert into students table
      const studentRes = await client.query(
        "INSERT INTO students (first_name, last_name, email, level) VALUES ($1, $2, $3, $4) RETURNING student_id",
        [firstName, lastName, email, level]
      );
      const studentId = studentRes.rows[0].student_id;

      // Insert into users table
      const userRes = await client.query(
        "INSERT INTO users (email, password_hash, role, student_id) VALUES ($1, $2, 'student', $3) RETURNING user_id, email, role",
        [email, hashedPassword, studentId]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        message: "Registration successful!",
        user: userRes.rows[0],
      }, { status: 201 });

    } catch (transactionError) {
      await client.query("ROLLBACK");
      console.error("Registration transaction error:", transactionError);
      return NextResponse.json(
        { error: "Registration failed due to a server error." },
        { status: 500 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
