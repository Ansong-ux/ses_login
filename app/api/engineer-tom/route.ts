import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats, getOutstandingFees, getStudents, getCourses } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const lowerQuestion = question.toLowerCase();
    let response = '';
    let data = null;

    // Get real-time data for specific questions
    if (lowerQuestion.includes('outstanding') && lowerQuestion.includes('fee')) {
      try {
        const stats = await getDashboardStats();
        const outstanding = await getOutstandingFees();
        data = {
          totalOutstanding: stats.totalOutstanding,
          studentsWithFees: outstanding.length,
          topOutstanding: outstanding.slice(0, 3)
        };
        response = `Based on current data:\n\n💰 **Total Outstanding Fees:** $${stats.totalOutstanding?.toLocaleString() || 0}\n👥 **Students with Outstanding Fees:** ${outstanding.length}\n\nTop students with outstanding fees:\n${outstanding.slice(0, 3).map(s => `• ${s.full_name}: $${s.outstanding}`).join('\n')}`;
      } catch (error) {
        response = "I can help you check outstanding fees. Go to the Fees section in the sidebar to view detailed information about student payments and outstanding balances.";
      }
    } else if (lowerQuestion.includes('student') && lowerQuestion.includes('count')) {
      try {
        const stats = await getDashboardStats();
        data = { studentCount: stats.students };
        response = `Current student enrollment: **${stats.students} students**\n\nYou can view all students in the Students section of the dashboard.`;
      } catch (error) {
        response = "I can help you check student enrollment. Navigate to the Students section to view the complete student registry.";
      }
    } else if (lowerQuestion.includes('course') && lowerQuestion.includes('count')) {
      try {
        const stats = await getDashboardStats();
        data = { courseCount: stats.courses };
        response = `Available courses: **${stats.courses} courses**\n\nYou can view all courses in the Courses section of the dashboard.`;
      } catch (error) {
        response = "I can help you check available courses. Navigate to the Courses section to view the complete course catalog.";
      }
    } else {
      // Default response for other questions
      response = `I understand you're asking about: "${question}"\n\nI can help you with various aspects of the Computer Engineering Department Management System including:\n\n• Student and course management\n• Fee tracking and payments\n• Grade administration\n• Report generation\n• System navigation\n\nCould you please rephrase your question or ask about a specific feature? I'm here to help make your administrative tasks easier!`;
    }

    return NextResponse.json({
      success: true,
      response,
      data,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Engineer Tom API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      response: "I'm having trouble accessing the system data right now. Please try again later or contact the administrator."
    }, { status: 500 });
  }
} 