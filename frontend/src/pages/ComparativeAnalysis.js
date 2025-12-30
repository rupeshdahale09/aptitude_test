import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ComparativeAnalysis.css';

const ComparativeAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComparison();
  }, [id]);

  const fetchComparison = async () => {
    try {
      const response = await axios.get(`/api/attempts/test/${id}/compare`);
      setComparison(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  const getChangeColor = (change) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
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
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const result = location.state?.result;

  return (
    <div className="container">
      <h1>Test Results</h1>

      {result && (
        <div className="result-summary">
          <div className="result-card">
            <h3>Your Score</h3>
            <div className="score-display">
              {result.score} / {result.totalMarks}
            </div>
            <div className="result-details">
              <p>Accuracy: {result.accuracy.toFixed(2)}%</p>
              <p>Time Taken: {formatTime(result.timeTaken)}</p>
            </div>
          </div>
        </div>
      )}

      {comparison && comparison.hasPrevious ? (
        <div className="comparison-container">
          <h2>Comparison with Previous Attempt</h2>
          <div className="comparison-grid">
            <div className="comparison-card">
              <h3>Latest Attempt</h3>
              <div className="metric">
                <span className="metric-label">Score:</span>
                <span className="metric-value">{comparison.latest.score} / {comparison.latest.totalMarks}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Time:</span>
                <span className="metric-value">{formatTime(comparison.latest.timeTaken)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Accuracy:</span>
                <span className="metric-value">{comparison.latest.accuracy.toFixed(2)}%</span>
              </div>
            </div>

            <div className="comparison-card">
              <h3>Previous Attempt</h3>
              <div className="metric">
                <span className="metric-label">Score:</span>
                <span className="metric-value">{comparison.previous.score} / {comparison.previous.totalMarks}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Time:</span>
                <span className="metric-value">{formatTime(comparison.previous.timeTaken)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Accuracy:</span>
                <span className="metric-value">{comparison.previous.accuracy.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          <div className="changes-section">
            <h3>Changes</h3>
            <div className="changes-grid">
              <div className={`change-item ${getChangeColor(comparison.scoreChange)}`}>
                <span className="change-label">Score:</span>
                <span className="change-value">
                  {comparison.scoreChange > 0 ? '+' : ''}
                  {comparison.scoreChange} ({comparison.scoreChangePercent > 0 ? '+' : ''}
                  {comparison.scoreChangePercent.toFixed(1)}%)
                </span>
              </div>
              <div className={`change-item ${getChangeColor(-comparison.timeChange)}`}>
                <span className="change-label">Time:</span>
                <span className="change-value">
                  {comparison.timeChange > 0 ? '+' : ''}
                  {formatTime(Math.abs(comparison.timeChange))} ({comparison.timeChangePercent > 0 ? '+' : ''}
                  {comparison.timeChangePercent.toFixed(1)}%)
                </span>
              </div>
              <div className={`change-item ${getChangeColor(comparison.accuracyChange)}`}>
                <span className="change-label">Accuracy:</span>
                <span className="change-value">
                  {comparison.accuracyChange > 0 ? '+' : ''}
                  {comparison.accuracyChange.toFixed(2)}% ({comparison.accuracyChangePercent > 0 ? '+' : ''}
                  {comparison.accuracyChangePercent.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className={`improvement-badge ${comparison.improvement}`}>
              <strong>Overall: {comparison.improvement.toUpperCase()}</strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-comparison">
          <p>This is your first attempt at this test. Take it again to see comparison!</p>
        </div>
      )}

      <div className="action-buttons">
        <button onClick={() => navigate(`/test/${id}`)} className="btn btn-success">
          Retake This Test
        </button>
        <button onClick={() => navigate('/tests')} className="btn btn-primary">
          Take Another Test
        </button>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ComparativeAnalysis;


