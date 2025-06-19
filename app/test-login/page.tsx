import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TestLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login System Test</CardTitle>
          <CardDescription className="text-center">
            Use these credentials to test the login functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Credentials:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Email:</strong> simpson.mozu@gmail.com
                <br />
                <strong>Password:</strong> password123
                <br />
                <strong>Role:</strong> Student
              </div>
              <div>
                <strong>Email:</strong> admin@university.edu
                <br />
                <strong>Password:</strong> password123
                <br />
                <strong>Role:</strong> Admin
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">Test Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
              <li>Click "Go to Login" below</li>
              <li>Enter one of the demo email addresses</li>
              <li>Enter "password123" as the password</li>
              <li>Click "Login"</li>
              <li>You should be redirected to the dashboard</li>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Alternative Test:</h3>
            <p className="text-sm text-yellow-800">
              You can also test the registration by creating a new account with any email and password.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Go to Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Go to Register
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
