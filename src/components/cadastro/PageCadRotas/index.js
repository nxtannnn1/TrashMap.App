import react from "react";
import "./styles.css";
import logo from "../../../assets/svg/Logo.svg";

function formularioCadastroRotas() {
  return (
    <div className="container-cad-rotas">
      <div className="page-cad-rotas">
        <img src={logo} alt="Logo do Trashmap" className="logo" />
        <h1>Cadastro de Rotas</h1>
        <div className="formularioCadastroRota">
          <div className="cardInfoRota">
            <p>Nome da Rota</p>
            <input type="text" placeholder="Digite o nome da rota" />
            <p>Descrição</p>
            <input type="text" placeholder="Digite a descrição da rota" />
          </div>
          <div className="CardIniFim">
            <div className="card">
              <h4>Ponto inicial</h4>
              <div>
                <input type="text" placeholder="Digite o ponto inicial" />
                <p>Latitude</p>
                <input type="text" placeholder="Digite a latitude" />
                <p>Longitude</p>
                <input type="text" placeholder="Digite a longitude" />
              </div>
            </div>
            <div className="card">
              <h4>Ponto Final</h4>
              <div>
                <input type="text" placeholder="Digite o ponto final" />
                <p>Latitude</p>
                <input type="text" placeholder="Digite a latitude" />
                <p>Longitude</p>
                <input type="text" placeholder="Digite a longitude" />
              </div>
            </div>
          </div>
        </div>
        <button>Cadastrar Rota</button>
      </div>
      <div className="container-map">
        <h1>SIMULADOR DE MAPA</h1>
      </div>
    </div>
  );
}

export default formularioCadastroRotas;
