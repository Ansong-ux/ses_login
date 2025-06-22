import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Bell,
  CheckCircle,
  ArrowRight,
  Calculator,
  Star,
  UserCheck,
  Book,
  TrendingUp,
  Bug,
  ClipboardList,
} from "lucide-react";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  return session.user;
}

export default async function DashboardPage() {
  const user = await getUser();

  const pages = [
    {
      title: "Students",
      description: "Manage student records and information.",
      icon: Users,
      href: "/dashboard/students",
    },
    {
      title: "Courses",
      description: "Manage courses and enrollments.",
      icon: BookOpen,
      href: "/dashboard/courses",
    },
    {
      title: "Course Registration",
      description: "Register for courses and manage enrollments.",
      icon: ClipboardList,
      href: "/dashboard/registration",
    },
    {
      title: "Lecturers",
      description: "Manage lecturer information and assignments.",
      icon: UserCheck,
      href: "/dashboard/lecturers",
    },
    {
      title: "Fees",
      description: "Track and manage student fee payments.",
      icon: DollarSign,
      href: "/dashboard/fees",
    },
    {
      title: "Grades",
      description: "Manage and view student grades.",
      icon: GraduationCap,
      href: "/dashboard/grades",
    },
    {
      title: "GPA Calculator",
      description: "Calculate and track student GPA.",
      icon: Calculator,
      href: "/dashboard/gpa-calculator",
    },
    {
      title: "Announcements",
      description: "Create and view announcements.",
      icon: Bell,
      href: "/dashboard/announcements",
    },
    {
      title: "Assignments",
      description: "Manage and track assignments.",
      icon: FileText,
      href: "/dashboard/assignments",
    },
    {
      title: "Attendance",
      description: "Track student attendance.",
      icon: CheckCircle,
      href: "/dashboard/attendance",
    },
    {
      title: "Timetable",
      description: "View and manage class schedules.",
      icon: Calendar,
      href: "/dashboard/timetable",
    },
    {
      title: "Books",
      description: "Manage course books and resources.",
      icon: Book,
      href: "/dashboard/books",
    },
    {
      title: "Engineer Tom",
      description: "Special section for Engineer Tom.",
      icon: Star,
      href: "/dashboard/engineer-tom",
    },
    {
      title: "Growth",
      description: "Track academic growth and progress.",
      icon: TrendingUp,
      href: "/dashboard/growth",
    },
    {
      title: "Debug",
      description: "Debug and development tools.",
      icon: Bug,
      href: "/dashboard/debug",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page, index) => {
          const Icon = page.icon;
          return (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-slate-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">
                      {page.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {page.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={page.href}>
                  <Button className="w-full" variant="outline">
                    Go to {page.title}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 