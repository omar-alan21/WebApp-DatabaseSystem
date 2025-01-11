import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from './AppContext';

const ProtectedRoute = ({ children, allowed }) => {
  const { user } = useContext(AppContext);
  if (!allowed.includes(user['Stanowisko'])) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
