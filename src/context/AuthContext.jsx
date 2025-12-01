import React, { createContext, useState, useEffect, useContext } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao abrir o site, verifica se já estava logado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("userLoggedIn");
    const storedEmail = localStorage.getItem("userEmail");

    if (isLoggedIn === "true" && storedEmail) {
      setUser({ email: storedEmail });
    }
    setLoading(false);
  }, []);

  // Função de Login (Trazida do seu arquivo Login.jsx)
  async function signIn(email, senha) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        return {
          success: false,
          msg:
            res.status === 401
              ? "E-mail ou senha inválidos."
              : "Erro no servidor.",
        };
      }

      const usuario = await res.json();

      // Salva no LocalStorage
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userEmail", usuario.email);
      localStorage.setItem("userNome", usuario.nome);
      localStorage.setItem("userProfile", usuario.perfil || "ADMIN");

      // Atualiza o estado
      setUser(usuario);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, msg: "Erro inesperado, tente novamente." };
    }
  }

  // Função de Logout
  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
