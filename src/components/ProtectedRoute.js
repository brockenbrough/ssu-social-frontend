import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import getUserInfo from "../utilities/decodeJwt";

const ProtectedRoute = () => {
  const user = getUserInfo();
  console.log("User info:", user); // Debug log to see if user info is correctly retrieved

  if (!user) {
    console.log("User is not logged in, redirecting to login.");
    return <Navigate to="/" replace />;
  }

  console.log("User is logged in, rendering protected route.");
  return <Outlet />;
};

export default ProtectedRoute;