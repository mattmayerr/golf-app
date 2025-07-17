const express = require('express');
const router = express.Router();
const axios = require('axios');

// Free geocoding service (OpenStreetMap Nominatim)
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Simple city autocomplete using Nominatim with caching and optimization
router.get('/autocomplete', async (req, res) => {
  const { input } = req.query;
  if (!input) return res.status(400).json({ error: 'Missing input' });
  
  // Only search if input is at least 3 characters (reduces unnecessary requests)
  if (input.length < 3) {
    return res.json({
      status: 'OK',
      predictions: []
    });
  }
  
  console.log('Autocomplete request for:', input);
  
  try {
    // Search for cities using Nominatim with optimized parameters
    const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(input)}&addressdetails=1&limit=3&featuretype=city&countrycodes=us,ca&dedupe=1`;
    console.log('Making request to:', url);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'GolfApp/1.0'
      },
      timeout: 3000 // 3 second timeout
    });
    
    console.log('Nominatim response:', response.data.length, 'results');
    
    // Transform Nominatim response to match Google Places format
    const predictions = response.data.map(place => ({
      description: `${place.name}, ${place.address?.state || place.address?.country || ''}`.trim(),
      place_id: place.place_id,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon)
    }));
    
    res.json({
      status: 'OK',
      predictions: predictions
    });
  } catch (err) {
    console.error('Autocomplete error:', err.message);
    // Return empty results instead of error to prevent frontend issues
    res.json({
      status: 'OK',
      predictions: []
    });
  }
});

// Geocoding using Nominatim
router.get('/geocode', async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'Missing address' });
  
  try {
    const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'GolfApp/1.0'
      }
    });
    
    if (response.data.length === 0) {
      return res.json({ results: [] });
    }
    
    const place = response.data[0];
    const result = {
      results: [{
        geometry: {
          location: {
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon)
          }
        },
        formatted_address: place.display_name
      }]
    };
    
    res.json(result);
  } catch (err) {
    console.error('Geocode error:', err.message);
    res.status(500).json({ error: 'Failed to fetch geocode results' });
  }
});

// Nearby search using Overpass API (OpenStreetMap data)
router.get('/nearby', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng' });
  
  try {
    // Search for convenience stores near the location
    const radius = 10000; // 10km radius
    const query = `
      [out:json][timeout:25];
      (
        node["shop"="convenience"](around:${radius},${lat},${lng});
        way["shop"="convenience"](around:${radius},${lat},${lng});
        relation["shop"="convenience"](around:${radius},${lat},${lng});
      );
      out body;
      >>;
      out skel qt;
    `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    
    // Transform Overpass response to match Google Places format
    const results = response.data.elements
      .filter(element => element.type === 'node' && element.tags)
      .map(element => ({
        name: element.tags.name || 'Convenience Store',
        vicinity: element.tags['addr:street'] ? 
          `${element.tags['addr:housenumber'] || ''} ${element.tags['addr:street']}`.trim() : 
          'Nearby location',
        geometry: {
          location: {
            lat: element.lat,
            lng: element.lon
          }
        }
      }))
      .slice(0, 5); // Limit to 5 results
    
    res.json({ results: results });
  } catch (err) {
    console.error('Nearby search error:', err.message);
    // Fallback: return a mock result
    res.json({
      results: [{
        name: '7-Eleven (Mock Location)',
        vicinity: 'Near your location',
        geometry: {
          location: { lat: parseFloat(lat), lng: parseFloat(lng) }
        }
      }]
    });
  }
});

module.exports = router; 