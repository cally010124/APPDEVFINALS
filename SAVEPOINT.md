# Project Savepoint - Student Grading System (Updated)

## Latest Features (as of this savepoint)

- **Admin Grade Management**
  - Single, centered search bar for students (case-insensitive, partial match on name, course, year, section, or ID)
  - No dropdowns for course, year, or section
  - Student info and grades only display when searching and a match is found
  - Search box is visually smaller and centered on the page
  - All previous features and structure remain

## Current Project Structure (as of savepoint)

```
SGS1/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   │   ├── PTCLOGO.PNG     # College logo
│   │   └── index.html      # Main HTML file
│   │
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   │   ├── Auth/      # Authentication components
│   │   │   │   ├── AdminLogin.js
│   │   │   │   └── StudentLogin.js
│   │   │   │
│   │   │   ├── Dashboard/ # Dashboard components
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── StudentDashboard.js
│   │   │   │   ├── AdminAccounts.js
│   │   │   │   ├── StudentAccounts.js
│   │   │   │   └── GradeManagement.js
│   │   │   │
│   │   │   └── Home.js    # Home page component
│   │   │
│   │   ├── App.js         # Main App component
│   │   ├── routes.js      # Route definitions
│   │   └── index.js       # Entry point
│   │
│   ├── package.json       # Frontend dependencies
│   └── README.md         # Frontend documentation
│
├── backend/               # Node.js backend application
│   ├── config/           # Configuration files
│   │   └── db.js        # Database configuration
│   │
│   ├── controllers/      # Route controllers
│   │   ├── adminController.js
│   │   ├── studentController.js
│   │   └── gradeController.js
│   │
│   ├── middleware/       # Custom middleware
│   │   └── auth.js      # Authentication middleware
│   │
│   ├── models/          # Database models
│   │   ├── Admin.js
│   │   ├── Student.js
│   │   └── Grade.js
│   │
│   ├── routes/          # API routes
│   │   ├── adminRoutes.js
│   │   ├── studentRoutes.js
│   │   └── gradeRoutes.js
│   │
│   ├── utils/           # Utility functions
│   │   └── helpers.js   # Helper functions
│   │
│   ├── app.js          # Express application setup
│   ├── server.js       # Server entry point
│   ├── package.json    # Backend dependencies
│   └── README.md      # Backend documentation
│
└── database/           # Database files
    ├── schema.sql     # Database schema
    └── seed.sql      # Initial data
```

## Database Schema

```sql
-- Admins table
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    course VARCHAR(50) NOT NULL,
    year VARCHAR(10) NOT NULL,
    section VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grades table
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(10) NOT NULL,
    subject_code VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    units INT NOT NULL,
    grade DECIMAL(4,2) NOT NULL,
    remarks VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);
```

## Key Features

1. **Frontend**:
   - React-based user interface
   - Bootstrap for styling
   - React Router for navigation
   - PDF generation with jsPDF
   - Responsive design
   - Admin grade management with a single, centered, case-insensitive search bar

2. **Backend**:
   - Express.js server
   - MySQL database
   - JWT authentication
   - RESTful API endpoints
   - Password hashing with bcrypt

3. **Database**:
   - MySQL database
   - Normalized tables
   - Foreign key relationships
   - Indexed fields

## Dependencies

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "bootstrap": "^5.x",
    "jspdf": "^2.x",
    "jspdf-autotable": "^3.x"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.x",
    "mysql2": "^3.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "cors": "^2.x",
    "dotenv": "^16.x"
  }
}
```

## Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=student_grading_system
JWT_SECRET=your_jwt_secret
PORT=5000
```

## How to Revert

If you need to revert to this savepoint:

1. Delete any new files or directories that were added after this savepoint
2. Restore any modified files to their state at this savepoint
3. Run `npm install` in both frontend and backend directories to ensure dependencies match
4. Restore the database schema if it was modified

## Notes
- This savepoint represents a working state of the Student Grading System as of this update
- All components are properly structured and follow best practices
- The system includes both admin and student interfaces
- Authentication and authorization are implemented
- Database schema is normalized and includes all necessary tables 