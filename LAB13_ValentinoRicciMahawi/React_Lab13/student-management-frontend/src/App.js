import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import PrivateRoute from './components/PrivateRoute';
import authService from './services/auth';

function App() {
  // Redirect root ke dashboard yang sesuai atau login
  const RootRedirect = () => {
    if (authService.isAuthenticated()) {
      const role = authService.getUserRole();
      if (role === 'student') {
        return <Navigate to="/student-dashboard" replace />;
      } else if (role === 'instructor') {
        return <Navigate to="/instructor-dashboard" replace />;
      }
    }
    return <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/student-dashboard" 
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/instructor-dashboard" 
            element={
              <PrivateRoute allowedRoles={['instructor']}>
                <InstructorDashboard />
              </PrivateRoute>
            } 
          />

          {/* Root and fallback */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;