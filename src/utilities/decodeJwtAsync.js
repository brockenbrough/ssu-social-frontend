import jwt_decode from 'jwt-decode';

const backendRefreshTokenURL = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/refresh-token`;

const refreshAccessToken = async (decodedAccessToken) => {
  try {
    const response = await fetch(backendRefreshTokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: decodedAccessToken.id,
        email: decodedAccessToken.email,
        username: decodedAccessToken.username,
        password: decodedAccessToken.password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;  // Extract new access token

    // Set the new access token to localStorage
    localStorage.setItem('accessToken', newAccessToken);

    return decodedAccessToken;  // Return the original decoded token
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

const getUserInfoAsync = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return Promise.resolve(undefined);
  
    const decodedAccessToken = jwt_decode(accessToken);
    const { exp } = decodedAccessToken;
  
    if (exp > new Date().getTime() / 1000) {
      const newAccessToken = refreshAccessToken(decodedAccessToken)
        .catch(error => {
          console.error('Error refreshing access token:', error);
          throw error;
        });
        return Promise.resolve(newAccessToken);
    }
  
    return Promise.resolve(undefined);
  };

  export default getUserInfoAsync;