import React from "react";
import "./ScreenLayout.css";
// Ajuste o caminho do logo conforme a estrutura da sua pasta
import logo from "../../assets/svg/Logo.svg";

export default function ScreenLayout({ children, title, rightContent }) {
  return (
    <div className="layout-container">
      {/* Lado Esquerdo - Sidebar Verde */}
      <div className="layout-sidebar">
        <img src={logo} alt="Logo do Trashmap" className="layout-logo" />
        <h1 className="layout-title">{title}</h1>

        {/* Aqui entra o formulário específico de cada tela */}
        <div className="layout-sidebar-content">{children}</div>
      </div>

      {/* Lado Direito - Mapa ou Tabela */}
      <div className="layout-content-area">
        {rightContent ? rightContent : <h1>Área de Conteúdo (Mapa/Tabela)</h1>}
      </div>
    </div>
  );
}
