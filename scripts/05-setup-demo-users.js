const bcrypt = require("bcryptjs")

async function generateHashedPasswords() {
  const password = "password123"
  const hash = await bcrypt.hash(password, 10)

  console.log("Demo User Setup SQL:")
  console.log('-- Run this SQL to set up demo users with password "password123"')
  console.log("")

  const users = [
    { email: "simpson.mozu@gmail.com", role: "student", student_id: 1 },
    { email: "elvis.tiburu@gmail.com", role: "student", student_id: 2 },
    { email: "thomas.sasu@gmail.com", role: "student", student_id: 3 },
    { email: "admin@university.edu", role: "admin", student_id: null },
  ]

  users.forEach((user) => {
    console.log(
      `INSERT INTO users (email, password_hash, role, student_id) VALUES ('${user.email}', '${hash}', '${user.role}', ${user.student_id}) ON CONFLICT (email) DO UPDATE SET password_hash = '${hash}';`,
    )
  })
}

generateHashedPasswords().catch(console.error)
