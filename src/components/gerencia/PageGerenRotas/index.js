import React, { useState } from "react";
import logo from "../../../assets/svg/Logo.svg";
// Importa o arquivo de estilos
import "./style.css";

const GerenciadorRotas = () => {
  return (
    <div className="gerenciador-rotas-container">
      <div className="card-form-geren">
        <img src={logo} alt="Logo do Trashmap" className="logo" />
        <h1>Gerenciador de Rotas</h1>

        <div className="form-gerenciador-rotas">
          <label>Origem:</label>
          <input type="text" placeholder="Digite o ponto de origem" />
          <label>Destino:</label>
          <input type="text" placeholder="Digite o ponto de destino" />
          <label>Distância (km):</label>
          <input type="number" placeholder="Digite a distância em km" />
          <button>Adicionar Rota</button>
        </div>
      </div>
      <div className="container-map">
        <h1>SIMULADOR DE MAPA</h1>
      </div>
    </div>
  );
};
export default GerenciadorRotas;
