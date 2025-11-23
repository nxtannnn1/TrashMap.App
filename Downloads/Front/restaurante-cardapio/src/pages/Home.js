import React from "react";
// Importa a imagem/logo do restaurante (certifique-se de que o caminho está correto)

import logo from "../assets/restaurante.jpg"; // ajuste o caminho relativo!

// Componente funcional Home que recebe a função onNavigate como prop

function Home({ onNavigate }) {
  return (
        // Centraliza todo o conteúdo

    <div style={{ textAlign: "center" }}>
      <img src={logo} alt="Logo Restaurante" width={120} />
      <h1>Bem-vindo ao Cardápio do Restaurante</h1>
      <button
        onClick={() => onNavigate("cadastro")}
        style={{ margin: 10, padding: "10px 20px" }}
      >
        Cadastrar Prato
      </button>
      <button
        onClick={() => onNavigate("cardapio")}
        style={{ margin: 10, padding: "10px 20px" }}
      >
        Ver Cardápio
      </button>
    </div>
  );
}

export default Home;
