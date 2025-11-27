import "./style.css";
import logo from "../../../assets/svg/Logo.svg";

function CadastroColeta() {
    return (
      <div className="container-cad-pont-coleta">
        <div className="page-cad-pont-coleta">
          <img src={logo} alt="Logo do Trashmap" className="logo" />
          <h1>Cadastro de Pontos de Coleta</h1>
          <div className="formularioCadastroPontColeta">
            <div className="cardInfoPontColeta">
              <label>Nome do Ponto de Coleta:</label>
              <input
                type="text"
                placeholder="Digite o nome do ponto de coleta"
              />
              <label>Endereço:</label>
              <input
                type="text"
                placeholder="Digite o endereço do ponto de coleta"
              />
              <label>Latitude</label>
              <input type="text" placeholder="Digite a latitude" />
              <label>Longitude</label>
              <input type="text" placeholder="Digite a longitude" />
              <label>Tipos de Resíduos Aceitos:</label>
              <input
                type="text"
                placeholder="Liste os tipos de resíduos aceitos"
              />
            </div>
              <button className="btnCadastrarPontColeta">
                Cadastrar Ponto de Coleta
              </button>
          </div>
        </div>
        <div className="container-map">
          <h1>SIMULADOR DE MAPA</h1>
        </div>
      </div>
    );
};

export default CadastroColeta;
    