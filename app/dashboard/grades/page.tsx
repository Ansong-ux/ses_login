import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getGrades, getStudentGrades } from "@/lib/db"
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  BookOpen,
  Calculator,
  Star,
  CheckCircle,
  AlertCircle
} from "lucide-react"

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  return session.user;
}

export default async function GradesPage() {
  const user = await getUser()
  const grades = await getGrades()
  const studentGrades = user.role === 'student' ? await getStudentGrades(user.student_id || 1) : []

  const getStats = () => {
    const totalGrades = grades.length
    const averageGrade = grades.length > 0 ? grades.reduce((sum: number, grade: any) => sum + grade.grade, 0) / grades.length : 0
    const highestGrade = grades.length > 0 ? Math.max(...grades.map((grade: any) => grade.grade)) : 0
    const passingGrades = grades.filter((grade: any) => grade.grade >= 60).length
    
    return [
      {
        title: "Total Grades",
        value: totalGrades,
        icon: GraduationCap,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Recorded grades"
      },
      {
        title: "Average Grade",
        value: `${averageGrade.toFixed(1)}%`,
        icon: Calculator,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "Class average"
      },
      {
        title: "Highest Grade",
        value: `${highestGrade}%`,
        icon: Award,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        description: "Top performance"
      },
      {
        title: "Passing Rate",
        value: `${((passingGrades / totalGrades) * 100).toFixed(1)}%`,
        icon: CheckCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        description: "Students passing"
      }
    ]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Grades Management</h1>
          <p className="text-slate-600 mt-2">
            View and manage student grades and academic performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
            Export Grades
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
            Add Grade
          </Button>
        </div>
      </div>

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

      {/* Grades Table */}
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Recent Grades</CardTitle>
          <CardDescription>Latest grade submissions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Assignment</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Grade</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade: any, index: number) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {grade.student_id}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900">Student {grade.student_id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">Assignment {grade.assignment_id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{grade.grade}%</span>
                        {grade.grade >= 90 && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={grade.grade >= 60 ? "default" : "destructive"}
                        className={grade.grade >= 60 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {grade.grade >= 60 ? "Passing" : "Failing"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <TrendingUp className="h-4 w-4" />
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

      {/* Grade Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">A (90-100%)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">B (80-89%)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-sm font-medium">35%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">C (70-79%)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">D/F (Below 70%)</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Strong Performance</p>
                  <p className="text-sm text-green-700">90% of students are passing</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Improving Trends</p>
                  <p className="text-sm text-blue-700">Average grade increased by 5%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Attention Needed</p>
                  <p className="text-sm text-orange-700">3 students need academic support</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
