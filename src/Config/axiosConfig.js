import axios from 'axios';
import CustomToast from '../Components/CustomToast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 10000,
  headers: {
    // "Content-Type": "application/json",
    // Add other default headers here
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const requiresAuth = config.requiresAuth ?? true;
    if (requiresAuth) {
      const token =
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken');
      console.log('token', token);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn(
          'No access token found for authenticated request to:',
          config.url
        );
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Successful response (status 2xx)
    return response;
  },
  (error) => {
    const message = error?.response.data.message;
    console.error(message);
    // OPTIONAL: Show global toast (if using something like react-toastify)
    // toast.error(error.response?.data?.message || "Something went wrong");
    return Promise.reject(error); // Pass error to your catch block
  }
);

export default axiosInstance;
