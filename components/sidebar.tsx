"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FaChartLine, FaUsers, FaBook, FaChalkboard, FaDollarSign, FaClipboardList,
  FaCalendarAlt, FaRobot, FaCalculator, FaRocket, FaCog, FaEdit, FaClock, FaBullhorn, FaFileAlt
} from "react-icons/fa"
import Image from "next/image"

const studentLinks = [
  { href: "/dashboard", icon: FaChartLine, text: "Overview" },
  { href: "/dashboard/registration", icon: FaEdit, text: "Registration" },
  { href: "/dashboard/assignments", icon: FaFileAlt, text: "Assignments" },
  { href: "/dashboard/timetable", icon: FaClock, text: "Timetable" },
  { href: "/dashboard/grades", icon: FaClipboardList, text: "Grades" },
  { href: "/dashboard/fees", icon: FaDollarSign, text: "Fees" },
  { href: "/dashboard/announcements", icon: FaBullhorn, text: "Announcements" },
  { href: "/dashboard/courses", icon: FaBook, text: "All Courses" },
];

const adminLinks = [
  { href: "/dashboard", icon: FaChartLine, text: "Overview" },
  { href: "/dashboard/students", icon: FaUsers, text: "Students" },
  { href: "/dashboard/courses", icon: FaBook, text: "Courses" },
  { href: "/dashboard/lecturers", icon: FaChalkboard, text: "Lecturers" },
  { href: "/dashboard/assignments", icon: FaFileAlt, text: "Assignments" },
  { href: "/dashboard/fees", icon: FaDollarSign, text: "Fees" },
  { href: "/dashboard/grades", icon: FaClipboardList, text: "Results" },
  { href: "/dashboard/attendance", icon: FaCalendarAlt, text: "Attendance" },
  { href: "/dashboard/debug", icon: FaCog, text: "Debug" },
];

export function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const links = userRole === 'student' ? studentLinks : adminLinks;

  return (
    <aside className="w-72 bg-blue-600 text-white flex-shrink-0 p-8 flex flex-col rounded-r-3xl shadow-2xl">
      <div className="flex items-center gap-4 mb-16">
        <Image 
          src="/images/seslogo.jpg" 
          alt="SES Logo" 
          width={48} 
          height={48} 
          className="rounded-xl border-2 border-blue-400"
        />
        <span className="font-bold text-3xl tracking-tight">SES Portal</span>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-4">
          {links.map(({ href, icon: Icon, text }) => (
            <li key={href}>
              <Link
                href={href}
                className={`
                  flex items-center gap-4 px-5 py-3 rounded-xl cursor-pointer transition-all duration-300 text-base font-bold
                  ${pathname === href 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'hover:bg-blue-700/60'
                  }
                `}
              >
                <Icon className="h-6 w-6" />
                <span>{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-12 text-center">
        <p className="text-xs text-blue-200/80 font-medium">&copy; 2024 School of Engineering</p>
      </div>
    </aside>
  )
} 