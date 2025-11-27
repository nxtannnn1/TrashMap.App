import "./style.css";
import logo from "../../../assets/svg/Logo.svg";

function CadastroCaminhão() {
  return (
    <div className="container-cad-caminhao">
      <div className="card-cadastro">
        <img src={logo} alt="Logo do Trashmap" className="logo" />
        <h1>Cadastro de Caminhão</h1>
        <div className="div-form-cad-caminhao">
          <label>Placa:</label>
          <input type="text" placeholder="Digite a placa do caminhão" />
          <label>Modelo:</label>
          <input type="text" placeholder="Digite o modelo do caminhão" />
          <label>Status:</label>
          <select name="statusCaminhao">
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
            <option value="EM_MANUTENCAO">EM MANUTENCAO</option>
          </select>
          <label>Localização Atual:</label>
          <input name="latitude" placeholder="Latitude" />
          <input name="longitude" placeholder="Longitude" />
          <button>Cadastrar</button>
        </div>
      </div>
      <div className="container-tabela">
        <div className="tabela-caminhoes">
          <h2>Caminhões Cadastrados</h2>
          <table>
            <thead>
              <tr>
                <th>Placa</th>
                <th>Modelo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ABC-1234</td>
                <td>Volvo FH 540</td>
                <td>Em Viagem</td>
              </tr>
              <tr>
                <td>XYZ-9876</td>
                <td>Scania R 450</td>
                <td>Disponível</td>
              </tr>
              <tr>
                <td>DEF-5678</td>
                <td>Mercedes-Benz Actros</td>
                <td>Manutenção</td>
              </tr>
              <tr>
                <td>GHI-0102</td>
                <td>Ford Cargo 2429</td>
                <td>Em Viagem</td>
              </tr>
              <tr>
                <td>JKL-3344</td>
                <td>DAF XF 105</td>
                <td>Disponível</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CadastroCaminhão;
