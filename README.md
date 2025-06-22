# Computer Engineering Department Management System

A comprehensive school management system designed specifically for Computer Engineering departments, with advanced features for academic management, student tracking, and educational support.

## 🎓 Features Overview

### Core Academic Management
- **Student Management** - Complete student profiles, enrollment tracking, and academic history
- **Course Management** - Course catalog, enrollment system, and curriculum management
- **Faculty Management** - Lecturer profiles, department assignments, and teaching schedules
- **Grade Management** - Comprehensive grading system with assignments, exams, and GPA calculation
- **Fee Management** - Payment tracking, outstanding fees monitoring, and financial reporting

### 🆕 **NEW: Advanced School Features**

#### 1. **Attendance Management System**
- **Class Schedules** - Complete timetable management with room assignments
- **Daily Attendance Tracking** - Mark present, absent, late, or excused with timestamps
- **Attendance Reports** - Detailed analytics and attendance percentage calculations
- **Attendance Alerts** - Automated notifications for low attendance or consecutive absences
- **Real-time Monitoring** - Live attendance dashboard with quick stats

#### 2. **Communication System**
- **Announcements** - System-wide announcements with priority levels and target audiences
- **Internal Messaging** - Secure messaging between staff, students, and faculty
- **Notifications** - Real-time notifications for grades, attendance, fees, and events
- **Calendar Events** - Academic calendar with events, holidays, and meetings
- **File Attachments** - Support for document sharing in messages

#### 3. **Parent Portal System**
- **Parent Accounts** - Secure parent access to student information
- **Student-Parent Relationships** - Manage guardians, emergency contacts, and permissions
- **Parent Notifications** - Automated alerts for grades, attendance, and fees
- **Communication Log** - Track all parent-school communications
- **Meeting Requests** - Schedule parent-teacher conferences and meetings
- **Access Control** - Granular permissions for viewing grades, attendance, and fees

#### 4. **Enhanced Academic Features**
- **Academic Terms** - Semester management with start/end dates
- **Assignment Management** - Create and track assignments with weights and due dates
- **Grade Calculation** - Automated GPA calculation and letter grade assignment
- **Performance Analytics** - Student progress tracking and performance reports

### AI-Powered Educational Support
- **Engineer Tom AI Assistant** - Advanced AI tutor with comprehensive programming support
  - **Multi-language Support**: Python, Java, C++, TypeScript, Go, JavaScript, React
  - **Voice Input/Output**: Speak questions and hear AI responses
  - **Detailed Explanations**: Step-by-step solutions with code examples
  - **Best Practices**: Industry standards and modern development patterns
  - **Real-time Assistance**: Instant help for programming and technical questions

### Student Support Tools
- **GPA Calculator** - Automated grade point calculation and academic planning
- **Books & Resources** - Educational material access with Google search integration
- **Growth & Motivation** - Student development tracking and motivational content
- **Academic Planning** - Course registration eligibility and academic advising

### Administrative Features
- **Role-based Access Control** - Admin, Lecturer, Student, TA, and Parent roles
- **Activity Logging** - Complete audit trail for system actions
- **User Management** - Secure authentication and user profile management
- **Reporting & Analytics** - Comprehensive reporting and data export capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or pnpm

### Quick Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd COMPUTERENG
   npm install
   ```

2. **Environment Setup**
   ```bash
   node scripts/setup-environment.js
   ```
   This creates a `.env` file with default configuration. Update `DATABASE_URL` with your database credentials.

3. **Database Setup**
   ```bash
   # Run database scripts in order:
   psql -U your_username -d your_database -f scripts/01-create-database.sql
   psql -U your_username -d your_database -f scripts/02-create-tables.sql
   psql -U your_username -d your_database -f scripts/03-insert-sample-data.sql
   psql -U your_username -d your_database -f scripts/10-create-fee-structure.sql
   
   # Generate password hashes for demo users
   node scripts/05-setup-demo-users.js
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:3001`

## 🔧 Troubleshooting Common Errors

### Database Connection Issues

**Error**: `DATABASE_URL is not defined`
**Solution**: 
- Ensure `.env` file exists with valid `DATABASE_URL`
- Format: `postgresql://username:password@localhost:5432/ce_department_db`
- Run `node scripts/setup-environment.js` to create `.env`

**Error**: `Connection refused` or `ECONNREFUSED`
**Solution**:
- Verify PostgreSQL is running
- Check database credentials in `DATABASE_URL`
- Ensure database `ce_department_db` exists

### Authentication Issues

**Error**: `Invalid credentials`
**Solution**:
1. Run database setup scripts in correct order
2. Execute `node scripts/05-setup-demo-users.js` to hash passwords
3. Verify user exists in database

**Error**: `JWT_SECRET is not defined`
**Solution**:
- Add `JWT_SECRET=your-secret-key` to `.env` file
- Run setup script to generate secrets

### TypeScript/Compilation Errors

**Error**: TypeScript compilation errors
**Solution**:
- Project is configured to ignore build errors during development
- For production, fix type issues or remove `ignoreBuildErrors` from `next.config.mjs`
- Run `npm run build` to see all type errors

**Error**: Module resolution errors
**Solution**:
- Ensure all dependencies are installed: `npm install`
- Check `tsconfig.json` paths configuration
- Verify import statements use correct paths

### PowerShell Execution Policy Issues

**Error**: `Execution policy` restrictions
**Solution**:
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Or use cmd instead:
cmd /c "npm run dev"
```

### Port Already in Use

**Error**: `Port 3001 is already in use`
**Solution**:
- Kill process using port 3001: `npx kill-port 3001`
- Or change port in `package.json`: `"dev": "next dev --port 3002"`

### Missing Dependencies

**Error**: `Cannot find module`
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Schema Issues

**Error**: `relation does not exist`
**Solution**:
- Run all SQL scripts in correct order
- Check database connection and permissions
- Verify table names match exactly

## 📊 Demo Accounts

After setup, use these demo accounts:

### Students
- `simpson.mozu@gmail.com` | `password123`
- `elvis.tiburu@gmail.com` | `password123`
- `thomas.sasu@gmail.com` | `password123`

### Lecturers
- `john.nii@university.edu` | `password123`
- `mary.tiburu@university.edu` | `password123`

### Admin
- `admin@university.edu` | `password123`

## 📈 System Capabilities

### Scalability
- **Modular Architecture** - Easy to extend and customize
- **Database Optimization** - Indexed queries and efficient data structures
- **Role-based Access** - Secure multi-user environment
- **API-first Design** - Ready for mobile app integration

### Security
- **JWT Authentication** - Secure user sessions
- **Role-based Permissions** - Granular access control
- **Data Encryption** - Secure storage of sensitive information
- **Audit Logging** - Complete activity tracking

### Performance
- **Optimized Queries** - Efficient database operations
- **Caching Strategy** - Reduced load times
- **Responsive Design** - Works on all devices
- **Real-time Updates** - Live data synchronization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For additional support:
- Open an issue in the repository
- Check the troubleshooting section above
- Review the database schema documentation
- Verify all prerequisites are met 