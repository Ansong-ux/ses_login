import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getOutstandingFees, getStudents } from "@/lib/db"
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

export default async function FeesPage() {
  const user = await getUser()
  const [outstandingFees, students] = await Promise.all([getOutstandingFees(), getStudents()])

  const totalOutstanding = Array.isArray(outstandingFees)
    ? outstandingFees.reduce((sum: number, student: any) => sum + Number.parseFloat(student.outstanding || 0), 0)
    : 0

  const totalPaid = Array.isArray(outstandingFees)
    ? outstandingFees.reduce((sum: number, student: any) => sum + Number.parseFloat(student.total_paid || 0), 0)
    : 0

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
                <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
                <p className="text-sm text-gray-600">Track and manage student fee payments</p>
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
        {/* Fee Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-money-bill-wave"></i>
                Total Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{totalPaid.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-exclamation-triangle"></i>
                Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₵{totalOutstanding.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                Fully Paid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Array.isArray(outstandingFees)
                  ? outstandingFees.filter((s: any) => Number.parseFloat(s.outstanding || 0) <= 0).length
                  : 0}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <i className="fas fa-clock"></i>
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Array.isArray(outstandingFees)
                  ? outstandingFees.filter((s: any) => Number.parseFloat(s.outstanding || 0) > 0).length
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Details Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <i className="fas fa-table"></i>
                  Student Fee Status
                </CardTitle>
                <CardDescription>Detailed breakdown of all student fee payments</CardDescription>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <i className="fas fa-plus mr-2"></i>
                Record Payment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Student</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Total Fees</th>
                    <th className="text-left py-3 px-4 font-semibold">Amount Paid</th>
                    <th className="text-left py-3 px-4 font-semibold">Outstanding</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(outstandingFees) &&
                    outstandingFees.map((student: any) => {
                      const outstanding = Number.parseFloat(student.outstanding || 0)
                      const totalPaid = Number.parseFloat(student.total_paid || 0)
                      const totalFees = 1000.0 // Assuming total fees is 1000

                      return (
                        <tr key={student.student_id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <i className="fas fa-user text-purple-600 text-sm"></i>
                              </div>
                              {student.full_name}
                            </div>
                          </td>
                          <td className="py-3 px-4">{student.email}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold">₵{totalFees.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-green-600">₵{totalPaid.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${outstanding > 0 ? "text-red-600" : "text-green-600"}`}>
                              ₵{outstanding.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                outstanding <= 0 ? "default" : outstanding < totalFees ? "secondary" : "destructive"
                              }
                              className={
                                outstanding <= 0 ? "bg-green-500" : outstanding < totalFees ? "bg-yellow-500" : ""
                              }
                            >
                              {outstanding <= 0 ? "Fully Paid" : outstanding < totalFees ? "Partial" : "Unpaid"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <i className="fas fa-receipt"></i>
                              </Button>
                              <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                                <i className="fas fa-plus"></i>
                              </Button>
                              <Button size="sm" variant="outline">
                                <i className="fas fa-history"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
