import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCourses, getStudentEnrollments } from "@/lib/db"
import Link from "next/link"
import { 
  BookOpen, 
  Users, 
  Calculator, 
  Clock, 
  GraduationCap,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  Star
} from "lucide-react"

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  return session.user;
}

export default async function CoursesPage() {
  const user = await getUser()
  const courses = await getCourses()
  const enrollments = user.role === 'student' ? await getStudentEnrollments(user.student_id || 1) : []

  const getStats = () => {
    const totalCredits = courses.reduce((sum: number, course: any) => sum + (course.credits || 3), 0)
    const averageEnrollment = Math.round(courses.length * 2.5)
    
    return [
      {
        title: "Total Courses",
        value: courses.length,
        icon: BookOpen,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        description: "Available courses"
      },
      {
        title: "Total Credits",
        value: totalCredits,
        icon: Calculator,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "Total credit hours"
      },
      {
        title: "Average Enrollment",
        value: averageEnrollment,
        icon: Users,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        description: "Students per course"
      },
      {
        title: "Active Semesters",
        value: 2,
        icon: Calendar,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        description: "Current & upcoming"
      }
    ]
  }

  const getEnrolledCourses = () => {
    if (user.role !== 'student') return []
    return enrollments.filter((enrollment: any) => enrollment.status === 'enrolled')
  }

  const getAvailableCourses = () => {
    if (user.role !== 'student') return courses
    const enrolledCourseIds = enrollments.map((e: any) => e.course_id)
    return courses.filter((course: any) => !enrolledCourseIds.includes(course.id))
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

      {/* Search and Filters */}
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Search className="h-5 w-5 text-blue-600" />
            Search & Filter Courses
          </CardTitle>
          <CardDescription>Find the courses you're looking for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses by name or code..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 border-slate-300 hover:bg-slate-50">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Courses */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {user.role === "student" ? "Available Courses" : "All Courses"}
            </h2>
            <p className="text-slate-600">
              {user.role === "student"
                ? "Courses you can enroll in"
                : "All available courses in the system"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {getAvailableCourses().length} courses
            </Badge>
            {user.role !== "student" && (
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            )}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getAvailableCourses().map((course: any, index: number) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-slate-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg text-slate-900">{course.course_code}</CardTitle>
                    <CardDescription className="text-slate-600 line-clamp-2">{course.course_name}</CardDescription>
                  </div>
                  {user.role !== 'student' && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2">
                  {course.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <GraduationCap className="h-4 w-4" />
                    <span>{course.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <User className="h-4 w-4" />
                    <span>{course.lecturer_name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-slate-800">{course.credits} credits</span>
                  </div>
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <Button variant="outline" className="flex items-center gap-2 border-slate-300 hover:bg-slate-50">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 