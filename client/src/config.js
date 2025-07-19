const config = {
  // API base URL - will use proxy in development, full URL in production
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com'
    : '',
  
  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyCPBgf65V_6V94p8gnjU04DWYLJLehnXLg'
};

export default config; 