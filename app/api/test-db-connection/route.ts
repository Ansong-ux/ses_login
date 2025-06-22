import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    const client = await pool.connect();
    console.log('Successfully connected to database');
    
    // Test basic query
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    // Test if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Existing tables:', tablesResult.rows.map(row => row.table_name));
    
    client.release();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      version: result.rows[0].version,
      tables: tablesResult.rows.map(row => row.table_name)
    });
    
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
} 