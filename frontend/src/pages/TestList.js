import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TestList.css';

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('/api/tests');
      setTests(response.data.data);
    } catch (err) {
      setError('Failed to load tests');
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="container">
      <h1>Available Tests</h1>
      {tests.length === 0 ? (
        <div className="card">
          <p>No tests available at the moment.</p>
        </div>
      ) : (
        <div className="test-grid">
          {tests.map((test) => (
            <div key={test._id} className="test-card">
              <h3>{test.title}</h3>
              {test.description && <p>{test.description}</p>}
              <div className="test-info">
                <span>Duration: {Math.floor(test.duration / 60)} minutes</span>
                <span>Total Marks: {test.totalMarks}</span>
                <span>Questions: {test.questions.length}</span>
              </div>
              <Link to={`/test/${test._id}`} className="btn btn-primary">
                Start Test
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestList;


