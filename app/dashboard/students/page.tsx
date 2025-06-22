import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getStudents } from "@/lib/db"
import Link from "next/link"
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  User,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react"

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  return session.user;
}

export default async function StudentsPage() {
  const user = await getUser()
  const students = await getStudents()

  const getStats = () => {
    const totalStudents = students.length
    const paidStudents = students.filter((s: any) => Number.parseFloat(s.outstanding) <= 0).length
    const outstandingStudents = students.filter((s: any) => Number.parseFloat(s.outstanding) > 0).length
    const totalOutstanding = students.reduce((sum: number, s: any) => sum + Number.parseFloat(s.outstanding), 0)
    
    return [
      {
        title: "Total Students",
        value: totalStudents,
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Registered students"
      },
      {
        title: "Paid Fees",
        value: paidStudents,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "Students with no outstanding"
      },
      {
        title: "Outstanding Fees",
        value: outstandingStudents,
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "Students with pending fees"
      },
      {
        title: "Total Outstanding",
        value: `₵${totalOutstanding.toFixed(2)}`,
        icon: DollarSign,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        description: "Amount due"
      }
    ]
  }

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {getStats().map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-slate-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <p className="text-sm text-slate-500">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Students List */}
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Users className="h-5 w-5 text-blue-600" />
                All Students
              </CardTitle>
              <CardDescription>Complete list of registered students</CardDescription>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                Export Data
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Student ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Level</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Total Paid</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Outstanding</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any, index: number) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-slate-900">{student.student_id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{student.first_name} {student.last_name}</p>
                        <p className="text-sm text-slate-500">{student.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4" />
                        <span>{student.phone || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                        Level {student.level}
                      </Badge>
                    </td>
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
                      {Number.parseFloat(student.outstanding) <= 0 ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border-red-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Outstanding
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
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

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 border-slate-200 hover:border-blue-300 transition-colors group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Student Registration</h3>
                <p className="text-sm text-slate-600">Register new students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-slate-200 hover:border-green-300 transition-colors group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Fee Management</h3>
                <p className="text-sm text-slate-600">Manage student fees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-slate-200 hover:border-purple-300 transition-colors group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 transition-colors">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Academic Records</h3>
                <p className="text-sm text-slate-600">View academic history</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
