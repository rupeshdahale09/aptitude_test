import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [tests, setTests] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    testId: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchTests();
  }, []);

  useEffect(() => {
    if (activeTab === 'attempts') {
      fetchAttempts();
    } else if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [activeTab, filters]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data.data);
    } catch (err) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const fetchTests = async () => {
    try {
      const response = await axios.get('/api/tests');
      setTests(response.data.data);
    } catch (err) {
      setError('Failed to load tests');
    }
  };

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.testId) params.append('testId', filters.testId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(
        `/api/admin/attempts?${params.toString()}`
      );
      setAttempts(response.data.data);
    } catch (err) {
      setError('Failed to load attempts');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.testId) params.append('testId', filters.testId);

      const response = await axios.get(
        `/api/admin/leaderboard?${params.toString()}`
      );
      setLeaderboard(response.data.data);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading && !stats) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Admin Panel</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-tabs">
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'attempts' ? 'active' : ''}
          onClick={() => setActiveTab('attempts')}
        >
          Attempts
        </button>
        <button
          className={activeTab === 'leaderboard' ? 'active' : ''}
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="admin-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>
            <div className="stat-card">
              <h3>Total Tests</h3>
              <div className="stat-value">{stats.totalTests}</div>
            </div>
            <div className="stat-card">
              <h3>Total Attempts</h3>
              <div className="stat-value">{stats.totalAttempts}</div>
            </div>
            <div className="stat-card">
              <h3>Admin Users</h3>
              <div className="stat-value">{stats.adminUsers}</div>
            </div>
          </div>

          <div className="recent-attempts-section">
            <h2>Recent Attempts</h2>
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Test</th>
                    <th>Score</th>
                    <th>Time</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAttempts.map((attempt) => (
                    <tr key={attempt._id}>
                      <td>{attempt.userId?.name || 'Unknown'}</td>
                      <td>{attempt.testId?.title || 'Unknown'}</td>
                      <td>
                        {attempt.score} / {attempt.totalMarks}
                      </td>
                      <td>{formatTime(attempt.timeTaken)}</td>
                      <td>
                        {new Date(attempt.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'attempts' && (
        <div>
          <div className="filters-card">
            <h3>Filters</h3>
            <div className="filters-grid">
              <div className="form-group">
                <label>User</label>
                <select
                  name="userId"
                  value={filters.userId}
                  onChange={handleFilterChange}
                >
                  <option value="">All Users</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Test</label>
                <select
                  name="testId"
                  value={filters.testId}
                  onChange={handleFilterChange}
                >
                  <option value="">All Tests</option>
                  {tests.map((test) => (
                    <option key={test._id} value={test._id}>
                      {test.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Test</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Time</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>
                        No attempts found
                      </td>
                    </tr>
                  ) : (
                    attempts.map((attempt) => (
                      <tr key={attempt._id}>
                        <td>{attempt.userId?.name || 'Unknown'}</td>
                        <td>{attempt.testId?.title || 'Unknown'}</td>
                        <td>
                          {attempt.score} / {attempt.totalMarks}
                        </td>
                        <td>{attempt.accuracy.toFixed(2)}%</td>
                        <td>{formatTime(attempt.timeTaken)}</td>
                        <td>
                          {new Date(attempt.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div>
          <div className="filters-card">
            <h3>Filters</h3>
            <div className="form-group" style={{ maxWidth: '300px' }}>
              <label>Test</label>
              <select
                name="testId"
                value={filters.testId}
                onChange={handleFilterChange}
              >
                <option value="">All Tests (Overall)</option>
                {tests.map((test) => (
                  <option key={test._id} value={test._id}>
                    {test.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Email</th>
                    {filters.testId ? (
                      <>
                        <th>Score</th>
                        <th>Time</th>
                        <th>Accuracy</th>
                      </>
                    ) : (
                      <>
                        <th>Total Score</th>
                        <th>Avg Time</th>
                        <th>Tests</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.userId}>
                      <td>{entry.rank}</td>
                      <td>{entry.userName}</td>
                      <td>{entry.userEmail}</td>
                      {filters.testId ? (
                        <>
                          <td>{entry.score}</td>
                          <td>{formatTime(entry.timeTaken)}</td>
                          <td>{entry.accuracy?.toFixed(2) || 'N/A'}%</td>
                        </>
                      ) : (
                        <>
                          <td>{entry.totalScore}</td>
                          <td>{formatTime(entry.avgTime)}</td>
                          <td>{entry.testCount}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;


