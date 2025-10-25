// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const auth = localStorage.getItem("auth"); // check if user is logged in
  return auth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
