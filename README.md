# Computer Engineering Department Management System

A comprehensive management system for the Computer Engineering Department built with Next.js 14 and PostgreSQL.

## Features

- **Student Management**: Track student personal information and enrollment
- **Fee Management**: Monitor student fee payments and outstanding balances
- **Course Management**: Manage courses and enrollments
- **Lecturer Management**: Assign lecturers to courses and TAs
- **Authentication**: Secure login and registration system
- **Dashboard**: Overview of all system statistics

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Neon
- **Authentication**: JWT with bcrypt
- **Styling**: Tailwind CSS with shadcn/ui components
- **TypeScript**: Full type safety

## Database Schema

The system includes the following tables:
- `students`: Student personal information
- `fees`: Fee payment tracking
- `courses`: Course information
- `enrollments`: Student-course relationships
- `lecturers`: Lecturer information
- `lecturer_courses`: Lecturer-course assignments
- `lecturer_ta`: TA assignments
- `users`: Authentication data

## Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd ce-department-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file:
   \`\`\`
   DATABASE_URL=your_neon_database_url
   JWT_SECRET=your_jwt_secret_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3001
   \`\`\`

4. **Set up the database**
   Run the SQL scripts in order:
   - `scripts/01-create-database.sql`
   - `scripts/02-create-tables.sql`
   - `scripts/03-insert-sample-data.sql`
   - `scripts/04-create-functions.sql`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   Open [http://localhost:3001](http://localhost:3001)

## Demo Credentials

- Email: simpson.mozu@gmail.com
- Password: password123

## API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

## Database Functions

- `get_outstanding_fees()`: Returns JSON array of students with outstanding fees
- `get_student_enrollments(student_id)`: Returns student's course enrollments

## Project Structure

\`\`\`
├── app/
│   ├── api/auth/          # Authentication API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── globals.css       # Global styles
├── lib/
│   ├── db.ts             # Database utilities
│   └── auth.ts           # Authentication utilities
├── scripts/              # Database setup scripts
└── components/ui/        # Reusable UI components
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes as part of the Computer Engineering Department coursework.
