const CONFIG = {
  PRODUCTION_API_URL: 'https://student-management-app-black.vercel.app/api',

  getApiBaseUrl() {
    const { hostname, protocol } = window.location;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

    if (isLocal) {
      return 'http://localhost:3000/api';
    }

    if (protocol === 'http:' || protocol === 'https:') {
      return '/api';
    }

    return this.PRODUCTION_API_URL;
  },
};
