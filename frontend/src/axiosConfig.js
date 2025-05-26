import axios from 'axios';

const instance = axios.create();

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      // Redirect to the correct login page based on current path or role
      if (window.location.pathname.startsWith('/student')) {
        window.location.href = '/student-login';
      } else {
        window.location.href = '/admin-login';
      }
    }
    return Promise.reject(error);
  }
);

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance; 