'use client';

import { useState } from 'react';
import { FaCalculator, FaPlus, FaTrash, FaGraduationCap, FaChartLine, FaSave, FaDownload, FaUndo } from 'react-icons/fa';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string;
}

interface GPAResult {
  totalCredits: number;
  totalPoints: number;
  gpa: number;
  letterGrade: string;
  status: string;
}

const gradePoints: { [key: string]: number } = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0,
  'W': 0.0, // Withdrawal
  'I': 0.0, // Incomplete
};

const gradeColors: { [key: string]: string } = {
  'A+': 'text-green-600',
  'A': 'text-green-600',
  'A-': 'text-green-500',
  'B+': 'text-blue-600',
  'B': 'text-blue-600',
  'B-': 'text-blue-500',
  'C+': 'text-yellow-600',
  'C': 'text-yellow-600',
  'C-': 'text-yellow-500',
  'D+': 'text-orange-600',
  'D': 'text-orange-600',
  'F': 'text-red-600',
  'W': 'text-gray-600',
  'I': 'text-gray-600',
};

const sampleCourses = [
  { code: 'CS101', name: 'Introduction to Computer Science', credits: 3, grade: 'A' },
  { code: 'MATH201', name: 'Calculus I', credits: 4, grade: 'B+' },
  { code: 'PHYS101', name: 'Physics I', credits: 4, grade: 'A-' },
  { code: 'ENG101', name: 'English Composition', credits: 3, grade: 'A' },
  { code: 'CS201', name: 'Data Structures', credits: 3, grade: 'B' },
];

export default function GPACalculatorPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [gpaResult, setGpaResult] = useState<GPAResult | null>(null);
  const [showSampleData, setShowSampleData] = useState(false);

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      code: '',
      name: '',
      credits: 3,
      grade: 'A',
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const calculateGPA = () => {
    if (courses.length === 0) return;

    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach(course => {
      const points = gradePoints[course.grade] || 0;
      totalCredits += course.credits;
      totalPoints += points * course.credits;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    
    let letterGrade = '';
    let status = '';

    if (gpa >= 3.7) {
      letterGrade = 'A';
      status = 'Excellent';
    } else if (gpa >= 3.3) {
      letterGrade = 'B+';
      status = 'Very Good';
    } else if (gpa >= 3.0) {
      letterGrade = 'B';
      status = 'Good';
    } else if (gpa >= 2.7) {
      letterGrade = 'B-';
      status = 'Above Average';
    } else if (gpa >= 2.3) {
      letterGrade = 'C+';
      status = 'Average';
    } else if (gpa >= 2.0) {
      letterGrade = 'C';
      status = 'Below Average';
    } else if (gpa >= 1.7) {
      letterGrade = 'C-';
      status = 'Poor';
    } else if (gpa >= 1.0) {
      letterGrade = 'D';
      status = 'Very Poor';
    } else {
      letterGrade = 'F';
      status = 'Failing';
    }

    setGpaResult({
      totalCredits,
      totalPoints,
      gpa: Math.round(gpa * 100) / 100,
      letterGrade,
      status,
    });
  };

  const loadSampleData = () => {
    const sampleCoursesData = sampleCourses.map(course => ({
      ...course,
      id: Date.now().toString() + Math.random(),
    }));
    setCourses(sampleCoursesData);
    setShowSampleData(true);
  };

  const clearAll = () => {
    setCourses([]);
    setGpaResult(null);
    setShowSampleData(false);
  };

  const exportToCSV = () => {
    if (courses.length === 0) return;

    const csvContent = [
      'Course Code,Course Name,Credits,Grade,Grade Points',
      ...courses.map(course => 
        `${course.code},${course.name},${course.credits},${course.grade},${gradePoints[course.grade]}`
      ),
      '',
      `Total Credits,${gpaResult?.totalCredits || 0}`,
      `Total Points,${gpaResult?.totalPoints || 0}`,
      `GPA,${gpaResult?.gpa || 0}`,
      `Letter Grade,${gpaResult?.letterGrade || ''}`,
      `Status,${gpaResult?.status || ''}`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gpa_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('gpaCalculatorData', JSON.stringify({
      courses,
      gpaResult,
      timestamp: new Date().toISOString(),
    }));
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('gpaCalculatorData');
    if (saved) {
      const data = JSON.parse(saved);
      setCourses(data.courses || []);
      setGpaResult(data.gpaResult || null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <FaCalculator className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GPA Calculator</h1>
          <p className="text-lg text-gray-600">Calculate your Grade Point Average with precision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={addCourse}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="text-sm" />
                  Add Course
                </button>
                <button
                  onClick={loadSampleData}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaGraduationCap className="text-sm" />
                  Load Sample
                </button>
                <button
                  onClick={clearAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="text-sm" />
                  Clear All
                </button>
                <button
                  onClick={saveToLocalStorage}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <FaSave className="text-sm" />
                  Save
                </button>
                <button
                  onClick={loadFromLocalStorage}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FaUndo className="text-sm" />
                  Load Saved
                </button>
              </div>
            </div>

            {/* Courses List */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Courses</h2>
              
              {courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaGraduationCap className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>No courses added yet. Click "Add Course" to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                          <input
                            type="text"
                            value={course.code}
                            onChange={(e) => updateCourse(course.id, 'code', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., CS101"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                          <input
                            type="text"
                            value={course.name}
                            onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Introduction to Computer Science"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                          <select
                            value={course.credits}
                            onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {[1, 2, 3, 4, 5, 6].map(credit => (
                              <option key={credit} value={credit}>{credit}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                          <select
                            value={course.grade}
                            onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${gradeColors[course.grade]}`}
                          >
                            {Object.keys(gradePoints).map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="md:col-span-5 flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            Points: <span className="font-semibold">{gradePoints[course.grade]}</span> × {course.credits} = <span className="font-semibold text-blue-600">{gradePoints[course.grade] * course.credits}</span>
                          </div>
                          <button
                            onClick={() => removeCourse(course.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculate Button */}
            {courses.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <button
                  onClick={calculateGPA}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Calculate GPA
                </button>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* GPA Result */}
            {gpaResult && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">GPA Results</h2>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{gpaResult.gpa}</div>
                    <div className={`text-lg font-semibold ${gradeColors[gpaResult.letterGrade]}`}>
                      {gpaResult.letterGrade} - {gpaResult.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Credits:</span>
                      <span className="font-semibold">{gpaResult.totalCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Points:</span>
                      <span className="font-semibold">{gpaResult.totalPoints}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={exportToCSV}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <FaDownload className="text-sm" />
                    Export to CSV
                  </button>
                </div>
              </div>
            )}

            {/* Grade Scale */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Scale</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(gradePoints).map(([grade, points]) => (
                  <div key={grade} className="flex justify-between items-center">
                    <span className={`font-medium ${gradeColors[grade]}`}>{grade}</span>
                    <span className="text-gray-600">{points.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GPA Guidelines */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">GPA Guidelines</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">3.7 - 4.0</span>
                  <span>Dean's List</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">3.0 - 3.69</span>
                  <span>Good Standing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">2.0 - 2.99</span>
                  <span>Academic Warning</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Below 2.0</span>
                  <span>Academic Probation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 