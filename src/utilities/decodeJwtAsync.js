import jwt_decode from "jwt-decode";
import apiClient from "./apiClient";

const backendRefreshTokenURL = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/refresh-token`;

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post(backendRefreshTokenURL, {
      refreshToken,
    });

    if (response.status !== 200) {
      throw new Error("Failed to refresh access token");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    // Store the new tokens
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    // Decode and return the new access token
    const newDecodedToken = jwt_decode(newAccessToken);
    return newDecodedToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    // Clear tokens if refresh failed
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

const getUserInfoAsync = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return undefined; // Return undefined directly

  const decodedAccessToken = jwt_decode(accessToken);
  const { exp} = decodedAccessToken;

  // If token has expired
  if (exp < new Date().getTime() / 1000) {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      console.error("Token has expired", error);
      throw error;
    }
    return undefined;
  }
    return decodedAccessToken;
};

export { refreshAccessToken, getUserInfoAsync };
