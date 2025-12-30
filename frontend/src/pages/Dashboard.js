import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, attemptsResponse] = await Promise.all([
        axios.get('/api/attempts/dashboard/stats'),
        axios.get('/api/attempts'),
      ]);
      setStats(statsResponse.data.data);
      setAttempts(attemptsResponse.data.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  // Prepare chart data
  const scoreChartData = {
    labels: stats.trends.score.map((_, index) => `Attempt ${index + 1}`),
    datasets: [
      {
        label: 'Score',
        data: stats.trends.score.map((s) => s.score),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const timeChartData = {
    labels: stats.trends.time.map((_, index) => `Attempt ${index + 1}`),
    datasets: [
      {
        label: 'Time Taken (seconds)',
        data: stats.trends.time.map((t) => t.timeTaken),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const accuracyChartData = {
    labels: stats.trends.accuracy.map((_, index) => `Attempt ${index + 1}`),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: stats.trends.accuracy.map((a) => a.accuracy),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Trends',
      },
    },
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Attempts</h3>
          <div className="stat-value">{stats.summary.totalAttempts}</div>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <div className="stat-value">{stats.summary.avgScore.toFixed(1)}</div>
        </div>
        <div className="stat-card">
          <h3>Average Accuracy</h3>
          <div className="stat-value">{stats.summary.avgAccuracy.toFixed(1)}%</div>
        </div>
        <div className="stat-card">
          <h3>Best Score</h3>
          <div className="stat-value">{stats.summary.bestScore}</div>
        </div>
      </div>

      {/* Charts */}
      {stats.trends.score.length > 0 && (
        <div className="charts-container">
          <div className="chart-card">
            <Line data={scoreChartData} options={chartOptions} />
          </div>
          <div className="chart-card">
            <Line data={timeChartData} options={chartOptions} />
          </div>
          <div className="chart-card">
            <Line data={accuracyChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recent Attempts */}
      <div className="recent-attempts">
        <h2>Recent Attempts</h2>
        {attempts.length === 0 ? (
          <div className="card">
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Ready to Start?</h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              You haven't taken any tests yet. Click below to see available aptitude tests and start your journey!
            </p>
            <Link to="/tests" className="btn btn-primary" style={{ display: 'inline-block' }}>
              View Available Tests
            </Link>
          </div>
        ) : (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Time Taken</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 10).map((attempt) => (
                  <tr key={attempt._id}>
                    <td>{attempt.testId?.title || 'Unknown'}</td>
                    <td>
                      {attempt.score} / {attempt.totalMarks}
                    </td>
                    <td>{attempt.accuracy.toFixed(2)}%</td>
                    <td>{formatTime(attempt.timeTaken)}</td>
                    <td>{new Date(attempt.submittedAt).toLocaleDateString()}</td>
                    <td>
                      <Link
                        to={`/test/${attempt.testId?._id}/compare`}
                        className="btn btn-sm btn-primary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attempts.length > 10 && (
              <p className="text-center" style={{ marginTop: '15px' }}>
                Showing 10 of {attempts.length} attempts
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

