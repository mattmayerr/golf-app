import React, { useState, useEffect } from 'react';
import api from '../api';

const initialScores = Array(18).fill('');
const initialPars = Array(18).fill(4); // Default par 4 for each hole

const ScoreEntryForm = ({ onAddRound, onShowCourseManager, courses, setCourses }) => {
  const [scores, setScores] = useState(initialScores);
  const [pars, setPars] = useState(initialPars);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [courseName, setCourseName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // When courses prop changes, update courseName if needed
    if (courses.length && !courses.find(c => c.name === courseName)) {
      setCourseName('');
    }
  }, [courses]);

  const handleScoreChange = (idx, value) => {
    const newScores = [...scores];
    newScores[idx] = value;
    setScores(newScores);
  };

  const handleParChange = (idx, value) => {
    const newPars = [...pars];
    newPars[idx] = value;
    setPars(newPars);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!courseName.trim()) {
      setError('Please select a course.');
      return;
    }
    
    if (scores.some(s => s === '')) {
      setError('Please fill in all 18 hole scores.');
      return;
    }
    if (pars.some(p => p === '' || isNaN(Number(p)))) {
      setError('Please fill in all 18 hole pars.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const roundData = {
        date,
        courseName: courseName.trim(),
        scores: scores.map(Number),
        pars: pars.map(Number)
      };

      const response = await api.post('/api/rounds', roundData);

      onAddRound(response.data);
      
      // Reset form
      setScores(initialScores);
      setPars(initialPars);
      setCourseName('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save round. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCourseAdded = (newCourse) => {
    setCourses(prev => [...prev, newCourse]);
    setCourseName(newCourse.name);
  };

  // Calculate total par and over/under par
  const totalScore = scores.every(s => s !== '') ? scores.reduce((a, b) => a + Number(b), 0) : '';
  const totalPar = pars.reduce((a, b) => a + Number(b), 0);
  const overUnder = totalScore !== '' ? totalScore - totalPar : '';

  return (
    <form className="score-entry-form" onSubmit={handleSubmit}>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'white' }}>Add New Round</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
            Date
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
            Course
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#333',
                background: 'white'
              }}
            >
              <option value="">Select a course...</option>
              {courses.map(course => (
                <option key={course._id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onShowCourseManager && onShowCourseManager(handleCourseAdded)}
              style={{
                padding: '0.75rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}
              title="Add new course"
            >
              ➕
            </button>
          </div>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
          <strong style={{ color: '#000' }}>Hole Scores &amp; Pars:</strong>
        </label>
        <div className="scores-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
          {scores.map((score, idx) => (
            <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8f9fa', borderRadius: '8px', padding: '0.5rem', maxWidth: '110px', width: '100%', margin: '0 auto' }}>
              <div style={{ fontSize: '10px', color: '#666', marginBottom: '0.25rem' }}>Hole {idx + 1}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '100%' }}>
                <select
                  value={score}
                  onChange={e => handleScoreChange(idx, e.target.value)}
                  required
                  style={{
                    width: '48%',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#333',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '0.15rem',
                    cursor: 'pointer',
                    minWidth: 0
                  }}
                >
                  <option value="">-</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span style={{ fontSize: '12px', color: '#888' }}>/</span>
                <select
                  value={pars[idx]}
                  onChange={e => handleParChange(idx, e.target.value)}
                  required
                  style={{
                    width: '40%',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#333',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    padding: '0.08rem 0.18rem',
                    minWidth: 0,
                    appearance: 'menulist',
                    MozAppearance: 'menulist',
                    WebkitAppearance: 'menulist',
                  }}
                >
                  {[1, 2, 3, 4, 5].map(par => (
                    <option key={par} value={par}>{par}</option>
                  ))}
                </select>
                <span style={{ fontSize: '12px', color: '#888' }}>par</span>
              </div>
              {score !== '' && (
                <div style={{ fontSize: '11px', color: Number(score) - Number(pars[idx]) === 0 ? '#28a745' : (Number(score) - Number(pars[idx]) > 0 ? '#dc3545' : '#007bff') }}>
                  {Number(score) - Number(pars[idx]) > 0 ? '+' : ''}{Number(score) - Number(pars[idx])} vs par
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontWeight: '600', color: '#333', background: '#e9ecef', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
        Total Par: {totalPar} &nbsp;|&nbsp; Total Score: {totalScore !== '' ? totalScore : '-'} &nbsp;|&nbsp; Over/Under Par: {overUnder !== '' ? (overUnder > 0 ? '+' + overUnder : overUnder) : '-'}
      </div>
      
      {error && <div className="error">{error}</div>}
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{ marginTop: '1.5rem', width: '100%' }}
      >
        {isSubmitting ? '⏳ Saving...' : '💾 Save Round'}
      </button>
    </form>
  );
};

export default ScoreEntryForm; 