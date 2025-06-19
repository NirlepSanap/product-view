import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that checks authentication status
 * Redirects unauthenticated users to login page
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
}

export default ProtectedRoute;