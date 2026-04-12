import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PrivateRoute = ({ children, role }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    switch (user.role) {
      case 'student': return <Navigate to="/student/dashboard" replace />;
      case 'faculty': return <Navigate to="/faculty/dashboard" replace />;
      case 'admin': return <Navigate to="/admin/dashboard" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  return (
    <>
      <Header userRole={user.role} userName={user.name} />
      <div style={{ minHeight: 'calc(100vh - 140px)' }}>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default PrivateRoute;
