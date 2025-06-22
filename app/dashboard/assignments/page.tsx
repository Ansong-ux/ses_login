import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAssignments, getStudentAssignments } from "@/lib/db";
import { AssignmentActions } from "./components";
import Link from "next/link";
import { Download, Calendar, BarChart, Plus } from "lucide-react";

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/auth");
  }
  return session.user;
}

export default async function AssignmentsPage() {
  const user = await getUser();

  // For demo purposes, we'll use student ID 1
  // In a real app, you'd get the student ID from the user's profile
  const studentId = 1;

  const assignments = await getAssignments();
  const studentAssignments = await getStudentAssignments(studentId);

  return (
    <div className="space-y-8">
      {/* Assignments Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 break-words">
              <i className="fas fa-book"></i>
              Total Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assignments.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 break-words">
              <i className="fas fa-check-circle"></i>
              Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                studentAssignments.filter(
                  (a) => a.submission_status === "submitted"
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 break-words">
              <i className="fas fa-clock"></i>
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                studentAssignments.filter(
                  (a) => a.submission_status === "pending"
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 break-words">
              <i className="fas fa-star"></i>
              Average Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {studentAssignments.length > 0
                ? (
                    studentAssignments.reduce(
                      (sum, a) => sum + (a.grade || 0),
                      0
                    ) / studentAssignments.length
                  ).toFixed(1)
                : "0.0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Actions */}
      <AssignmentActions
        assignments={assignments}
        studentAssignments={studentAssignments}
        studentId={studentId}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Additional resources and tools for assignments.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="mr-2 h-4 w-4" />
            Download All Assignments
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Assignment Calendar
          </Button>
          <Button variant="outline">
            <BarChart className="mr-2 h-4 w-4" />
            Performance Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 