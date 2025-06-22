import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getStudents } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DebugPage() {
  try {
    const session = await getServerSession(authOptions)
    const students = await getStudents()
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Database Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Students count: {students.length}</p>
              <pre className="bg-gray-100 p-4 rounded overflow-auto mt-4">
                {JSON.stringify(students.slice(0, 2), null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-6">Debug Error</h1>
        <pre className="bg-red-100 p-4 rounded overflow-auto">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    )
  }
} 