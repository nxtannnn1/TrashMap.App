// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Nosso CSS

// Importando nossos componentes de "página"
import Home from './pages/Home';
import Caminhoes from './pages/Caminhoes';
import Pontos from './pages/Pontos';
import Enderecos from './pages/Enderecos';
import Usuarios from './pages/Usuarios';

function App() {
  // Lógica de Autenticação (do index.html)
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const userProfile = localStorage.getItem('userProfile');

    if (isLoggedIn !== 'true' || (userProfile !== 'ADMIN' && userProfile !== 'MODERADOR')) {
      alert('Você precisa fazer login com um perfil válido para acessar o painel.');
      window.location.href = '/login.html';
    }
  }, []);

  // Agora o "state" guarda o COMPONENTE ATIVO
  const [ActiveComponent, setActiveComponent] = useState(() => Home); // Começa com o <Home />

  // Esta função agora é um "roteador" de componentes
  function loadPage(pageName) {
    switch (pageName) {
      case 'caminhoes':
        setActiveComponent(() => Caminhoes); // Vamos descomentar isso no próximo passo
        alert('Componente Caminhoes ainda não criado');
        break;
      case 'pontos':
        setActiveComponent(() => Pontos);
        alert('Componente Pontos ainda não criado');
        break;
      case 'enderecos':
        setActiveComponent(() => Enderecos);
        alert('Componente Enderecos ainda não criado');
        break;
      case 'usuarios':
        setActiveComponent(() => Usuarios);
        alert('Componente Usuarios ainda não criado');
        break;
      default:
        setActiveComponent(() => Home);
    }
  }

  // Lógica de Logout
  function logout() {
    localStorage.clear();
    alert('Você foi desconectado.');
    window.location.href = '/login.html';
  }

  // O JSX (HTML) permanece quase o mesmo
  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>TrashMap</h2>
        <ul>
          {/* Note que o onClick agora chama 'loadPage' */}
          <li><a href="#" onClick={() => loadPage('caminhoes')}>Caminhões</a></li>
          <li><a href="#" onClick={() => loadPage('pontos')}>Pontos de Coleta</a></li>
          <li><a href="#" onClick={() => loadPage('enderecos')}>Endereços</a></li>
          <li><a href="#" onClick={() => loadPage('usuarios')}>Usuários</a></li>
          <li><a href="#" onClick={logout}>Sair</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="content" id="main-content">
        {/*
          Aqui está a mágica do React:
          Ele renderiza qualquer componente que estiver na variável 'ActiveComponent'.
          Isso substitui o seu 'main.innerHTML = html'.
        */}
        <ActiveComponent />
      </main>
    </div>
  );
}

export default App;