const fs = require('fs');
const path = require('path');

// Environment variables template
const envTemplate = `# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ce_department_db

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001

# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here

# OAuth Providers (Optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

FACEBOOK_ID=your-facebook-client-id
FACEBOOK_SECRET=your-facebook-client-secret

LINKEDIN_ID=your-linkedin-client-id
LINKEDIN_SECRET=your-linkedin-client-secret
`;

// Generate a random secret key
function generateSecret(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create .env file if it doesn't exist
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  const envContent = envTemplate
    .replace('your-secret-key-here', generateSecret())
    .replace('your-jwt-secret-key-here', generateSecret());
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration');
  console.log('📝 Please update the DATABASE_URL with your actual database credentials');
} else {
  console.log('⚠️  .env file already exists');
}

console.log('\n🔧 Setup Instructions:');
console.log('1. Update DATABASE_URL in .env with your database credentials');
console.log('2. Run the database setup scripts:');
console.log('   - scripts/01-create-database.sql');
console.log('   - scripts/02-create-tables.sql');
console.log('   - scripts/03-insert-sample-data.sql');
console.log('   - scripts/10-create-fee-structure.sql');
console.log('3. Run: node scripts/05-setup-demo-users.js to generate password hashes');
console.log('4. Start the development server: npm run dev'); 