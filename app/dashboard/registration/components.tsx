'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Course {
  course_id: number
  course_code: string
  course_name: string
  description?: string
  credits: number
  level: number
  semester: string
  prerequisites?: string
  max_capacity: number
  enrolled_count: number
  available_seats: number
  lecturer_name?: string
  lecturer_email?: string
}

interface Enrollment {
  enrollment_id: number
  course_id: number
  student_id: number
  enrollment_date: string
  status: string
  grade?: string
  course_code: string
  course_name: string
  description?: string
  credits: number
  level: number
  semester: string
  lecturer_name?: string
  lecturer_email?: string
}

interface CourseRegistrationProps {
  availableCourses: Course[]
  enrollments: Enrollment[]
  studentId: number
}

export function CourseRegistrationActions({ availableCourses, enrollments, studentId }: CourseRegistrationProps) {
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({})
  const [enrollmentsList, setEnrollmentsList] = useState<Enrollment[]>(enrollments)
  const [availableCoursesList, setAvailableCoursesList] = useState<Course[]>(availableCourses)

  const handleRegister = async (courseId: number) => {
    setLoading(prev => ({ ...prev, [courseId]: true }))
    
    try {
      const response = await fetch('/api/course-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, courseId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Successfully registered for course!')
        
        // Update the lists
        const course = availableCoursesList.find(c => c.course_id === courseId)
        if (course) {
          // Add to enrollments
          const newEnrollment: Enrollment = {
            enrollment_id: data.enrollmentId,
            course_id: course.course_id,
            student_id: studentId,
            enrollment_date: new Date().toISOString(),
            status: 'enrolled',
            course_code: course.course_code,
            course_name: course.course_name,
            description: course.description,
            credits: course.credits,
            level: course.level,
            semester: course.semester,
            lecturer_name: course.lecturer_name,
            lecturer_email: course.lecturer_email,
          }
          
          setEnrollmentsList(prev => [...prev, newEnrollment])
          
          // Remove from available courses
          setAvailableCoursesList(prev => prev.filter(c => c.course_id !== courseId))
        }
      } else {
        toast.error(data.error || 'Failed to register for course')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An error occurred while registering for the course')
    } finally {
      setLoading(prev => ({ ...prev, [courseId]: false }))
    }
  }

  const handleDropCourse = async (courseId: number) => {
    setLoading(prev => ({ ...prev, [courseId]: true }))
    
    try {
      const response = await fetch(`/api/course-registration?studentId=${studentId}&courseId=${courseId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Successfully dropped course!')
        
        // Update the lists
        const enrollment = enrollmentsList.find(e => e.course_id === courseId)
        if (enrollment) {
          // Add back to available courses
          const course: Course = {
            course_id: enrollment.course_id,
            course_code: enrollment.course_code,
            course_name: enrollment.course_name,
            description: enrollment.description,
            credits: enrollment.credits,
            level: enrollment.level,
            semester: enrollment.semester,
            prerequisites: 'None',
            max_capacity: 30,
            enrolled_count: 0,
            available_seats: 30,
            lecturer_name: enrollment.lecturer_name,
            lecturer_email: enrollment.lecturer_email,
          }
          
          setAvailableCoursesList(prev => [...prev, course])
          
          // Remove from enrollments
          setEnrollmentsList(prev => prev.filter(e => e.course_id !== courseId))
        }
      } else {
        toast.error(data.error || 'Failed to drop course')
      }
    } catch (error) {
      console.error('Drop course error:', error)
      toast.error('An error occurred while dropping the course')
    } finally {
      setLoading(prev => ({ ...prev, [courseId]: false }))
    }
  }

  return (
    <div className="space-y-8">
      {/* Current Enrollments */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="fas fa-list-check"></i>
              Current Enrollments ({enrollmentsList.length})
            </CardTitle>
            <CardDescription>
              Courses you are currently registered for this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollmentsList.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Enrollments</h3>
                <p className="text-gray-500">You haven't registered for any courses yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollmentsList.map((course) => (
                  <Card key={course.course_id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{course.course_code}</CardTitle>
                          <CardDescription>{course.course_name}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {course.credits} Credits
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status:</span>
                          <Badge className="bg-green-100 text-green-800">
                            {course.status || 'Enrolled'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Enrolled:</span>
                          <span>{new Date(course.enrollment_date).toLocaleDateString()}</span>
                        </div>
                        {course.lecturer_name && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Lecturer:</span>
                            <span className="truncate">{course.lecturer_name}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <i className="fas fa-eye mr-2"></i>
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-red-600 hover:text-red-700"
                          onClick={() => handleDropCourse(course.course_id)}
                          disabled={loading[course.course_id]}
                        >
                          {loading[course.course_id] ? (
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                          ) : (
                            <i className="fas fa-times mr-2"></i>
                          )}
                          Drop Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Courses */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="fas fa-plus-circle"></i>
              Available Courses for Registration ({availableCoursesList.length})
            </CardTitle>
            <CardDescription>
              Browse and register for courses available this semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableCoursesList.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Available Courses</h3>
                <p className="text-gray-500">All courses are either full or registration is closed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCoursesList.map((course) => (
                  <Card key={course.course_id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{course.course_code}</CardTitle>
                          <CardDescription>{course.course_name}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {course.credits} Credits
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Level:</span>
                          <span>{course.level}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Semester:</span>
                          <span>{course.semester}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Prerequisites:</span>
                          <span className="truncate">{course.prerequisites || 'None'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available Seats:</span>
                          <Badge className={course.available_seats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {course.available_seats}
                          </Badge>
                        </div>
                        {course.lecturer_name && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Lecturer:</span>
                            <span className="truncate">{course.lecturer_name}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Button 
                          className="w-full" 
                          disabled={course.available_seats <= 0 || loading[course.course_id]}
                          onClick={() => handleRegister(course.course_id)}
                        >
                          {loading[course.course_id] ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Registering...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-plus mr-2"></i>
                              Register for Course
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 