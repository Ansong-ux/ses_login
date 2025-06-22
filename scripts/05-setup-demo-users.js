const bcrypt = require('bcrypt');

async function generateHashedPasswords() {
  const password = 'password123'; // Default password for all demo accounts
  const saltRounds = 10;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Generated hashed password:', hashedPassword);
    
    // SQL to update existing users with proper hashed passwords
    const updateSQL = `
-- Update users with properly hashed passwords
UPDATE users SET password_hash = '${hashedPassword}' WHERE email IN (
  'simpson.mozu@gmail.com',
  'elvis.tiburu@gmail.com', 
  'thomas.sasu@gmail.com',
  'john.nii@university.edu',
  'mary.tiburu@university.edu',
  'samuel.akua@university.edu',
  'sarah.mensah@university.edu',
  'admin@university.edu'
);
    `;
    
    console.log('\nSQL to update passwords:');
    console.log(updateSQL);
    
    return hashedPassword;
  } catch (error) {
    console.error('Error generating hashed password:', error);
    throw error;
  }
}

// Generate hashed passwords
generateHashedPasswords().catch(console.error);
