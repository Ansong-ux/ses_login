import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { pool } from '@/lib/db'
import fs from 'fs'
import path from 'path'

async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

// POST /api/fix-assignments - Run database fixes for assignments
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    
    // Read the SQL script
    const sqlPath = path.join(process.cwd(), 'scripts', 'fix-database-issues.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    const client = await pool.connect();
    const results = [];
    
    try {
      await client.query('BEGIN');
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const result = await client.query(statement);
            results.push({
              statement: statement.substring(0, 100) + '...',
              success: true,
              rowCount: result.rowCount
            });
          } catch (error: any) {
            results.push({
              statement: statement.substring(0, 100) + '...',
              success: false,
              error: error.message
            });
          }
        }
      }
      
      await client.query('COMMIT');
      
      return NextResponse.json({
        success: true,
        message: 'Database fixes applied successfully',
        results: results
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error('Database fix error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to apply database fixes' },
      { status: 500 }
    );
  }
} 