// Importa o React e o hook useState

import React, { useState } from 'react';

// Importa os componentes de página

import Home from './pages/Home';
import CadastroPrato from './pages/CadastroPrato';
import Cardapio from './pages/Cardapio';

function App() {
    // Estado que controla qual página está sendo exibida: 'home', 'cadastro' ou 'cardapio'

  const [page, setPage] = useState('home');
    // Estado que armazena os pratos cadastrados

  const [pratos, setPratos] = useState([]);

  // Função que adiciona um novo prato ao array de pratos

  const adicionarPrato = (novoPrato) => {
    setPratos([...pratos, { ...novoPrato, id: Date.now() }]); // adiciona novo prato com um ID único
  };

    // Função que decide qual componente exibir com base na página atual

  const renderPage = () => {
    switch(page) {
      case 'cadastro': return <CadastroPrato onSubmit={adicionarPrato} onVoltar={() => setPage('home')} />;
      case 'cardapio': return <Cardapio pratos={pratos} onVoltar={() => setPage('home')} />;
      default: return <Home onNavigate={setPage} />;
    }
  };

  return (
        // Container principal da aplicação com largura e margem definidas

    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      {renderPage()}
    </div>
  );
}

export default App;
