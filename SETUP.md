# Quick Setup Guide

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment

### Backend
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aptitude-test
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

### Frontend
Create `frontend/.env` (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 3: Start MongoDB

Make sure MongoDB is running on your system.

## Step 4: Seed Test Data

Run the seed script to create 3 aptitude tests with 50 questions each:

```bash
cd backend
npm run seed
```

This creates:
- **Quantitative Aptitude Test** (50 math questions, 60 minutes)
- **Logical Reasoning Test** (50 logic questions, 60 minutes)
- **Verbal Ability Test** (50 English questions, 60 minutes)

## Step 5: Create Admin User (Optional)

```bash
cd backend
node scripts/createAdmin.js admin@example.com admin123 "Admin User"
```

## Step 6: Start Servers

### Backend (Terminal 1)
```bash
cd backend
npm start
# or for development
npm run dev
```

### Frontend (Terminal 2)
```bash
cd frontend
npm start
```

## Step 7: Access the Application

1. Open browser: `http://localhost:3000`
2. Register a new account
3. Click "View Available Tests" on the dashboard
4. You'll see 3 aptitude tests
5. Click "Start Test" on any test
6. Complete the test (timer will auto-submit when time runs out)
7. View results with comparative analysis
8. Retake tests as many times as you want!

## Features

✅ **3 Aptitude Tests** - Each with 50 unique questions
✅ **Start Button** - Each test has a "Start Test" button
✅ **Multiple Attempts** - Users can retake tests unlimited times
✅ **Comparative Analysis** - After each submission, compare with previous attempt:
   - Score (marks) comparison
   - Time taken comparison
   - Accuracy comparison
   - Overall improvement/decline indicator

## Troubleshooting

- **MongoDB Connection Error**: Make sure MongoDB is running
- **Tests Not Showing**: Run `npm run seed` in the backend directory
- **Port Already in Use**: Change PORT in backend/.env

