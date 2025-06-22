import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import LinkedInProvider from "next-auth/providers/linkedin"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticateUser } from "@/lib/auth"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        try {
          const user = await authenticateUser(credentials.email, credentials.password);
          if (user) {
            return { 
              id: user.user_id.toString(), 
              name: user.email, 
              email: user.email, 
              role: user.role,
              student_id: user.student_id,
              lecturer_id: user.lecturer_id,
              first_name: user.first_name,
              last_name: user.last_name,
            };
          }
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    }),
    // Only add OAuth providers if environment variables are set
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    ] : []),
    ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      })
    ] : []),
    ...(process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET ? [
      FacebookProvider({
        clientId: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
      })
    ] : []),
    ...(process.env.LINKEDIN_ID && process.env.LINKEDIN_SECRET ? [
      LinkedInProvider({
        clientId: process.env.LINKEDIN_ID,
        clientSecret: process.env.LINKEDIN_SECRET,
      })
    ] : []),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.student_id = user.student_id;
        token.lecturer_id = user.lecturer_id;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.student_id = token.student_id;
        session.user.lecturer_id = token.lecturer_id;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth',
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 