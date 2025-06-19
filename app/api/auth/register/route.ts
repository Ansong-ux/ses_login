// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
      );
    }

    // Optionally validate email format, password length, etc.

    const user = await createUser(email, password, role || "student");

    return NextResponse.json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
    );
  }
}
