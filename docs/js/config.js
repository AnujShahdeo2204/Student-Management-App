// API Configuration for Student Management App
const CONFIG = {
  // Default fallback backend URL
  // Replace this with your actual deployed Vercel backend URL (e.g., https://your-backend.vercel.app/api)
  PRODUCTION_API_URL: 'https://your-student-backend.vercel.app/api',

  getApiBaseUrl() {
    // 1. Check if user configured custom URL in browser localStorage
    const customUrl = localStorage.getItem('student_api_url');
    if (customUrl && customUrl.trim()) {
      return customUrl.trim().replace(/\/+$/, '');
    }

    // 2. Local development fallback
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.protocol === 'file:';

    if (isLocalhost) {
      return 'http://localhost:3000/api';
    }

    // 3. Production deployed default
    return this.PRODUCTION_API_URL.replace(/\/+$/, '');
  },

  setApiBaseUrl(url) {
    if (url && url.trim()) {
      localStorage.setItem('student_api_url', url.trim());
    } else {
      localStorage.removeItem('student_api_url');
    }
  },
};
