// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { login as apiLogin } from "../services/authService";
import api from "../services/api"; // <--- IMPORTANTE: Importe sua instância do Axios aqui

interface User {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean; // Adicionado para bater com o backend
}

interface AuthContextData {
  user: User | null;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        const userDataString = await SecureStore.getItemAsync("userData");

        if (token && userDataString) {
          // 1. Configura o token no Axios para as requisições futuras
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // 2. Restaura o usuário no estado
          setUser(JSON.parse(userDataString));
        }
      } catch (e) {
        console.error("Failed to load auth data from storage", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserFromStorage();
  }, []);

  const signIn = async (email: string, senha: string) => {
    try {
      // 1. Faz o login na API
      // A resposta agora é: { id, nome, email, isAdmin, token }
      const response = await apiLogin(email, senha);

      // 2. Separa o TOKEN do resto dos DADOS DO USUÁRIO
      const { token, ...usuarioDados } = response;

      // 3. Configura o Axios com o token imediatamente
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 4. Salva no Estado do React
      setUser(usuarioDados);

      // 5. Salva no Armazenamento do Celular (Persistência)
      await SecureStore.setItemAsync("userToken", token);

      // CORREÇÃO DO ERRO: Agora 'usuarioDados' é um objeto válido, então o JSON.stringify funciona
      await SecureStore.setItemAsync("userData", JSON.stringify(usuarioDados));
    } catch (error) {
      console.error("Falha no signIn (AuthContext):", error);
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    // Remove o token do header do axios
    api.defaults.headers.common["Authorization"] = "";
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userData");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
