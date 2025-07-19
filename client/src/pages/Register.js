import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      const res = await api.post('/api/auth/register', { email, password });
      setSuccess('Account created! You can now log in.');
      setEmail('');
      setPassword('');
      setTimeout(() => navigate('/login'), 1500); // Redirect after 1.5s
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>✨ Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <button type="submit">🎯 Create Account</button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register; 