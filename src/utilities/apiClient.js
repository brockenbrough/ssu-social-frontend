import axios from 'axios';
import { refreshAccessToken } from './decodeJwtAsync';
import jwt_decode from 'jwt-decode';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_SERVER_URI,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the token
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Attempt to refresh the token here
            try {
                // Get the existing access token
                const accessToken = localStorage.getItem('accessToken');

                // Decode the access token to get user info
                const decodedAccessToken = jwt_decode(accessToken);

                // Call refresh token function
                await refreshAccessToken(decodedAccessToken);

                // Get the new access token
                const newAccessToken = localStorage.getItem('accessToken');

                // Update the authorization header and retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Redirect to login page or handle refresh token failure
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
