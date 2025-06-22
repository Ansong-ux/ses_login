import { NextResponse } from 'next/server'
import { getAnnouncements } from '@/lib/db'

export async function GET() {
  try {
    const announcements = await getAnnouncements()
    
    return NextResponse.json({
      success: true,
      announcements: announcements,
      count: announcements.length,
      message: 'Announcements retrieved successfully'
    })
    
  } catch (error) {
    console.error('Error testing announcements:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 