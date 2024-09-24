import React from 'react';

const GetToken = () => {
  const fetchToken = async () => {
    try {
      // Use an existing access token for authorization
      const accessToken = localStorage.getItem('accessToken');  // Retrieve token from storage or state

      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/generate-token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,  // Pass the existing token
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Access Token:', data.accessToken);  // Log the token to the console
    } catch (error) {
      console.error('Error fetching the token:', error);
    }
  };

  return (
    <div>
      <h1>Fetch Access Token</h1>
      <button onClick={fetchToken}>Get Access Token</button>
    </div>
  );
};

export default GetToken;

