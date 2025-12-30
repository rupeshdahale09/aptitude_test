import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TakeTest.css';

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchTest();
  }, [id]);

  useEffect(() => {
    if (test && startTime) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = test.duration - elapsed;

        if (remaining <= 0) {
          clearInterval(timer);
          handleAutoSubmit();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, startTime]);

  const fetchTest = async () => {
    try {
      const response = await axios.get(`/api/tests/${id}`);
      setTest(response.data.data);
      setTimeLeft(response.data.data.duration);
      setStartTime(Date.now());
    } catch (err) {
      setError('Failed to load test');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = async () => {
    if (submitting) return;
    await submitTest();
  };

  const submitTest = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const timeTaken = Math.min(elapsed, test.duration);

      const response = await axios.post(`/api/tests/${id}/submit`, {
        answers,
        timeTaken,
      });

      navigate(`/test/${id}/compare`, { state: { result: response.data.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit test');
      setSubmitting(false);
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

  if (error && !test) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="test-header">
        <h1>{test.title}</h1>
        <div className={`timer ${timeLeft < 60 ? 'timer-warning' : ''}`}>
          Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={(e) => { e.preventDefault(); submitTest(); }}>
        <div className="questions-container">
          {test.questions.map((question, index) => (
            <div key={question._id} className="question-card">
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                <span className="question-marks">{question.marks || 1} mark(s)</span>
              </div>
              <p className="question-text">{question.question}</p>
              <div className="options-container">
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={optIndex}
                      checked={answers[question._id] === optIndex}
                      onChange={() => handleAnswerChange(question._id, optIndex)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="test-actions">
          <button
            type="submit"
            className="btn btn-success"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TakeTest;


