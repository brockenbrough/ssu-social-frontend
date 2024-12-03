import jwt_decode from 'jwt-decode';

const backendRefreshTokenURL = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/refresh-token`;
const getBioURL = `${process.env.REACT_APP_BACKEND_SERVER_URI}/get-bio`;

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
        role: decodedAccessToken.role
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh access token');
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;  // Extract new access token

    // Set the new access token to localStorage
    localStorage.setItem('accessToken', newAccessToken);

    // Return the new decoded access token
    const newDecodedToken = jwt_decode(newAccessToken);
    return newDecodedToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};

const getUserInfoAsync = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return undefined; // Return undefined directly

  const decodedAccessToken = jwt_decode(accessToken);
  const { exp, id } = decodedAccessToken;

  // If token has expired
  if (exp < new Date().getTime() / 1000) {
    try {
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error('Token has expired', error);
      throw error;
    }
  }

  // Token is still valid, now fetch the user's information including biography
  try {
    const response = await fetch(`${getBioURL}/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch user biography');
      return decodedAccessToken; // Return just the decoded token if biography fetch fails
    }

    const userBioData = await response.json();

    // Return user info along with biography
    return {
      ...decodedAccessToken,
      biography: userBioData.biography || '', // Include biography in the returned data
    };
  } catch (error) {
    console.error('Error fetching user biography:', error);
    return decodedAccessToken; // Return the decoded token if fetching biography fails
  }
};

export { refreshAccessToken, getUserInfoAsync };