import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      const res = await api.post('/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>🔐 Login to Golf Tracker</h2>
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
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">🚀 Login</button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login; 