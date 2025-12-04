import React from "react";
import "./styles.css"; // Certifique-se que o CSS abaixo está neste arquivo
import logo from "../../assets/svg/Logo.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importamos o contexto
import {
  MdEdit,
  MdLocalShipping,
  MdAddLocationAlt,
  MdEditLocationAlt,
  MdLogout,
  MdPersonAdd,
} from "react-icons/md";
import { LiaRouteSolid } from "react-icons/lia";
import { FaGears } from "react-icons/fa6";

function PaginaInicio() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth(); // Pegamos o 'user' além do signOut

  // Tenta pegar o nome do contexto, se não tiver (ex: refresh), tenta do localStorage, se não, "ADM"
  const nomeUsuario = user?.nome || localStorage.getItem("userNome") || "ADM";

  return (
    <div className="pagina-inicial">
      <div className="boas-vindas">
        <img src={logo} alt="Logo do Trashmap" className="logo" />
        {/* Nome Dinâmico */}
        <h1>Bem vindo, {nomeUsuario}</h1>
      </div>

      <div className="Painel">
        {/* Botões Cadastrar */}
        <button
          className="painel-button cadastrar"
          onClick={() => navigate("/cadastro-rotas")}
        >
          <LiaRouteSolid size={60} className="button-icon" />
          <span>CADASTRAR ROTAS</span>
        </button>

        <button
          className="painel-button cadastrar"
          onClick={() => navigate("/cadastro-caminhao")}
        >
          <MdLocalShipping size={50} className="button-icon" />
          <span>CADASTRAR CAMINHÃO</span>
        </button>

        <button
          className="painel-button cadastrar"
          onClick={() => navigate("/cadastro-coleta")}
        >
          <MdAddLocationAlt size={50} className="button-icon" />
          <span>CADASTRAR PONTOS DE COLETA</span>
        </button>

        {/* Botões Gerenciar */}
        <button
          className="painel-button cadastrar"
          onClick={() => navigate("/gerenciamento-rotas")}
        >
          <div className="icon-wrapper">
            <LiaRouteSolid size={50} className="button-icon" />
            <MdEdit size={30} className="button-icon" />
          </div>
          <span>GERENCIAR ROTAS</span>
        </button>

        <button
          className="painel-button gerenciar"
          onClick={() => navigate("/gerenciamento-caminhoes")}
        >
          <div className="icon-wrapper">
            <FaGears size={30} className="button-icon" />
            <MdLocalShipping size={50} className="button-icon" />
          </div>
          <span>GERENCIAR CAMINHÕES</span>
        </button>

        <button
          className="painel-button gerenciar"
          onClick={() => navigate("/gerenciamento-pontos-coleta")}
        >
          <div className="icon-wrapper">
            <MdEditLocationAlt size={50} className="button-icon" />
          </div>
          <span>GERENCIAR PONTOS DE COLETA</span>
        </button>

        <button
  className="painel-button gerenciar"
  onClick={() => navigate("/simulador")}
>
  <div className="icon-wrapper">
    <LiaRouteSolid size={50} className="button-icon" />
    <MdEdit size={30} className="button-icon" />
  </div>
  <span>SIMULADOR</span>
</button>


<button
  className="painel-button gerenciar"
  onClick={() => navigate("/simulacao-multi")}
>
  <div className="icon-wrapper">
    <MdLocalShipping size={40} className="button-icon" />
    <span style={{ fontSize: "30px", marginLeft: "5px" }}>×10</span>
  </div>
  <span>SIMULAÇÃO MULTI-CAMINHÕES</span>
</button>
        <button
          className="painel-button gerenciar"
          onClick={() => navigate("/gerenciamento-usuario")}
        >
          {/* Ícone de Usuário com + */}
          <MdPersonAdd size={60} className="button-icon" />
          <span>ADICIONAR USUARIO ADM</span>
        </button>
      </div>
        {/* Botão Sair - Agora solto no layout para posicionarmos via CSS */}
        <button className="btn-sair-flutuante" onClick={signOut}>
          <MdLogout size={24} />
          <span>Sair</span>
        </button>
    </div>
  );
}

export default PaginaInicio;
