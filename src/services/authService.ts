// src/services/authService.ts
import api from './api';
import { AxiosError } from 'axios';

// Interfaces que descrevem os dados da nossa API
interface LoginResponse {
  
  token: string;

  Usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

interface CadastroData {
  nome: string;
  email: string;
  senha: string;
  tipoUsuario: string;
}

interface CadastroResponse {
    id: number;
    nome: string;
    email: string;
    tipoUsuario: string;
}

// Função para fazer login
export const login = async (email: string, senha: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/usuarios/login', { email, senha });
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Erro no login:", error.response?.data || error.message);
    throw error;
  }
};

// Função para cadastrar um novo usuário
export const cadastrar = async (dadosUsuario: CadastroData): Promise<CadastroResponse> => {
  try {
    const response = await api.post<CadastroResponse>('/usuarios', dadosUsuario);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    console.error("Erro no cadastro:", error.response?.data || error.message);
    throw error;
  }
};