import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver logado, manda para a tela de login (/login)
  if (!signed) {
    return <Navigate to="/login" />;
  }

  // Se estiver logado, mostra o conteúdo (Home, Cadastro, etc)
  return children;
}
