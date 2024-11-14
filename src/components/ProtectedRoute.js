import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import getUserInfo from "../utilities/decodeJwt";

const ProtectedRoute = () => {
  const user = getUserInfo();

  if (!user) {
    console.log("User is not logged in, redirecting to login.");
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;