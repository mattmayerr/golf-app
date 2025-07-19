import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Auth Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Navigation Component
const Navigation = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return null; // Don't show navigation for unauthenticated users
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', background: '#eee', marginBottom: '2rem' }}>
      <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
      <button 
        onClick={handleLogout}
        style={{
          padding: '8px 16px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </nav>
  );
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
