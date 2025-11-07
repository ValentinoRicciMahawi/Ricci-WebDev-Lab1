import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const isAuth = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada pembatasan role dan user role tidak sesuai
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect ke dashboard sesuai role mereka
    if (userRole === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    } else if (userRole === 'instructor') {
      return <Navigate to="/instructor-dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;