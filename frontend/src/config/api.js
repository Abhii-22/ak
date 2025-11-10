// API Configuration for different environments
const getApiBaseUrl = () => {
  // For production (when deployed on Vercel)
  if (window.location.hostname !== 'localhost') {
    return 'https://ak-1-imry.onrender.com';
  }
  // For local development
  return 'http://localhost:5001';
};

export const API_BASE_URL = getApiBaseUrl();
