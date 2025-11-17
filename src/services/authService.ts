import api from "./api";
import { AxiosError } from "axios";

// 1. Interface ajustada para bater com o UsuarioLoginDTOResponse do Java
interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean; // O Java manda true/false
  token: string; // O Token JWT gerado
}

// 2. Interface ajustada para bater com o UsuarioDTORequest
interface CadastroData {
  nome: string;
  email: string;
  senha: string;
  // Removemos tipoUsuario para evitar erro 400 no Java
}

// 3. Interface ajustada para bater com o UsuarioDTOResponse
interface CadastroResponse {
  id: number;
  nome: string;
  email: string;
  isAdmin: boolean;
}

// Função para fazer login
export const login = async (
  email: string,
  senha: string
): Promise<LoginResponse> => {
  try {
  
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      senha,
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Erro no login:", error.response?.data || error.message);
    throw error;
  }
};

// Função para cadastrar um novo usuário
export const cadastrar = async (
  dadosUsuario: CadastroData
): Promise<CadastroResponse> => {
  try {
    // Esta rota bate com o @PostMapping no UsuarioController
    const response = await api.post<CadastroResponse>(
      "/usuarios",
      dadosUsuario
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Erro no cadastro:", error.response?.data || error.message);
    throw error;
  }
};
