import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      email: string;
      role: 'student' | 'lecturer' | 'admin';
      student_id?: number;
      lecturer_id?: number;
      first_name?: string;
      last_name?: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: 'student' | 'lecturer' | 'admin';
    student_id?: number;
    lecturer_id?: number;
    first_name?: string;
    last_name?: string;
  }
}