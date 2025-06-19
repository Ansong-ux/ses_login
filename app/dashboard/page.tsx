import { getDashboardStats, getOutstandingFees, getStudents, getLecturers, getCourses } from "@/lib/db";
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaMoneyBillWave, FaChartLine, FaSearch, FaPlus, FaSignOutAlt, FaSchool, FaClipboardList, FaUsers, FaChalkboard, FaDollarSign, FaCog } from 'react-icons/fa';
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Image from "next/image";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) {
    redirect("/auth");
  }

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    redirect("/auth");
  }
}

export default async function DashboardPage() {
  let user = null, stats: any = {}, outstanding = [], students = [], lecturers = [], courses = [];
  let error = null;
  try {
    user = await getUser();
    stats = (await getDashboardStats()) || {};
    outstanding = (await getOutstandingFees()) || [];
    students = (await getStudents()) || [];
    lecturers = (await getLecturers()) || [];
    courses = (await getCourses()) || [];
  } catch (e) {
    error = "There was a problem loading dashboard data. Displaying demo data.";
    // Demo fallback data
    user = { email: "demo@school.edu" };
    stats = { students: 6, courses: 5, lecturers: 7, outstandingFees: 8500, feesPaid: 900, feesDue: 100 };
    outstanding = [
      { student_id: 1, full_name: "Grace Asante", email: "grace.asante@gmail.com", outstanding: 100 },
    ];
    students = [
      { student_id: 1, first_name: "Grace", last_name: "Asante", email: "grace.asante@gmail.com", phone: "1234567890", total_paid: 900, outstanding: 100 },
    ];
    lecturers = [
      { lecturer_id: 1, first_name: "John", last_name: "Doe", email: "john.doe@school.edu", phone: "1234567890", department: "Engineering" },
    ];
    courses = [
      { course_id: 1, course_code: "ENG101", course_name: "Intro to Engineering", credits: 3, department: "Engineering" },
    ];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-2xl m-4 shadow-lg flex flex-col items-center py-8">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-purple-200 rounded-full p-3 mb-2">
            <FaSchool className="text-purple-600" size={32} />
          </div>
          <span className="font-bold text-xl text-purple-700">SES School</span>
        </div>
        <nav className="flex-1 w-full">
          <ul className="space-y-2 px-6">
            <li className="bg-purple-50 rounded-lg px-4 py-2 flex items-center text-purple-700 font-semibold"><FaChartLine className="mr-3" /> Overview</li>
            <li className="hover:bg-purple-50 rounded-lg px-4 py-2 flex items-center text-gray-600 cursor-pointer"><FaUsers className="mr-3" /> Students</li>
            <li className="hover:bg-purple-50 rounded-lg px-4 py-2 flex items-center text-gray-600 cursor-pointer"><FaBook className="mr-3" /> Courses</li>
            <li className="hover:bg-purple-50 rounded-lg px-4 py-2 flex items-center text-gray-600 cursor-pointer"><FaChalkboard className="mr-3" /> Lecturers</li>
            <li className="hover:bg-purple-50 rounded-lg px-4 py-2 flex items-center text-gray-600 cursor-pointer"><FaDollarSign className="mr-3" /> Fees</li>
            <li className="hover:bg-purple-50 rounded-lg px-4 py-2 flex items-center text-gray-600 cursor-pointer"><FaClipboardList className="mr-3" /> Results</li>
            <li className="hover:bg-purple-50 rounded-lg px-4 py-2 flex items-center text-gray-600 cursor-pointer"><FaCog className="mr-3" /> Settings</li>
          </ul>
        </nav>
        <div className="mt-10 px-6 w-full">
          <button className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold shadow hover:bg-purple-600 transition">Contact Admin</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-500 mt-1">Academic Management Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-purple-600 transition"><FaPlus /> Enroll Student</button>
            <div className="relative">
              <input type="text" placeholder="Search students, courses, lecturers..." className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400" />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"><FaSignOutAlt className="text-gray-500" /></button>
          </div>
        </div>

        {/* Promo Card */}
        <div className="bg-gradient-to-r from-[#5c47bc] to-purple-700 rounded-2xl p-6 flex items-center justify-between shadow-lg">
          <div>
            <h2 className="text-white text-lg font-bold mb-2">Course Registration Eligibility</h2>
            <p className="text-purple-100 mb-4">If you have passed your previous courses, you are eligible to register for the next semester.</p>
            <button className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-purple-50 transition">Check Eligibility</button>
          </div>
          <div className="hidden md:block">
            <Image src="/images/seslogo.jpg" alt="SES School Logo" width={90} height={90} className="rounded-xl" />
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-gray-500">Enrolled Students</div>
            <div className="text-2xl font-bold text-purple-600">{stats.students || 0}</div>
            <div className="text-green-500 text-sm">+10% this term</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-gray-500">Available Courses</div>
            <div className="text-2xl font-bold text-purple-600">{stats.courses || 0}</div>
            <div className="text-red-500 text-sm">-2% this term</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-gray-500">Faculty Members</div>
            <div className="text-2xl font-bold text-purple-600">{stats.lecturers || 0}</div>
            <div className="text-green-500 text-sm">+5% this term</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow text-center">
            <div className="text-gray-500">Outstanding Fees</div>
            <div className="text-2xl font-bold text-purple-600">${stats.outstandingFees?.toLocaleString() || 0}</div>
            <div className="text-purple-500 text-sm">+3% this term</div>
          </div>
        </div>

        {/* Top Students (Outstanding Fees) */}
        <div className="bg-white rounded-xl p-6 shadow mt-8">
          <h2 className="text-lg font-bold mb-4">Students with Outstanding Fees</h2>
          <ul className="space-y-4">
            {(outstanding || []).slice(0, 4).map((student) => (
              <li key={student?.student_id} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                  {student?.full_name?.[0] || "?"}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{student?.full_name || "Unknown"}</div>
                  <div className="text-xs text-gray-500">{student?.email || "-"}</div>
                </div>
                <span className="ml-auto font-bold text-purple-600">${parseFloat(student?.outstanding || 0).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Fee Balances */}
        <div className="bg-white rounded-xl p-6 shadow mt-8">
          <h2 className="text-lg font-bold mb-4">Your Fee Summary</h2>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-500">Fees Paid</div>
              <div className="text-green-600 text-xl font-bold">${stats.feesPaid?.toLocaleString() || 0}</div>
            </div>
            <div>
              <div className="text-gray-500">Fees Due</div>
              <div className="text-red-600 text-xl font-bold">${stats.feesDue?.toLocaleString() || 0}</div>
            </div>
            <button className="bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-600 transition">Settle Fees</button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Placeholder */}
            <div className="bg-white rounded-2xl p-6 shadow flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-700">Tuition Payment Trends</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">This Month</span>
              </div>
              <div className="h-32 flex items-center justify-center text-gray-400">
                {/* Replace with actual chart later */}
                <span>Academic Analytics Chart</span>
              </div>
            </div>

            {/* All Students Table */}
            <div className="bg-white rounded-2xl p-6 shadow mt-8">
              <h3 className="font-semibold text-gray-700 mb-4">Student Registry</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-purple-50 text-purple-700">
                      <th className="px-4 py-2 text-left">Student Name</th>
                      <th className="px-4 py-2 text-left">Email Address</th>
                      <th className="px-4 py-2 text-left">Contact Number</th>
                      <th className="px-4 py-2 text-left">Tuition Paid</th>
                      <th className="px-4 py-2 text-left">Balance Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(students || []).map((student) => (
                      <tr key={student.student_id} className="border-b last:border-0">
                        <td className="px-4 py-2">{student.first_name} {student.last_name}</td>
                        <td className="px-4 py-2">{student.email}</td>
                        <td className="px-4 py-2">{student.phone}</td>
                        <td className="px-4 py-2 text-green-600">${parseFloat(student.total_paid || 0).toFixed(2)}</td>
                        <td className="px-4 py-2 text-red-600">${parseFloat(student.outstanding || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* All Lecturers Table */}
            <div className="bg-white rounded-2xl p-6 shadow mt-8">
              <h3 className="font-semibold text-gray-700 mb-4">Faculty Directory</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-purple-50 text-purple-700">
                      <th className="px-4 py-2 text-left">Faculty Name</th>
                      <th className="px-4 py-2 text-left">Email Address</th>
                      <th className="px-4 py-2 text-left">Contact Number</th>
                      <th className="px-4 py-2 text-left">Academic Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(lecturers || []).map((lecturer) => (
                      <tr key={lecturer.lecturer_id} className="border-b last:border-0">
                        <td className="px-4 py-2">{lecturer.first_name} {lecturer.last_name}</td>
                        <td className="px-4 py-2">{lecturer.email}</td>
                        <td className="px-4 py-2">{lecturer.phone}</td>
                        <td className="px-4 py-2">{lecturer.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* All Courses Table */}
            <div className="bg-white rounded-2xl p-6 shadow mt-8">
              <h3 className="font-semibold text-gray-700 mb-4">Course Catalog</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-purple-50 text-purple-700">
                      <th className="px-4 py-2 text-left">Course Code</th>
                      <th className="px-4 py-2 text-left">Course Title</th>
                      <th className="px-4 py-2 text-left">Credit Hours</th>
                      <th className="px-4 py-2 text-left">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(courses || []).map((course) => (
                      <tr key={course.course_id} className="border-b last:border-0">
                        <td className="px-4 py-2">{course.course_code}</td>
                        <td className="px-4 py-2">{course.course_name}</td>
                        <td className="px-4 py-2">{course.credits}</td>
                        <td className="px-4 py-2">{course.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Top Students List */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-semibold text-gray-700 mb-4">Students with Outstanding Tuition</h3>
              <ul className="space-y-4">
                {(outstanding || []).slice(0, 4).map((student) => (
                  <li key={student?.student_id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">
                      {student?.full_name?.[0] || "?"}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{student?.full_name || "Unknown"}</div>
                      <div className="text-xs text-gray-500">{student?.email || "-"}</div>
                    </div>
                    <span className="ml-auto font-bold text-purple-600">${parseFloat(student?.outstanding || 0).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Balances */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-semibold text-gray-700 mb-4">Tuition Summary</h3>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-xs text-gray-500">Total Tuition Collected</div>
                  <div className="text-lg font-bold text-green-600">${(outstanding || []).reduce((sum, s) => sum + parseFloat(s.total_paid || 0), 0).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Outstanding Tuition</div>
                  <div className="text-lg font-bold text-red-600">${(outstanding || []).reduce((sum, s) => sum + parseFloat(s.outstanding || 0), 0).toFixed(2)}</div>
                </div>
              </div>
              <button className="w-full bg-purple-500 text-white py-2 rounded-lg font-semibold shadow hover:bg-purple-600 transition">Process Payment</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}