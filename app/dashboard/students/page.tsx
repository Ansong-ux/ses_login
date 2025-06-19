import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getStudents } from "@/lib/db"
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

export default async function StudentsPage() {
  const user = await getUser()
  const students = await getStudents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Image
                  src="/images/seslogo.jpg"
                  alt="University of Ghana Logo"
                  width={50}
                  height={50}
                  className="rounded-lg cursor-pointer"
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
                <p className="text-sm text-gray-600">Manage student information and records</p>
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
        {/* Students Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-users"></i>
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{students.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                Paid Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {students.filter((s) => Number.parseFloat(s.outstanding) <= 0).length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                Outstanding Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {students.filter((s) => Number.parseFloat(s.outstanding) > 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-list"></i>
                  All Students
                </CardTitle>
                <CardDescription>Complete list of registered students</CardDescription>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <i className="fas fa-plus mr-2"></i>
                Add Student
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold">Total Paid</th>
                    <th className="text-left py-3 px-4 font-semibold">Outstanding</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any) => (
                    <tr key={student.student_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{student.student_id}</td>
                      <td className="py-3 px-4">{student.first_name} {student.last_name}</td>
                      <td className="py-3 px-4">{student.email}</td>
                      <td className="py-3 px-4">{student.phone || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-green-600">
                          ₵{Number.parseFloat(student.total_paid).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${Number.parseFloat(student.outstanding) > 0 ? "text-red-600" : "text-green-600"}`}>
                          ₵{Number.parseFloat(student.outstanding).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={Number.parseFloat(student.outstanding) <= 0 ? "default" : "destructive"}
                          className={Number.parseFloat(student.outstanding) <= 0 ? "bg-green-500" : ""}
                        >
                          {Number.parseFloat(student.outstanding) <= 0 ? "Paid" : "Outstanding"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button size="sm" variant="outline">
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
