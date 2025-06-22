"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function LecturerAttendance({ lecturerId }: { lecturerId: number }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCourses() {
      const response = await fetch('/api/lecturer/courses');
      const data = await response.json();
      if (response.ok) {
        setCourses(data);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    async function fetchSchedules() {
      if (selectedCourse && selectedDate) {
        const response = await fetch(`/api/schedules?courseId=${selectedCourse}&date=${selectedDate}`);
        const data = await response.json();
        if (response.ok) {
          setSchedules(data);
        }
      }
    }
    fetchSchedules();
  }, [selectedCourse, selectedDate]);

  useEffect(() => {
    async function fetchStudents() {
      if (selectedCourse) {
        const response = await fetch(`/api/courses/${selectedCourse}/students`);
        const data = await response.json();
        if(response.ok) {
            setStudents(data);
        }
      }
    }
    fetchStudents();
  }, [selectedCourse]);

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedSchedule) {
      toast({
        title: "Error",
        description: "Please select a class schedule.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendance,
          courseId: selectedCourse,
          scheduleId: selectedSchedule,
          date: selectedDate,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Attendance saved successfully.",
        });
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to save attendance.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Student Attendance</h1>
      <div className="flex gap-4 mb-4">
        <Select onValueChange={setSelectedCourse} value={selectedCourse}>
          <SelectTrigger>
            <SelectValue placeholder="Select Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.length > 0 ? (
              courses.map((course: any) => (
                <SelectItem key={course.course_id} value={course.course_id.toString()}>
                  {course.course_name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-courses" disabled>
                No courses assigned
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Input
          type="date"
          className="w-auto"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      {selectedCourse && selectedDate && (
        <div className="mb-4">
          <Select onValueChange={setSelectedSchedule} value={selectedSchedule}>
            <SelectTrigger>
              <SelectValue placeholder="Select Class Time" />
            </SelectTrigger>
            <SelectContent>
              {schedules.length > 0 ? (
                schedules.map((schedule: any) => (
                  <SelectItem key={schedule.schedule_id} value={schedule.schedule_id.toString()}>
                    {schedule.start_time} - {schedule.end_time} ({schedule.room_number})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-schedules" disabled>
                  No classes scheduled for this day
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}
      {selectedSchedule && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell>{student.first_name} {student.last_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <RadioGroup
                      onValueChange={(status) => handleAttendanceChange(student.student_id.toString(), status)}
                      value={attendance[student.student_id.toString()] || ""}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Present" id={`present-${student.student_id}`} />
                        <Label htmlFor={`present-${student.student_id}`}>Present</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Absent" id={`absent-${student.student_id}`} />
                        <Label htmlFor={`absent-${student.student_id}`}>Absent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Late" id={`late-${student.student_id}`} />
                        <Label htmlFor={`late-${student.student_id}`}>Late</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4">
            <Button onClick={handleSaveAttendance} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 