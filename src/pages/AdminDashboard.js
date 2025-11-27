import React from 'react';
import MapaADM from '../../public/components/MapaADM'; // Vamos importar o mapa que criaremos em seguida

const AdminDashboard = () => {
  return (
    <div>
      <header style={{ background: '#333', color: 'white', padding: '10px' }}>
        <h1>Painel Administrativo TrashMap</h1>
      </header>
      
      <main style={{ padding: '20px' }}>
        <h2>Visualização de Lixeiras e Rotas</h2>
        
        {/* Aqui é onde o mapa será inserido */}
        <div style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
          <MapaADM /> 
        </div>
        
        {/* Você pode adicionar mais conteúdo aqui, como tabelas de dados, gráficos, etc. */}
        <p style={{ marginTop: '20px' }}>Informações de resumo e relatórios aqui...</p>
      </main>
    </div>
  );
};

export default AdminDashboard;