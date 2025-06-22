"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { signIn } from "next-auth/react"

const socialIcons = [
  { provider: "google", icon: "fa-google", label: "Google", color: "#DB4437" },
  { provider: "github", icon: "fa-github", label: "GitHub", color: "#333" },
  { provider: "facebook", icon: "fa-facebook-f", label: "Facebook", color: "#4267B2" },
  { provider: "linkedin", icon: "fa-linkedin-in", label: "LinkedIn", color: "#0077B5" },
]

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [level, setLevel] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSocialSignIn = async (provider: string) => {
    setLoading(true)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      setError("Failed to sign in with " + provider)
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setError(result?.error || "An unknown error occurred.");
    }

    setLoading(false);
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !level) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, level }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registration successful! Please sign in.");
        setIsSignUp(false); // Switch to sign-in form
        // Clear form fields
        setFullName("");
        setEmail("");
        setPassword("");
        setLevel("");
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = () => {
    setIsSignUp(!isSignUp)
    setError("")
    setSuccess("")
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl flex flex-col lg:flex-row overflow-hidden">
        
        {/* Info Panel */}
        <div className={`w-full lg:w-1/2 flex flex-col items-center justify-center text-center text-white p-10 transition-all duration-300 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 ${isSignUp ? 'lg:order-last' : 'lg:order-first'}`}>
          <h1 className="text-4xl font-bold mb-4">{isSignUp ? "Welcome!" : "Welcome Back!"}</h1>
          <p className="text-lg leading-relaxed mb-8">{isSignUp ? "Already have an account? Sign in to access your dashboard." : "Don't have an account? Register to get started."}</p>
          <button onClick={togglePanel} className="bg-white/90 text-blue-700 font-semibold py-3 px-8 rounded-lg hover:bg-white transition-all duration-200 text-lg">
            {isSignUp ? "Sign In" : "Register"}
          </button>
        </div>

        {/* Form Panel */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Image src="/images/seslogo.jpg" alt="SES School Logo" width={60} height={60} className="rounded-full shadow-md" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">School of Engineering</h2>
              <p className="text-gray-500 mt-2 text-sm">{isSignUp ? "Create your account" : "Sign in to your account"}</p>
            </div>

            {success && <div className="p-3 mb-4 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">{success}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {socialIcons.map((s) => (
                  <button 
                    key={s.provider} 
                    onClick={() => handleSocialSignIn(s.provider)} 
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200" 
                    disabled={loading}
                  >
                    <i className={`fa-brands ${s.icon} text-lg`} style={{ color: s.color }}></i>
                    <span>{s.label}</span>
                  </button>
                ))}
            </div>
            
            <div className="relative flex items-center mb-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all" required />
              </div>
               {isSignUp && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Academic Level</label>
                  <select value={level} onChange={e => setLevel(e.target.value)} className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all">
                    <option value="" disabled>Select your level</option>
                    <option value="100">Level 100</option>
                    <option value="200">Level 200</option>
                    <option value="300">Level 300</option>
                    <option value="400">Level 400</option>
                  </select>
                </div>
              )}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50" />
                  <span className="ml-2">{isSignUp ? "I agree to the Terms and Privacy" : "Remember me"}</span>
                </label>
                {!isSignUp && <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>}
              </div>
              {error && <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">{error}</div>}
              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                  {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    </div>
  )
} 