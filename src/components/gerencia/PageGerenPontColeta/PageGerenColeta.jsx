import React, { useState, useEffect } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import MapaADM from "../../mapas/MapaADM";
import { API_BASE_URL } from "../../../config/api";
import "./PageGerenColeta.css";

// Helper Address Parser
const parseAddressComponents = (components) => {
  let logradouro = "",
    numero = "",
    bairro = "",
    cidade = "",
    estado = "",
    cep = "";
  for (const component of components) {
    if (component.types.includes("route")) logradouro = component.long_name;
    else if (component.types.includes("street_number"))
      numero = component.long_name;
    else if (component.types.includes("sublocality"))
      bairro = component.long_name;
    else if (component.types.includes("locality")) cidade = component.long_name;
    else if (component.types.includes("administrative_area_level_1"))
      estado = component.short_name;
    else if (component.types.includes("postal_code")) cep = component.long_name;
  }
  return { logradouro, numero, bairro, cidade, estado, cep };
};

function PageGerenColeta() {
  const [listaPontos, setListaPontos] = useState([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [loading, setLoading] = useState(false);

  const [formEditar, setFormEditar] = useState({
    id: "",
    nome: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    listarPontos();
  }, []);

  async function listarPontos() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/pontos-de-coleta`);
      if (!res.ok) throw new Error("Erro ao listar");
      const data = await res.json();
      setListaPontos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function salvarEdicao() {
    if (!formEditar.id) return alert("Selecione um ponto para editar.");
    try {
      const payload = {
        nome: formEditar.nome,
        coordenadas: {
          latitude: parseFloat(formEditar.latitude),
          longitude: parseFloat(formEditar.longitude),
        },
      };

      const res = await fetch(
        `${API_BASE_URL}/pontos-de-coleta/${formEditar.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Erro ao atualizar");

      alert("Atualizado com sucesso!");
      listarPontos();
      limparForm();
    } catch (err) {
      alert("Erro: " + err.message);
    }
  }

  async function excluirPonto() {
    if (!formEditar.id) return alert("Selecione para excluir.");
    if (!window.confirm("Tem certeza?")) return;
    try {
      await fetch(`${API_BASE_URL}/pontos-de-coleta/${formEditar.id}`, {
        method: "DELETE",
      });
      listarPontos();
      limparForm();
    } catch (err) {
      alert("Erro ao excluir");
    }
  }

  const limparForm = () => {
    setFormEditar({ id: "", nome: "", latitude: "", longitude: "" });
  };

  // --- MAPA CLICK ---
  async function handleMapClick({ lat, lng }) {
    if (!lat || !lng) return;

    // Atualiza o form
    setFormEditar((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  }

  const selecionarPonto = (ponto) => {
    setFormEditar({
      id: ponto.id || ponto._id,
      nome: ponto.nome,
      latitude: ponto.coordenadas?.latitude || "",
      longitude: ponto.coordenadas?.longitude || "",
    });
  };

  const handleChange = (e) =>
    setFormEditar({ ...formEditar, [e.target.name]: e.target.value });

  const pontosFiltrados = listaPontos.filter((p) =>
    p.nome?.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const RightSideContent = (
    <div className="right-panel-split">
      <div className="top-section-table">
        <div className="header-box">
          <h2>Pontos Cadastrados</h2>
          <button
            className="btn-save"
            style={{ width: "auto", padding: "5px" }}
            onClick={listarPontos}
          >
            ↻
          </button>
        </div>
        <div className="table-wrapper-scroll">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Lat / Long</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    Carregando...
                  </td>
                </tr>
              ) : pontosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                    Nenhum ponto de coleta cadastrado
                  </td>
                </tr>
              ) : (
                pontosFiltrados.map((p, i) => (
                  <tr
                    key={i}
                    onClick={() => selecionarPonto(p)}
                    style={{ 
                      cursor: "pointer",
                      backgroundColor: formEditar.id === (p.id || p._id) ? "#e8f4ff" : "transparent"
                    }}
                  >
                    <td>{p.nome}</td>
                    <td style={{ fontSize: "0.85rem" }}>
                      {p.coordenadas?.latitude?.toFixed(4)},{" "}
                      {p.coordenadas?.longitude?.toFixed(4)}
                    </td>
                    <td>
                      <span className="status ativo">Ativo</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bottom-section-map" style={{ position: "relative" }}>
        <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
          <MapaADM 
            pontos={listaPontos} 
            onMapClick={handleMapClick} 
            containerHeight="100%"
            containerWidth="100%"
          />
        </div>
      </div>
    </div>
  );

  return (
    <ScreenLayout
      title="Gerenciamento de Pontos"
      rightContent={RightSideContent}
    >
      <div className="barra-busca-clean">
        <input
          className="input-busca-clean"
          placeholder="Buscar por Nome..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
        <button className="botao-busca-clean">🔍</button>
      </div>

      <div className="card-edit-form">
        <h3>
          {formEditar.id ? "Editar Ponto" : "Selecione ou Clique no Mapa"}
        </h3>

        <label>Nome</label>
        <input 
          name="nome" 
          value={formEditar.nome} 
          onChange={handleChange}
          placeholder="Nome do ponto de coleta"
        />

        <label>Latitude</label>
        <input
          name="latitude"
          value={formEditar.latitude}
          onChange={handleChange}
          placeholder="-12.9326"
        />

        <label>Longitude</label>
        <input
          name="longitude"
          value={formEditar.longitude}
          onChange={handleChange}
          placeholder="-38.5067"
        />

        <div className="button-group">
          <button className="btn-action btn-save" onClick={salvarEdicao}>
            Salvar
          </button>
          <button className="btn-action btn-delete" onClick={excluirPonto}>
            Deletar
          </button>
          <button
            className="btn-action btn-clear"
            onClick={limparForm}
            style={{ background: "#6c757d" }}
          >
            Limpar
          </button>
        </div>
        
        {formEditar.latitude && formEditar.longitude && (
          <div style={{ 
            marginTop: "15px", 
            padding: "10px", 
            backgroundColor: "#e8f4ff", 
            borderRadius: "5px",
            fontSize: "0.85rem"
          }}>
            📍 Localização selecionada: 
            <br />
            <strong>Lat:</strong> {formEditar.latitude}
            <br />
            <strong>Long:</strong> {formEditar.longitude}
          </div>
        )}
      </div>
    </ScreenLayout>
  );
}

export default PageGerenColeta;