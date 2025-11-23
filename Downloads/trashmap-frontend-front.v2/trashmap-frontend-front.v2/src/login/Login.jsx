// src/login/Login.jsx
import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';
import './login.css';
import elevadorImg from '../assets/img/elevador-lacerda.jpeg';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    try {
      // ✅ CORRIJA ESTA LINHA - MUDAR "/auth/login" PARA "/usuarios/login"
      const res = await fetch(`${API_BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) {
        setErro(res.status === 401 ? 'E-mail ou senha inválidos.' : 'Erro no servidor.');
        return;
      }

      const usuario = await res.json();
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userEmail', usuario.email);
      localStorage.setItem('userNome', usuario.nome);
      localStorage.setItem('userProfile', usuario.perfil || 'ADMIN');

      window.location.href = '/'; // redireciona para o painel
    } catch (err) {
      console.error(err);
      setErro('Erro inesperado, tente novamente.');
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${elevadorImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div className="login-box">
        <h1>Acesso Restrito</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu.email@exemplo.com"
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="********"
            required
          />

          <button type="submit">Entrar no Sistema</button>
          {erro && <p className="erro">{erro}</p>}
        </form>
      </div>
    </div>
  );
}