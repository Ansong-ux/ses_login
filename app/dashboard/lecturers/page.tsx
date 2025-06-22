import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getLecturers } from "@/lib/db"
import Link from "next/link"

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  return session.user;
}

export default async function LecturersPage() {
  const user = await getUser()
  const lecturers = await getLecturers()

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
                <h1 className="text-2xl font-bold text-gray-900">Lecturer Management</h1>
                <p className="text-sm text-gray-600">Manage lecturer information and assignments</p>
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
        {/* Lecturers Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-chalkboard-teacher"></i>
                Total Lecturers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{lecturers.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-book"></i>
                Active Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {/* Placeholder - would need to calculate from lecturer_courses table */}
                {lecturers.length * 2}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-users"></i>
                Teaching Assistants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {/* Placeholder - would need to calculate from lecturer_ta table */}
                {Math.floor(lecturers.length / 2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lecturers List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-list"></i>
                  All Lecturers
                </CardTitle>
                <CardDescription>Complete list of department lecturers</CardDescription>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <i className="fas fa-plus mr-2"></i>
                Add Lecturer
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
                    <th className="text-left py-3 px-4 font-semibold">Department</th>
                    <th className="text-left py-3 px-4 font-semibold">Courses</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lecturers.map((lecturer: any) => (
                    <tr key={lecturer.lecturer_id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{lecturer.lecturer_id}</td>
                      <td className="py-3 px-4">{lecturer.first_name} {lecturer.last_name}</td>
                      <td className="py-3 px-4">{lecturer.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="bg-blue-50">
                          {lecturer.department || 'Computer Engineering'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">
                          {/* Placeholder - would need to count from lecturer_courses */}
                          2 Courses
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default" className="bg-green-500">
                          Active
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

        {/* Lecturer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {lecturers.map((lecturer: any) => (
            <Card key={lecturer.lecturer_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{lecturer.first_name} {lecturer.last_name}</CardTitle>
                    <CardDescription className="font-mono text-sm">{lecturer.email}</CardDescription>
                  </div>
                  <Badge variant="secondary">ID: {lecturer.lecturer_id}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Department:</span>
                    <Badge variant="outline" className="bg-blue-50">
                      {lecturer.department || 'Computer Engineering'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Courses:</span>
                    <Badge variant="secondary">
                      {/* Placeholder - would need to count from lecturer_courses */}
                      2 Active
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button size="sm" className="flex-1">
                      <i className="fas fa-eye mr-2"></i>
                      View Profile
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
      </main>
    </div>
  )
} 