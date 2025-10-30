import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps'; 
import './App.css'; 

import Home from './pages/Home';
import Caminhoes from './pages/Caminhoes';
import Pontos from './pages/Pontos';
import Enderecos from './pages/Enderecos';
import Usuarios from './pages/Usuarios';

// ANOTAÇÃO: A chave da API agora está sendo usada corretamente
const GOOGLE_MAPS_KEY = "AIzaSyCBs_5rLELLShtl5MR3lnIqova7IBWDGZg"; 

function App() {
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const userProfile = localStorage.getItem('userProfile');

    if (isLoggedIn !== 'true' || (userProfile !== 'ADMIN' && userProfile !== 'MODERADOR')) {
      alert('Você precisa fazer login com um perfil válido para acessar o painel.');
      window.location.href = '/login.html';
    }
  }, []);

  const [ActiveComponent, setActiveComponent] = useState(() => Home); 

  function loadPage(pageName) {
    switch (pageName) {
      case 'caminhoes':
        setActiveComponent(() => Caminhoes);
        alert('Componente Caminhoes ainda não criado');
        break;
      case 'pontos':
        setActiveComponent(() => Pontos);
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

  function logout() {
    localStorage.clear();
    alert('Você foi desconectado.');
    window.location.href = '/login.html';
  }

  return (
    // ANOTAÇÃO: Usando a variável GOOGLE_MAPS_KEY
    <APIProvider apiKey={GOOGLE_MAPS_KEY}> 
      <div className="container">
        <nav className="sidebar">
          <h2>TrashMap</h2>
          <ul>
            {/*               ANOTAÇÃO: Trocamos <a> por <button> para corrigir os avisos
              e ser semanticamente correto. Você pode precisar de um
              CSS simples para que o <button> se pareça com o <a>:
              .sidebar button { background: none; border: none; color: white; text-align: left; cursor: pointer; padding: 10px; font-size: 16px; }
            */}
            <li><button onClick={() => loadPage('caminhoes')}>Caminhões</button></li>
            <li><button onClick={() => loadPage('pontos')}>Pontos de Coleta</button></li>
            <li><button onClick={() => loadPage('enderecos')}>Endereços</button></li>
            <li><button onClick={() => loadPage('usuarios')}>Usuários</button></li>
            <li><button onClick={logout}>Sair</button></li>
          </ul>
        </nav>

        <main className="content" id="main-content">
          <ActiveComponent />
        </main>
      </div>
    </APIProvider>
  );
}

export default App;