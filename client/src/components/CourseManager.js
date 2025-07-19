import React, { useState, useEffect } from 'react';
import api from '../api';

const CourseManager = ({ onCourseAdded, courses, setCourses }) => {
  const [newCourseName, setNewCourseName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) {
      setError('Please enter a course name');
      return;
    }

    setIsAdding(true);
    setError('');

    try {
      const response = await api.post('/api/courses', 
        { name: newCourseName.trim() }
      );
      setNewCourseName('');
      setShowForm(false);
      if (onCourseAdded) {
        onCourseAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add course');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    try {
      await api.delete(`/api/courses/${courseId}`);
      setCourses(prev => prev.filter(course => course._id !== courseId));
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  return (
    <div className="course-manager">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem' 
      }}>
        <h3 style={{ margin: 0, color: 'white' }}>🏌️ My Courses</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: showForm ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showForm ? '✕ Cancel' : '➕ Add Course'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddCourse} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="Enter course name"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <button
              type="submit"
              disabled={isAdding}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isAdding ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {isAdding ? '⏳ Adding...' : '💾 Save'}
            </button>
          </div>
          {error && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '0.5rem' }}>{error}</div>}
        </form>
      )}

      <div style={{ 
        display: 'grid', 
        gap: '0.5rem',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        {courses.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem', 
            color: '#666',
            fontSize: '14px'
          }}>
            No courses added yet. Add your first course above!
          </div>
        ) : (
          courses.map(course => (
            <div
              key={course._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e9ecef'
              }}
            >
              <span style={{ fontWeight: '500', color: '#333' }}>
                🏌️ {course.name}
              </span>
              <button
                onClick={() => handleDeleteCourse(course._id)}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                title="Delete course"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseManager; 