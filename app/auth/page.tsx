"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const socialIcons = [
  { icon: "fa-google-plus-g", label: "Google" },
  { icon: "fa-facebook-f", label: "Facebook" },
  { icon: "fa-github", label: "GitHub" },
  { icon: "fa-linkedin-in", label: "LinkedIn" },
]

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        router.push("/dashboard")
      } else {
        const data = await res.json()
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className={`relative w-full max-w-4xl min-h-[600px] bg-white rounded-[30px] shadow-xl overflow-hidden transition-all duration-700 ${isSignUp ? "[&_.sign-in]:translate-x-full [&_.sign-up]:translate-x-full [&_.sign-up]:opacity-100 [&_.sign-up]:z-10 [&_.toggle-container]:-translate-x-full" : ""}`} id="container">
        {/* Sign Up Form */}
        {!isSignUp ? (
          <div className="form-container sign-in absolute top-0 left-0 w-1/2 h-full z-20 transition-all duration-700 translate-x-0 opacity-100 z-20" style={{background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '0 40px'}}>
            <form className="w-full flex flex-col items-center" onSubmit={handleSignIn}>
              <div className="flex flex-col items-center justify-center mb-4">
                <Image src="/images/seslogo.jpg" alt="SES School Logo" width={60} height={60} className="rounded-lg" />
                <span className="mt-2 text-blue-700 font-medium text-base">School of Engineering</span>
              </div>
              <h1 className="text-2xl font-bold mb-4">Sign In</h1>
              <div className="social-icons flex gap-2 mb-4">
                {socialIcons.map((s) => (
                  <a key={s.icon} href="#" className="icon border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-center text-xl text-gray-600 hover:bg-[#5c47bc] hover:text-white transition"><i className={`fa-brands ${s.icon}`}></i></a>
                ))}
              </div>
              <span className="text-xs text-gray-500 mb-2">or use your email password</span>
              <input type="email" placeholder="Email" className="bg-gray-100 rounded-lg px-4 py-2 my-2 w-full outline-none" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" className="bg-gray-100 rounded-lg px-4 py-2 my-2 w-full outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
              <a href="#" className="text-xs text-gray-400 mt-2 mb-2">Forget Your Password?</a>
              {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
              <button type="submit" className="bg-[#512da8] text-white font-semibold rounded-lg px-8 py-2 mt-2 uppercase text-xs tracking-wider" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
            </form>
          </div>
        ) : (
          <div className="form-container sign-up absolute top-0 left-0 w-1/2 h-full transition-all duration-700 translate-x-full opacity-100 z-10" style={{background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '0 40px'}}>
            <form className="w-full flex flex-col items-center">
              <div className="flex flex-col items-center justify-center mb-4">
                <Image src="/images/seslogo.jpg" alt="SES School Logo" width={60} height={60} className="rounded-lg" />
                <span className="mt-2 text-blue-700 font-medium text-base">School of Engineering</span>
              </div>
              <h1 className="text-2xl font-bold mb-4">Enroll</h1>
              <div className="social-icons flex gap-2 mb-4">
                {socialIcons.map((s) => (
                  <a key={s.icon} href="#" className="icon border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-center text-xl text-gray-600 hover:bg-[#5c47bc] hover:text-white transition"><i className={`fa-brands ${s.icon}`}></i></a>
                ))}
              </div>
              <span className="text-xs text-gray-500 mb-2">or use your email for registration</span>
              <input type="text" placeholder="Name" className="bg-gray-100 rounded-lg px-4 py-2 my-2 w-full outline-none" />
              <input type="email" placeholder="Email" className="bg-gray-100 rounded-lg px-4 py-2 my-2 w-full outline-none" />
              <input type="password" placeholder="Password" className="bg-gray-100 rounded-lg px-4 py-2 my-2 w-full outline-none" />
              <select className="bg-gray-100 rounded-lg px-4 py-2 my-2 w-full outline-none text-gray-700" defaultValue="">
                <option value="" disabled>Select Level</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
              </select>
              <button type="submit" className="bg-[#512da8] text-white font-semibold rounded-lg px-8 py-2 mt-4 mb-0 uppercase text-xs tracking-wider">Register</button>
            </form>
          </div>
        )}
        {/* Toggle Container */}
        <div className={`toggle-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 z-30 ${isSignUp ? "-translate-x-full rounded-l-[150px]" : "rounded-l-[150px]"}`} style={{background: 'transparent'}}>
          <div className={`toggle bg-gradient-to-r from-[#5c6bc0] to-[#512da8] h-full w-[200%] absolute left-[-100%] flex transition-all duration-700 ${isSignUp ? "translate-x-1/2" : "translate-x-0"}`}>
            {/* Left Panel */}
            <div className={`toggle-panel toggle-left w-1/2 h-full flex flex-col items-center justify-center text-center px-8 transition-all duration-700 ${isSignUp ? "translate-x-0" : "-translate-x-full"}`}>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome Back!</h1>
              <p className="text-white text-sm mb-4">Enter your personal details to use all of site features</p>
              <button className="bg-transparent border border-white text-white font-semibold rounded-lg px-8 py-2 mt-2 uppercase text-xs tracking-wider" onClick={() => setIsSignUp(false)}>Sign In</button>
            </div>
            {/* Right Panel */}
            <div className={`toggle-panel toggle-right w-1/2 h-full flex flex-col items-center justify-center text-center px-8 transition-all duration-700 ${isSignUp ? "translate-x-full" : "translate-x-0"}`}>
              <h1 className="text-2xl font-bold text-white mb-2">Dear Engineering Student!</h1>
              <p className="text-white text-sm mb-4">Access the site with your credentials</p>
              <button className="bg-transparent border border-white text-white font-semibold rounded-lg px-8 py-2 mt-2 uppercase text-xs tracking-wider" onClick={() => setIsSignUp(true)}>Register</button>
            </div>
          </div>
        </div>
      </div>
      {/* FontAwesome CDN for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    </div>
  )
}
