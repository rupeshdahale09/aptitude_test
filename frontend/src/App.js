import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import API from './api';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TestList from './pages/TestList';
import TakeTest from './pages/TakeTest';
import Leaderboard from './pages/Leaderboard';
import AdminPanel from './pages/AdminPanel';
import ComparativeAnalysis from './pages/ComparativeAnalysis';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/tests"
              element={
                <PrivateRoute>
                  <TestList />
                </PrivateRoute>
              }
            />
            <Route
              path="/test/:id"
              element={
                <PrivateRoute>
                  <TakeTest />
                </PrivateRoute>
              }
            />
            <Route
              path="/test/:id/compare"
              element={
                <PrivateRoute>
                  <ComparativeAnalysis />
                </PrivateRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


