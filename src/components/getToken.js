import React from 'react';

const GetToken = () => {
  const fetchToken = async () => {
    try {
      // Use an existing access token for authorization
      const accessToken = localStorage.getItem('accessToken');  // Retrieve token from storage or state

      console.log('Access Token:', accessToken);  // Log the token to the console
    } catch (error) {
      console.error('Error fetching the token:', error);
    }
  };

  return (
    <div className="ml-52">
      <h1>Fetch Access Token</h1>
      <button onClick={fetchToken}>Get Access Token</button>
    </div>
  );
};

export default GetToken;

