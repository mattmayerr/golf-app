import React, { useState, useEffect } from 'react';
import api from '../api';
import ScoreEntryForm from '../components/ScoreEntryForm';
import ScoreHistory from '../components/ScoreHistory';
import CourseManager from '../components/CourseManager';
import StatisticsDashboard from '../components/StatisticsDashboard';

const Dashboard = () => {
  const [rounds, setRounds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCourseManager, setShowCourseManager] = useState(false);

  // Load rounds and courses from database on mount
  useEffect(() => {
    loadRounds();
    loadCourses();
  }, []);

  const loadRounds = async () => {
    try {
      const response = await api.get('/api/rounds');
      setRounds(response.data);
    } catch (err) {
      setError('Failed to load rounds. Please refresh the page.');
      console.error('Error loading rounds:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await api.get('/api/courses');
      setCourses(response.data);
    } catch (err) {
      console.error('Error loading courses:', err);
    }
  };

  const handleAddRound = (newRound) => {
    setRounds([newRound, ...rounds]);
  };

  const handleDeleteRound = async (roundId) => {
    if (!window.confirm('Are you sure you want to delete this round? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/rounds/${roundId}`);
      setRounds(rounds.filter(round => round._id !== roundId));
    } catch (err) {
      console.error('Error deleting round:', err);
      alert('Failed to delete round. Please try again.');
    }
  };

  const handleShowCourseManager = () => {
    setShowCourseManager(true);
  };

  const handleCourseAdded = (newCourse) => {
    setCourses(prev => [...prev, newCourse]);
    setShowCourseManager(false);
  };

  if (loading) {
    return <div>Loading your golf rounds...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Golf Score Tracker</h2>
      <StatisticsDashboard rounds={rounds} />
      {showCourseManager && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ margin: 0 }}>Course Management</h3>
              <button
                onClick={() => setShowCourseManager(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>
            <CourseManager onCourseAdded={handleCourseAdded} courses={courses} setCourses={setCourses} />
          </div>
        </div>
      )}
      <ScoreEntryForm 
        onAddRound={handleAddRound} 
        onShowCourseManager={handleShowCourseManager}
        courses={courses}
        setCourses={setCourses}
      />
      <ScoreHistory rounds={rounds} onDeleteRound={handleDeleteRound} />
    </div>
  );
};

export default Dashboard; 