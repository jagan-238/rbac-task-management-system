import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Redirect to login if not authenticated
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

// Redirect to dashboard if not an admin
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};
