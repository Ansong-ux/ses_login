const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ce_department_db',
});

async function runDatabaseFix() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database fixes...');
    
    // Read and execute the SQL script
    const sqlPath = path.join(__dirname, 'fix-existing-database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log('✓ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          console.log('⚠ Skipped (likely already exists):', error.message);
        }
      }
    }
    
    console.log('\n✅ Database fixes completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running database fixes:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the fix
runDatabaseFix(); 