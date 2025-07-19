import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Landing = () => {
  const [city, setCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch city suggestions as user types (via backend proxy) with debouncing
  const handleCityChange = async (e) => {
    const value = e.target.value;
    setCity(value);
    setResult(null);
    setError('');
    setCitySuggestions([]);
    
    // Clear any existing timeout
    if (window.autocompleteTimeout) {
      clearTimeout(window.autocompleteTimeout);
    }
    
    // Only search if input is at least 3 characters
    if (value.length < 3) return;
    
    // Debounce the API call to reduce requests
    window.autocompleteTimeout = setTimeout(async () => {
      try {
        const res = await api.get(`/api/utility/autocomplete?input=${encodeURIComponent(value)}`);
        const data = res.data;
        console.log('Autocomplete API response:', data);
        if (data.status === 'OK') {
          setCitySuggestions(data.predictions.map(pred => pred.description));
          console.log('Setting suggestions:', data.predictions.map(pred => pred.description));
        }
      } catch (err) {
        console.error('Autocomplete error:', err);
        // Don't show error for autocomplete failures, just log them
      }
    }, 300); // Wait 300ms after user stops typing
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    setCitySuggestions([]);
  };

  const handleFindZyn = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');
    setLoading(true);
    setCitySuggestions([]);
    try {
      // Geocode the city to get lat/lng (via backend proxy)
      const geoRes = await api.get(`/api/utility/geocode?address=${encodeURIComponent(city)}`);
      const geoData = geoRes.data;
      if (!geoData.results || !geoData.results.length) throw new Error('City not found');
      const { lat, lng } = geoData.results[0].geometry.location;
      // Search for 7-Eleven nearby (via backend proxy)
      const placesRes = await api.get(`/api/utility/nearby?lat=${lat}&lng=${lng}`);
      const placesData = placesRes.data;
      if (!placesData.results || !placesData.results.length) throw new Error('No 7-Eleven found near this city');
      const place = placesData.results[0];
      setResult({
        name: place.name,
        address: place.vicinity,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.vicinity)}`
      });
    } catch (err) {
      setError(err.message || 'Failed to find 7-Eleven');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <h1>Welcome to Golf Score Tracker</h1>
      <p>
        Track your golf rounds, monitor your progress, and improve your game with our easy-to-use mobile-friendly app.
      </p>
      
      <div className="landing-buttons">
        <Link to="/login" className="btn-primary">
          🔐 Login
        </Link>
        <Link to="/register" className="btn-success">
          ✨ Register
        </Link>
      </div>

      {/* Zyn/7-Eleven Finder */}
      <div style={{
        margin: '2rem auto',
        padding: '1.5rem',
        background: '#f8f9fa',
        borderRadius: '12px',
        maxWidth: '400px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        textAlign: 'center',
        position: 'relative'
      }}>
        <h3 style={{ marginTop: 0, color: '#1b4636' }}>Find some zyn near you</h3>
        <form onSubmit={handleFindZyn} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center', position: 'relative' }} autoComplete="off">
          <div style={{ position: 'relative', flex: 1, minWidth: '120px' }}>
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              placeholder="Enter your city..."
              style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
              required
              autoComplete="off"
            />
            {citySuggestions.length > 0 && (
              <ul style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '100%',
                background: 'white',
                border: '1px solid #ccc',
                borderTop: 'none',
                zIndex: 10,
                listStyle: 'none',
                margin: 0,
                padding: 0,
                maxHeight: '180px',
                overflowY: 'auto',
                fontSize: '0.98em'
              }}>
                {citySuggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee', background: suggestion === city ? '#e9ecef' : 'white' }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Searching...' : 'Find'}
          </button>
        </form>
        {error && <div style={{ color: '#dc3545', marginBottom: '0.5rem' }}>{error}</div>}
        {result && (
          <div style={{ color: '#333', fontWeight: 500 }}>
            <div>Closest 7-Eleven: <span style={{ color: '#007bff' }}>{result.name}</span></div>
            <div style={{ fontSize: '0.95em', margin: '0.25rem 0' }}>{result.address}</div>
            <a href={result.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#28a745', textDecoration: 'underline' }}>Open in Google Maps</a>
          </div>
        )}
      </div>
      
      {/* Features box removed as requested */}
    </div>
  );
};

export default Landing; 