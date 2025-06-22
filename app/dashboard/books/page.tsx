'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Download } from 'lucide-react'

const booksByLevel = [
  {
    title: 'Level 100 - First Year',
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          {
            code: 'SENG 101',
            name: 'Calculus I (+pre-Maths): Single Variable',
            credits: 4,
            link: 'http://tomlr.free.fr/Math%E9matiques/Math%20Complete/Math%20For%20Engineers/Engineering%20Mathematics%204th%20ed.%20-%20J.%20Bird.pdf',
          },
          {
            code: 'SENG 103',
            name: 'Mechanics I: Statics',
            credits: 3,
            link: 'https://openstax.org/books/university-physics-volume-1/pages/1-introduction',
          },
          {
            code: 'SENG 105',
            name: 'Engineering Graphics',
            credits: 3,
            link: 'https://soaneemrana.com/onewebmedia/ENGINEERING%20DRAWING%20BY%20N.D%20BHATT.pdf',
          },
          {
            code: 'SENG 107',
            name: 'Introduction to Engineering',
            credits: 2,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'SENG 111',
            name: 'General Physics',
            credits: 3,
            link: 'https://openstax.org/books/university-physics-volume-1/pages/1-introduction',
          },
          {
            code: 'CPEN 103',
            name: 'Computer Engineering Innovations',
            credits: 3,
            link: 'https://www.rose-hulman.edu/class/csse/csse132/1819c/CODF_v02b.pdf',
          },
          {
            code: 'UGRC 110',
            name: 'Academic Writing I',
            credits: 3,
            link: 'https://mrce.in/ebooks/Communication%20Skills%20for%20Engineering%20&%20Applied%20Science%20Students%203rd%20Ed.pdf',
          },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          {
            code: 'SENG 102',
            name: 'Calculus II: Multivariable',
            credits: 4,
            link: 'http://tomlr.free.fr/Math%E9matiques/Math%20Complete/Math%20For%20Engineers/Engineering%20Mathematics%204th%20ed.%20-%20J.%20Bird.pdf',
          },
          {
            code: 'SENG 104',
            name: 'Mechanics II: Dynamics',
            credits: 3,
            link: 'https://openstax.org/books/university-physics-volume-1/pages/1-introduction',
          },
          {
            code: 'SENG 106',
            name: 'Applied Electricity',
            credits: 3,
            link: 'https://iastate.pressbooks.pub/electriccircuits/open/download?type=pdf',
          },
          {
            code: 'SENG 108',
            name: 'Basic Electronics',
            credits: 3,
            link: 'https://openstax.org/books/university-physics-volume-2/pages/1-introduction',
          },
          {
            code: 'SENG 112',
            name: 'Engineering Computational Tools',
            credits: 3,
            link: 'https://www.python.org/doc/',
          },
          {
            code: 'CPEN 104',
            name: 'Engineering Design',
            credits: 2,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'UGRC 150',
            name: 'Critical Thinking & Practical Reasoning',
            credits: 3,
            link: 'https://openstax.org/books/introduction-philosophy/pages/1-introduction',
          },
        ],
      },
    ],
  },
  {
    title: 'Level 200 - Second Year',
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          {
            code: 'SENG 201',
            name: 'Linear Algebra',
            credits: 4,
            link: 'https://openstax.org/books/college-algebra/pages/1-introduction',
          },
          {
            code: 'SENG 207',
            name: 'Programming for Engineers',
            credits: 3,
            link: 'https://www.python.org/doc/',
          },
          {
            code: 'CPEN 201',
            name: 'C++ Programming',
            credits: 3,
            link: 'https://www.cplusplus.com/doc/tutorial/',
          },
          {
            code: 'CPEN 203',
            name: 'Digital Circuits',
            credits: 3,
            link: 'https://www.rose-hulman.edu/class/csse/csse132/1819c/CODF_v02b.pdf',
          },
          {
            code: 'CPEN 213',
            name: 'Discrete Mathematics',
            credits: 3,
            link: 'https://openstax.org/books/college-algebra/pages/1-introduction',
          },
          {
            code: 'CPEN 211',
            name: 'Database System Design',
            credits: 3,
            link: 'https://www.postgresql.org/docs/current/tutorial.html',
          },
          {
            code: 'UGRC 220-238',
            name: 'Introduction to African Studies',
            credits: 3,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          {
            code: 'SENG 202',
            name: 'Differential Equations',
            credits: 4,
            link: 'http://tomlr.free.fr/Math%E9matiques/Math%20Complete/Math%20For%20Engineers/Engineering%20Mathematics%204th%20ed.%20-%20J.%20Bird.pdf',
          },
          {
            code: 'CPEN 214',
            name: 'Digital Systems Design',
            credits: 3,
            link: 'https://www.rose-hulman.edu/class/csse/csse132/1819c/CODF_v02b.pdf',
          },
          {
            code: 'CPEN 204',
            name: 'Data Structures and Algorithms',
            credits: 3,
            link: 'https://openstax.org/books/college-algebra/pages/1-introduction',
          },
          {
            code: 'CPEN 206',
            name: 'Linear Circuits',
            credits: 3,
            link: 'https://iastate.pressbooks.pub/electriccircuits/open/download?type=pdf',
          },
          {
            code: 'CPEN 208',
            name: 'Software Engineering',
            credits: 3,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 212',
            name: 'Data Communications',
            credits: 2,
            link: 'https://openstax.org/books/university-physics-volume-2/pages/1-introduction',
          },
          {
            code: 'CBAS 210',
            name: 'Academic Writing II',
            credits: 3,
            link: 'https://mrce.in/ebooks/Communication%20Skills%20for%20Engineering%20&%20Applied%20Science%20Students%203rd%20Ed.pdf',
          },
        ],
      },
    ],
  },
  {
    title: 'Level 300 - Third Year',
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          {
            code: 'SENG 301',
            name: 'Numerical Methods',
            credits: 3,
            link: 'http://tomlr.free.fr/Math%E9matiques/Math%20Complete/Math%20For%20Engineers/Engineering%20Mathematics%204th%20ed.%20-%20J.%20Bird.pdf',
          },
          {
            code: 'CPEN 301',
            name: 'Signals and Systems',
            credits: 3,
            link: 'https://openstax.org/books/university-physics-volume-1/pages/1-introduction',
          },
          {
            code: 'CPEN 305',
            name: 'Computer Networks',
            credits: 3,
            link: 'https://openstax.org/books/university-physics-volume-2/pages/1-introduction',
          },
          {
            code: 'CPEN 307',
            name: 'Operating Systems',
            credits: 3,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 311',
            name: 'Object-Oriented Programming',
            credits: 3,
            link: 'https://www.cplusplus.com/doc/tutorial/',
          },
          {
            code: 'CPEN 313',
            name: 'Microelectronics Circuit Analysis and Design',
            credits: 3,
            link: 'https://iastate.pressbooks.pub/electriccircuits/open/download?type=pdf',
          },
          {
            code: 'CPEN 315',
            name: 'Computer Organization and Architecture',
            credits: 3,
            link: 'https://www.rose-hulman.edu/class/csse/csse132/1819c/CODF_v02b.pdf',
          },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          {
            code: 'SENG 302',
            name: 'Statistics for Engineers',
            credits: 3,
            link: 'https://openstax.org/books/introductory-statistics/pages/1-introduction',
          },
          {
            code: 'SENG 304',
            name: 'Engineering Economics',
            credits: 2,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 304',
            name: 'Digital Signal Processing',
            credits: 3,
            link: 'https://openstax.org/books/university-physics-volume-1/pages/1-introduction',
          },
          {
            code: 'CPEN 314',
            name: 'Industrial Practice',
            credits: 1,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 316',
            name: 'Artificial Intelligence and Applications',
            credits: 3,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 318',
            name: 'Software for Distributed Systems',
            credits: 3,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 322',
            name: 'Microprocessor Programming and Interfacing',
            credits: 3,
            link: 'https://www.rose-hulman.edu/class/csse/csse132/1819c/CODF_v02b.pdf',
          },
          {
            code: 'CPEN 324',
            name: 'Research Methods',
            credits: 3,
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
        ],
      },
    ],
  },
  {
    title: 'Level 400 - Fourth Year',
    semesters: [
      {
        name: 'Semester 1',
        courses: [
          {
            code: 'SENG 401',
            name: 'Law for Engineers',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 400',
            name: 'Independent Project I',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 401',
            name: 'Control Systems Analysis and Design',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/university-physics-volume-1/pages/1-introduction',
          },
          {
            code: 'CPEN 403',
            name: 'Embedded Systems',
            credits: 3,
            type: 'Core',
            link: 'https://www.rose-hulman.edu/class/csse/csse132/1819c/CODF_v02b.pdf',
          },
          {
            code: 'CPEN 419',
            name: 'Computer Vision',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 429',
            name: 'Emerging Trends in Computer Engineering',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 409',
            name: 'Computer Graphics',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 411',
            name: 'VLSI Systems Design',
            credits: 3,
            type: 'Elective',
            link: 'https://www.rose-hulman.edu/class/csse/csse132/1819c/CODF_v02b.pdf',
          },
          {
            code: 'CPEN 415',
            name: 'Distributed Computing',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 421',
            name: 'Mobile and Web Software Design and Architecture',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 423',
            name: 'Digital Forensics',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 425',
            name: 'Real-Time Systems',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 427',
            name: 'Cryptography',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
        ],
      },
      {
        name: 'Semester 2',
        courses: [
          {
            code: 'SENG 402',
            name: 'Principles of Management and Entrepreneurship',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 400',
            name: 'Independent Project II',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 406',
            name: 'Wireless Communication Systems',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/university-physics-volume-2/pages/1-introduction',
          },
          {
            code: 'CPEN 424',
            name: 'Robotics',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 426',
            name: 'Computer and Network Security',
            credits: 3,
            type: 'Core',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 444',
            name: 'Professional Development',
            credits: 2,
            type: 'Core',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 408',
            name: 'Human-Computer Interface',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 422',
            name: 'Multimedia Systems',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 432',
            name: 'Wireless Sensor Networks',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/university-physics-volume-2/pages/1-introduction',
          },
          {
            code: 'CPEN 434',
            name: 'Digital Image Processing',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
          {
            code: 'CPEN 438',
            name: 'Advanced Computer Architecture Systems and Design',
            credits: 3,
            type: 'Elective',
            link: 'https://www.rose-hulman.edu/class/csse/csse132/1819c/CODF_v02b.pdf',
          },
          {
            code: 'CPEN 442',
            name: 'Introduction to Machine Learning',
            credits: 3,
            type: 'Elective',
            link: 'https://openstax.org/books/introduction-sociology-3e/pages/1-introduction',
          },
        ],
      },
    ],
  },
]

export default function BooksPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Course Books & Materials
                </h1>
        <p className="mt-4 text-xl text-gray-600">
          Download recommended textbooks for all Computer Engineering courses.
        </p>
      </div>

      <div className="space-y-8">
        {booksByLevel.map(level => (
          <Card key={level.title}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-600">
                {level.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {level.semesters.map(semester => (
                  <div key={semester.name}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {semester.name}
                    </h3>
                    <ul className="space-y-3">
                      {semester.courses.map(course => (
                        <li
                          key={`${course.code}-${course.name}`}
                          className="flex items-center justify-between rounded-lg bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <BookOpen className="mr-4 h-6 w-6 text-blue-500" />
            <div>
                              <p className="font-semibold text-gray-800">
                                {course.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{course.code}</span>
                                <span>•</span>
                                <span>{course.credits} credits</span>
                                {'type' in course && course.type && (
                                  <>
                                    <span>•</span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                      {course.type}
                                    </span>
                                  </>
                                )}
            </div>
          </div>
        </div>
                          <a
                            href={course.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </li>
                      ))}
                    </ul>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 