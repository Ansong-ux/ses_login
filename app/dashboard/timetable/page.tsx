import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  return session.user;
}

export default async function TimetablePage() {
  const user = await getUser()

  const timetableData = [
    {
      day: "Monday",
      courses: [
        { time: "08:00 - 10:00", course: "Computer Programming", room: "Lab 101", lecturer: "Dr. Smith" },
        { time: "10:30 - 12:30", course: "Mathematics", room: "Room 201", lecturer: "Prof. Johnson" },
        { time: "14:00 - 16:00", course: "Physics", room: "Lab 102", lecturer: "Dr. Williams" }
      ]
    },
    {
      day: "Tuesday",
      courses: [
        { time: "08:00 - 10:00", course: "Digital Electronics", room: "Lab 103", lecturer: "Dr. Brown" },
        { time: "10:30 - 12:30", course: "Engineering Drawing", room: "Room 202", lecturer: "Prof. Davis" },
        { time: "14:00 - 16:00", course: "Communication Skills", room: "Room 203", lecturer: "Ms. Wilson" }
      ]
    },
    {
      day: "Wednesday",
      courses: [
        { time: "08:00 - 10:00", course: "Circuit Theory", room: "Lab 104", lecturer: "Dr. Miller" },
        { time: "10:30 - 12:30", course: "Computer Architecture", room: "Room 204", lecturer: "Prof. Garcia" },
        { time: "14:00 - 16:00", course: "Programming Lab", room: "Lab 105", lecturer: "Dr. Rodriguez" }
      ]
    },
    {
      day: "Thursday",
      courses: [
        { time: "08:00 - 10:00", course: "Data Structures", room: "Lab 106", lecturer: "Dr. Martinez" },
        { time: "10:30 - 12:30", course: "Database Systems", room: "Room 205", lecturer: "Prof. Anderson" },
        { time: "14:00 - 16:00", course: "Web Development", room: "Lab 107", lecturer: "Dr. Taylor" }
      ]
    },
    {
      day: "Friday",
      courses: [
        { time: "08:00 - 10:00", course: "Software Engineering", room: "Room 206", lecturer: "Prof. Thomas" },
        { time: "10:30 - 12:30", course: "Network Security", room: "Lab 108", lecturer: "Dr. Jackson" },
        { time: "14:00 - 16:00", course: "Project Work", room: "Lab 109", lecturer: "Dr. White" }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Class Timetable</h1>
          <p className="text-slate-600 mt-2">
            View your weekly class schedule and room assignments
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
            Download PDF
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
            Print Schedule
          </Button>
        </div>
      </div>

      {/* Timetable */}
      <div className="grid gap-6">
        {timetableData.map((day, index) => (
          <Card key={index} className="border-2 border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">{day.day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {day.courses.map((course, courseIndex) => (
                  <div key={courseIndex} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-50">
                        <span className="text-sm font-semibold text-blue-600">{course.time}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{course.course}</h3>
                        <p className="text-sm text-slate-600">{course.lecturer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                        {course.room}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Info */}
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Schedule Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Class Hours</h3>
              <p className="text-sm text-slate-600">Morning: 8:00 AM - 12:30 PM</p>
              <p className="text-sm text-slate-600">Afternoon: 2:00 PM - 6:30 PM</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Break Times</h3>
              <p className="text-sm text-slate-600">Morning Break: 10:00 - 10:30 AM</p>
              <p className="text-sm text-slate-600">Lunch Break: 12:30 - 2:00 PM</p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">Contact</h3>
              <p className="text-sm text-slate-600">Academic Office: Room 101</p>
              <p className="text-sm text-slate-600">Phone: +233 XX XXX XXXX</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 