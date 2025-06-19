import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCourses } from "@/lib/db"
import Link from "next/link"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    redirect("/auth")
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as any
    return decoded
  } catch (error) {
    redirect("/auth")
  }
}

export default async function CoursesPage() {
  const user = await getUser()
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Image
                  src="/images/ug-logo.jpg"
                  alt="University of Ghana Logo"
                  width={50}
                  height={50}
                  className="rounded-lg cursor-pointer"
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
                <p className="text-sm text-gray-600">Manage courses and enrollments</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Dashboard
                </Button>
              </Link>
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Courses Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-book"></i>
                Total Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-users"></i>
                Total Enrollments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {courses.reduce((sum: number, course: any) => sum + Number.parseInt(course.enrolled_students), 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-calculator"></i>
                Total Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {courses.reduce((sum: number, course: any) => sum + (course.credits || 3), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course: any) => (
            <Card key={course.course_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.course_name}</CardTitle>
                    <CardDescription className="font-mono text-sm">{course.course_code}</CardDescription>
                  </div>
                  <Badge variant="secondary">{course.credits || 3} Credits</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Enrolled Students:</span>
                    <Badge variant="outline" className="bg-blue-50">
                      <i className="fas fa-users mr-1"></i>
                      {course.enrolled_students}
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button size="sm" className="flex-1">
                      <i className="fas fa-eye mr-2"></i>
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Course Button */}
        <div className="text-center">
          <Button className="bg-purple-600 hover:bg-purple-700" size="lg">
            <i className="fas fa-plus mr-2"></i>
            Add New Course
          </Button>
        </div>
      </main>
    </div>
  )
}
