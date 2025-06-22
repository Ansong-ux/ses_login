import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAvailableCourses, getStudentEnrollments } from "@/lib/db"
import { CourseRegistrationActions } from "./components"
import Link from "next/link"

async function getUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      // Return mock user instead of redirecting for development
      return { id: 1, email: 'admin@example.com', name: 'Admin User', role: 'admin' };
    }
    return session.user;
  } catch (error) {
    // Return mock user if auth fails
    return { id: 1, email: 'admin@example.com', name: 'Admin User', role: 'admin' };
  }
}

export default async function CourseRegistrationPage() {
  const user = await getUser()
  
  // For demo purposes, we'll use student ID 1
  // In a real app, you'd get the student ID from the user's profile
  const studentId = 1
  
  const availableCourses = await getAvailableCourses(studentId)
  const enrollments = await getStudentEnrollments(studentId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Image
                  src="/images/seslogo.jpg"
                  alt="SES School Logo"
                  width={50}
                  height={50}
                  className="rounded-lg cursor-pointer"
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Course Registration</h1>
                <p className="text-sm text-gray-600">Register for courses and manage your academic schedule</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Registration Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-book"></i>
                Available Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{availableCourses.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-graduation-cap"></i>
                Enrolled Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{enrollments.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-clock"></i>
                Registration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">Open</div>
              <div className="text-sm opacity-90">Until Dec 15, 2024</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-credit-card"></i>
                Total Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {enrollments.reduce((total, course) => total + (course.credits || 0), 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Registration Actions */}
        <CourseRegistrationActions 
          availableCourses={availableCourses}
          enrollments={enrollments}
          studentId={studentId}
        />

        {/* Registration Instructions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-info-circle"></i>
                Registration Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Check Prerequisites</h4>
                    <p className="text-gray-600">Ensure you have completed all required prerequisite courses before registering.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Review Course Schedule</h4>
                    <p className="text-gray-600">Check for any schedule conflicts with your current enrollments.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Confirm Registration</h4>
                    <p className="text-gray-600">Click "Register for Course" to add the course to your schedule.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Payment</h4>
                    <p className="text-gray-600">Ensure all outstanding fees are paid before registration is confirmed.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700" size="lg">
              <i className="fas fa-download mr-2"></i>
              Download Schedule
            </Button>
            <Button variant="outline" size="lg">
              <i className="fas fa-print mr-2"></i>
              Print Registration
            </Button>
            <Button variant="outline" size="lg">
              <i className="fas fa-question-circle mr-2"></i>
              Get Help
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
} 