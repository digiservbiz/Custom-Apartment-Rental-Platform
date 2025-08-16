import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && user.role === 'admin') {
    return children;
  }

  return <Navigate to="/" />;
};

export default AdminRoute;
