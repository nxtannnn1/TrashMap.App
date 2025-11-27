import "./styles.css";
import logo from "../../assets/svg/Logo.svg";
import {
  MdEdit, // Para Cadastrar Rotas
  MdLocalShipping, // Para Cadastrar Caminhões
  MdAddLocationAlt, // Para Cadastrar Pontos de Coleta
  MdEditLocationAlt, // Para Gerenciar Rotas
} from "react-icons/md";
import { LiaRouteSolid } from "react-icons/lia";
import { FaGears } from "react-icons/fa6";

function PaginaInicio() {
  return (
    <div className="pagina-inicial">
      <div className="boas-vindas">
        <img src={logo} alt="Logo do Trashmap" className="logo" />
        <h1>Bem vindo ADM</h1>
      </div>

      <div className="Painel">
        {/* Botões Cadastrar */}
        <button
          className="painel-button cadastrar"
          onClick={() => (window.location.href = "/cadastro-rotas")}
        >
          <LiaRouteSolid size={60} className="button-icon" />
          <span>CADASTRAR ROTAS</span>
        </button>
        <button
          className="painel-button cadastrar"
          onClick={() => (window.location.href = "/cadastro-caminhao")}
        >
          <MdLocalShipping size={50} className="button-icon" />
          <span>CADASTRAR CAMINHÃO</span>
        </button>
        <button
          className="painel-button cadastrar"
          onClick={() => (window.location.href = "/cadastro-coleta")}
        >
          <MdAddLocationAlt size={50} className="button-icon" />
          <span>CADASTRAR PONTOS DE COLETA</span>
        </button>

        {/* Botões Gerenciar */}
        <button
          className="painel-button gerenciar"
          onClick={() => (window.location.href = "/gerenciamento-rotas")}
        >
          <div className="icon-wrapper">
            <LiaRouteSolid size={50} className="button-icon" />
            <MdEdit size={30} className="button-icon" />
          </div>
          <span>GERENCIAR ROTAS</span>
        </button>
        <button className="painel-button gerenciar">
          <div className="icon-wrapper">
            <FaGears size={30} className="button-icon" />
            <MdLocalShipping size={50} className="button-icon" />
          </div>
          <span>GERENCIAR CAMINHÕES</span>
        </button>
        <button className="painel-button gerenciar">
          <div className="icon-wrapper">
            <MdEditLocationAlt size={50} className="button-icon" />
          </div>
          <span>GERENCIAR PONTOS DE COLETA</span>
        </button>
      </div>
    </div>
  );
}

export default PaginaInicio;
