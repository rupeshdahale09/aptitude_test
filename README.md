# MERN Stack Aptitude Test Platform

A complete full-stack aptitude test platform built with MongoDB, Express, React, and Node.js.

## Features

- **User Authentication**: JWT-based authentication with user and admin roles
- **Timed Tests**: Tests with countdown timer and auto-submit functionality
- **Test Attempts**: Track all test attempts with scores, time taken, and accuracy
- **Comparative Analysis**: Compare current attempt with previous attempt
- **Leaderboard**: Rank users by score and time taken using MongoDB aggregation
- **User Dashboard**: View performance trends with interactive charts
- **Admin Panel**: Manage users, view all attempts, and filter data

## Tech Stack

- **Frontend**: React 18, React Router, Chart.js, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Chart.js with react-chartjs-2

## Project Structure

```
apti-intern/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── testController.js
│   │   ├── attemptController.js
│   │   ├── leaderboardController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Test.js
│   │   └── TestAttempt.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tests.js
│   │   ├── attempts.js
│   │   ├── leaderboard.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aptitude-test
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

4. Start the backend server:
```bash
npm start
# or for development with nodemon
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Seeding Test Data

To populate the database with 3 aptitude tests (each with 50 questions), run:

```bash
cd backend
npm run seed
```

Or directly:
```bash
node scripts/seedTests.js
```

This will create:
1. **Quantitative Aptitude Test** - 50 math questions (60 minutes)
2. **Logical Reasoning Test** - 50 logic questions (60 minutes)
3. **Verbal Ability Test** - 50 English questions (60 minutes)

### Creating an Admin User

To create an admin user, you can use the provided script:

```bash
cd backend
node scripts/createAdmin.js [email] [password] [name]
```

Example:
```bash
node scripts/createAdmin.js admin@example.com admin123 "Admin User"
```

Or you can register a user normally and then manually update the role in MongoDB to "admin".

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Tests
- `GET /api/tests` - Get all tests (Protected)
- `GET /api/tests/:id` - Get single test (Protected)
- `POST /api/tests` - Create test (Admin only)
- `POST /api/tests/:id/submit` - Submit test attempt (Protected)
- `PUT /api/tests/:id` - Update test (Admin only)
- `DELETE /api/tests/:id` - Delete test (Admin only)

### Attempts
- `GET /api/attempts` - Get user's attempts (Protected)
- `GET /api/attempts/test/:testId` - Get attempts for a test (Protected)
- `GET /api/attempts/test/:testId/compare` - Get comparative analysis (Protected)
- `GET /api/attempts/dashboard/stats` - Get dashboard statistics (Protected)
- `GET /api/attempts/:id` - Get single attempt (Protected)

### Leaderboard
- `GET /api/leaderboard` - Get overall leaderboard (Protected)
- `GET /api/leaderboard/test/:testId` - Get test-specific leaderboard (Protected)

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/attempts` - Get all attempts with filters (Admin only)
- `GET /api/admin/stats` - Get admin statistics (Admin only)
- `GET /api/admin/leaderboard` - Get leaderboard (Admin only)

## Database Models

### User
- name, email, password (hashed), role (user/admin), createdAt

### Test
- title, description, duration (seconds), totalMarks, questions[], createdBy, createdAt

### Question (embedded in Test)
- question, options[], correctAnswer (index), marks

### TestAttempt
- userId, testId, answers (Map), score, totalMarks, timeTaken, accuracy, submittedAt, createdAt

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected routes with middleware
- Backend validation for all submissions
- Timer validation on backend

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Take Tests**: Browse available tests and start taking them
3. **View Results**: After submission, see your score and comparison with previous attempts
4. **Dashboard**: View your performance trends and statistics
5. **Leaderboard**: Check your ranking among all users
6. **Admin Panel**: (Admin only) Manage users, view all attempts, and filter data

## Usage Guide

### Creating a Test (Admin)

To create a test, you need to be logged in as an admin. Use the API endpoint:

```bash
POST /api/tests
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "title": "Sample Aptitude Test",
  "description": "Test your skills",
  "duration": 1800,
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": 1,
      "marks": 1
    }
  ]
}
```

## License

This project is open source and available under the MIT License.

