'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface Assignment {
  assignment_id: number
  title: string
  description: string
  course_code: string
  course_name: string
  due_date: string
  max_score: number
  assignment_type: string
  created_by_email: string
  created_at: string
}

interface StudentAssignment {
  assignment_id: number
  title: string
  description: string
  course_code: string
  course_name: string
  due_date: string
  max_score: number
  assignment_type: string
  submission_status: string
  submitted_at?: string
  grade?: number
  feedback?: string
  file_url?: string
  file_name?: string
}

interface AssignmentActionsProps {
  assignments: Assignment[]
  studentAssignments: StudentAssignment[]
  studentId: number
}

export function AssignmentActions({ assignments, studentAssignments, studentId }: AssignmentActionsProps) {
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submissionComment, setSubmissionComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'text/plain'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('File type not supported. Please upload PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, or TXT files.')
        return
      }
      
      setSelectedFile(file)
      toast.success(`File selected: ${file.name}`)
    }
  }

  const handleSubmitAssignment = async (assignmentId: number) => {
    if (!selectedFile) {
      toast.error('Please select a file to submit')
      return
    }

    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('assignmentId', assignmentId.toString())
      formData.append('studentId', studentId.toString())
      formData.append('comment', submissionComment)

      const response = await fetch('/api/assignments/submit', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Assignment submitted successfully!')
        setSelectedFile(null)
        setSubmissionComment('')
        window.location.reload()
      } else {
        toast.error(data.error || 'Failed to submit assignment')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('An error occurred while submitting the assignment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-orange-100 text-orange-800'
      case 'late': return 'bg-red-100 text-red-800'
      case 'graded': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return '📝'
      case 'quiz': return '📋'
      case 'exam': return '📄'
      case 'project': return '💼'
      default: return '📚'
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-8">
      {/* Current Assignments */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <i className="fas fa-list-check"></i>
              My Assignments ({studentAssignments.length})
            </CardTitle>
            <CardDescription>
              Track your assignment submissions and grades
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentAssignments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Assignments</h3>
                <p className="text-gray-500">You don't have any assignments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentAssignments.map((assignment) => (
                  <Card key={assignment.assignment_id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{getAssignmentTypeIcon(assignment.assignment_type)}</div>
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="bg-blue-50">
                                {assignment.course_code}
                              </Badge>
                              <Badge className={getStatusColor(assignment.submission_status)}>
                                {assignment.submission_status}
                              </Badge>
                              {isOverdue(assignment.due_date) && assignment.submission_status === 'pending' && (
                                <Badge className="bg-red-100 text-red-800">
                                  Overdue
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{assignment.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                <i className="fas fa-calendar mr-1"></i>
                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                              </span>
                              <span>
                                <i className="fas fa-star mr-1"></i>
                                Max Score: {assignment.max_score}
                              </span>
                              {assignment.grade && (
                                <span>
                                  <i className="fas fa-trophy mr-1"></i>
                                  Grade: {assignment.grade}/{assignment.max_score}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {assignment.submission_status === 'pending' && (
                        <div className="space-y-4">
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Submit Assignment</h4>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Upload File (PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, TXT)
                                </label>
                                <Input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
                                  onChange={handleFileSelect}
                                  className="cursor-pointer"
                                />
                                {selectedFile && (
                                  <p className="text-sm text-green-600 mt-1">
                                    Selected: {selectedFile.name}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Comment (Optional)
                                </label>
                                <Textarea
                                  placeholder="Add any comments about your submission..."
                                  value={submissionComment}
                                  onChange={(e) => setSubmissionComment(e.target.value)}
                                  rows={3}
                                />
                              </div>
                              <Button
                                onClick={() => handleSubmitAssignment(assignment.assignment_id)}
                                disabled={!selectedFile || isSubmitting}
                                className="w-full"
                              >
                                {isSubmitting ? (
                                  <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Submitting...
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-upload mr-2"></i>
                                    Submit Assignment
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {assignment.submission_status === 'submitted' && (
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">
                                <i className="fas fa-check-circle text-green-500 mr-1"></i>
                                Submitted on {assignment.submitted_at ? new Date(assignment.submitted_at).toLocaleDateString() : 'N/A'}
                              </p>
                              {assignment.file_name && (
                                <p className="text-sm text-gray-600">
                                  <i className="fas fa-file mr-1"></i>
                                  File: {assignment.file_name}
                                </p>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              <i className="fas fa-download mr-2"></i>
                              Download
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {assignment.feedback && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold mb-2">Feedback</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {assignment.feedback}
                          </p>
                        </div>
                      )}
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