import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  console.log("🔐 [PrivateRoute] isAuthenticated:", isAuthenticated);
  
  if (!isAuthenticated) {
    console.log("🔐 [PrivateRoute] Não autenticado, redirecionando para /login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("🔐 [PrivateRoute] Autenticado, renderizando conteúdo");
  return children;
};

export default PrivateRoute;
