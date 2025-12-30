import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedTest]);

  const fetchTests = async () => {
    try {
      const response = await axios.get('/api/tests');
      setTests(response.data.data);
    } catch (err) {
      setError('Failed to load tests');
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const url = selectedTest
        ? `/api/leaderboard/test/${selectedTest}`
        : '/api/leaderboard';
      const response = await axios.get(url);
      setLeaderboard(response.data.data);
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading && leaderboard.length === 0) {
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
      <h1>Leaderboard</h1>

      <div className="leaderboard-filters">
        <div className="form-group" style={{ maxWidth: '300px' }}>
          <label>Filter by Test:</label>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
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

      {error && <div className="alert alert-error">{error}</div>}

      {leaderboard.length === 0 ? (
        <div className="card">
          <p>No leaderboard data available.</p>
        </div>
      ) : (
        <div className="card">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Email</th>
                {selectedTest ? (
                  <>
                    <th>Score</th>
                    <th>Time Taken</th>
                    <th>Accuracy</th>
                  </>
                ) : (
                  <>
                    <th>Total Score</th>
                    <th>Avg Time</th>
                    <th>Tests Taken</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.userId}>
                  <td className="rank-cell">
                    <span className={`rank-badge rank-${entry.rank}`}>
                      {entry.rank}
                    </span>
                  </td>
                  <td>{entry.userName}</td>
                  <td>{entry.userEmail}</td>
                  {selectedTest ? (
                    <>
                      <td>
                        {entry.score} / {entry.totalMarks || 'N/A'}
                      </td>
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
  );
};

export default Leaderboard;


