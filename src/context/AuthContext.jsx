import React, { createContext, useState, useContext } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Tenta recuperar do localStorage ao inicializar de forma SEGURA
    try {
      const savedUser = localStorage.getItem('user');
      // Verifica se savedUser existe e não é "undefined" ou "null" como string
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar usuário do localStorage:', error);
      // Limpa dados corrompidos
      localStorage.removeItem('user');
      return null;
    }
  });
  
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    // Verifica se o token existe e não é "undefined" ou "null"
    return savedToken && savedToken !== 'undefined' && savedToken !== 'null' 
      ? savedToken 
      : null;
  });

  const signIn = async (email, senha) => {
    console.log("🔍 [signIn] Tentando login para:", email);
    
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      console.log("📥 [signIn] Status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [signIn] Erro:", errorText);
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      console.log("✅ [signIn] Dados recebidos:", data);
      
      // ⚠️ **IMPORTANTE:** Constrói objeto usuário com os dados recebidos
      const usuario = {
        id: data.id || null,
        nome: data.nome || 'Administrador',
        email: data.email,
        isAdm: data.isAdm !== undefined ? data.isAdm : true
      };
      
      console.log("✅ [signIn] Usuário:", usuario);
      
      // Salva no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      // Atualiza estado
      setToken(data.token);
      setUser(usuario);
      
      console.log("✅ [signIn] Login concluído com sucesso!");
      return { success: true };
      
    } catch (error) {
      console.error('❌ [signIn] Erro:', error);
      return { 
        success: false, 
        msg: error.message || 'Erro ao fazer login' 
      };
    }
  };

  const signOut = () => {
    console.log("🚪 [signOut] Fazendo logout...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Limpa dados corrompidos no localStorage
  const clearCorruptedData = () => {
    ['user', 'token'].forEach(key => {
      const value = localStorage.getItem(key);
      if (value === 'undefined' || value === 'null') {
        localStorage.removeItem(key);
        console.log(`🗑️ Removido dado corrompido: ${key}`);
      }
    });
  };

  // Limpa dados corrompidos na inicialização
  React.useEffect(() => {
    clearCorruptedData();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      signIn, 
      signOut, 
      isAuthenticated: !!token && !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};