import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// POST /api/fix-users-table - Fix users table by adding missing columns
export async function POST(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Add first_name column if it doesn't exist
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'first_name') THEN
            ALTER TABLE users ADD COLUMN first_name VARCHAR(50);
          END IF;
        END $$;
      `);
      
      // Add last_name column if it doesn't exist
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_name') THEN
            ALTER TABLE users ADD COLUMN last_name VARCHAR(50);
          END IF;
        END $$;
      `);
      
      // Update existing users with default names
      await client.query(`
        UPDATE users SET 
          first_name = COALESCE(first_name, 'Admin'),
          last_name = COALESCE(last_name, 'User')
        WHERE first_name IS NULL OR last_name IS NULL;
      `);
      
      await client.query('COMMIT');
      
      return NextResponse.json({
        success: true,
        message: 'Users table fixed successfully - added first_name and last_name columns'
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
    
  } catch (error: any) {
    console.error('Fix users table error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fix users table' },
      { status: 500 }
    );
  }
} 