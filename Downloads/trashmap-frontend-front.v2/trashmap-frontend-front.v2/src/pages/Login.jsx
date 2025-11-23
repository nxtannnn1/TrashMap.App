// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config/api';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      // ✅ CORRIJA ESTA LINHA - MUDAR "/auth/login" PARA "/usuarios/login"
      const response = await axios.post(`${API_BASE_URL}/usuarios/login`, {
        email,
        senha,
      });

      // Armazena localmente e envia pro App
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userProfile", "ADMIN"); // ou MODERADOR, conforme resposta do backend
      onLoginSuccess(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setErro("E-mail ou senha inválidos");
      } else {
        setErro("Erro ao conectar com o servidor");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Login Painel TrashMap</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 8, margin: "8px 0" }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          minLength={8}
          maxLength={20}
          style={{ width: "100%", padding: 8, margin: "8px 0" }}
        />
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Entrar
        </button>
      </form>
    </div>
  );
}