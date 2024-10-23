import { useEffect, useRef, useContext, useCallback } from 'react';
import { refreshAccessToken } from '../../utilities/decodeJwtAsync'; // Adjust the import path
import jwt_decode from 'jwt-decode';
import { UserContext } from '../../App';
import { useLocation } from 'react-router-dom';
import { TokenRefreshContext } from '../contexts/tokenRefreshContext';

const TOKEN_REFRESH_INTERVAL = 45 * 60 * 1000; // 45 minutes
const THROTTLE_DELAY = 1000; // 1 second delay for throttling

const useRefreshTokenOnActivity = () => {
  const location = useLocation();
  const isThrottledRef = useRef(false); // Throttle flag
  const throttleTimeoutRef = useRef(null); // Throttle timer reference
  const { user, setUser } = useContext(UserContext);
  const { lastRefreshTime, setLastRefreshTime } = useContext(TokenRefreshContext);

  const lastRefreshTimeRef = useRef(lastRefreshTime);

  useEffect(() => {
    lastRefreshTimeRef.current = lastRefreshTime;
  }, [lastRefreshTime]);

  const handleTokenRefresh = useCallback(async () => {
    const now = Date.now();
    if (now - lastRefreshTimeRef.current >= TOKEN_REFRESH_INTERVAL) {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.warn('No access token found in localStorage.');
          return;
        }

        const decodedAccessToken = jwt_decode(accessToken);

        // Refresh the token
        const newDecodedToken = await refreshAccessToken(decodedAccessToken);

        // Update the last refresh time
        setLastRefreshTime(now);
        lastRefreshTimeRef.current = now;

        // Update user state with new decoded token
        if (setUser) {
          setUser(newDecodedToken);
        }

      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
  }, [setLastRefreshTime, setUser]);

  const handleUserActivity = useCallback(() => {
    if (isThrottledRef.current) return; // Exit if throttled

    isThrottledRef.current = true; // Set throttle flag
    handleTokenRefresh(); // Call the token refresh function

    // Set a timeout to reset the throttle flag after the delay
    throttleTimeoutRef.current = setTimeout(() => {
      isThrottledRef.current = false;
    }, THROTTLE_DELAY);
  }, [handleTokenRefresh]);

  useEffect(() => {
    // Add event listeners for user activity
    document.addEventListener('click', handleUserActivity);
    document.addEventListener('scroll', handleUserActivity);
    document.addEventListener('mousemove', handleUserActivity);

    return () => {
      // Remove event listeners on cleanup
      document.removeEventListener('click', handleUserActivity);
      document.removeEventListener('scroll', handleUserActivity);
      document.removeEventListener('mousemove', handleUserActivity);

      // Clear the throttle timeout if it exists
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [handleUserActivity]);

  // Trigger token refresh on route change
  useEffect(() => {
    handleUserActivity();
  }, [location.pathname, handleUserActivity]);
};

export default useRefreshTokenOnActivity;