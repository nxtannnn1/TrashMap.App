import React, { useState, useEffect } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import MapaSimulacao from "../../mapas/MapaSimulacao"; // Reutilizando o mapa de rotas
import { API_BASE_URL } from "../../../config/api";
import "./GerenciadorRotas.css";

const GerenciadorRotas = () => {
  // --- STATES ---
  const [listaRotas, setListaRotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  // Form de Edição (Nome + Ponto A + Ponto B)
const [form, setForm] = useState({
  id: "",
  nome: "",
  pontoDeColetaId: "",
  latA: "",
  lngA: "",
  latB: "",
  lngB: "",
});


  // --- EFEITOS ---
  useEffect(() => {
    listarRotas();
  }, []);

  // --- API ---
  async function listarRotas() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/rotas`);
      if (!res.ok) throw new Error("Erro ao listar rotas");
      const data = await res.json();
      setListaRotas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function salvarRota() {
    if (!form.nome || !form.latA || !form.latB) {
      return alert("Preencha Nome, Origem e Destino.");
    }

    // Monta payload no formato que o backend espera (array de coordenadas)
   const payload = {
  pontoDeColetaId: Number(form.pontoDeColetaId),
  nome: form.nome,
  coordenadas: [
    { latitude: parseFloat(form.latA), longitude: parseFloat(form.lngA) },
    { latitude: parseFloat(form.latB), longitude: parseFloat(form.lngB) },
  ],
};


    try {
      const url = form.id
        ? `${API_BASE_URL}/rotas/${form.id}`
        : `${API_BASE_URL}/rotas`;
      const method = form.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao salvar rota");

      alert("Rota salva com sucesso!");
      limparForm();
      listarRotas();
    } catch (error) {
      alert("Erro: " + error.message);
    }
  }

  async function deletarRota() {
    if (!form.id) return alert("Selecione uma rota para deletar.");
    if (!window.confirm("Tem certeza?")) return;

    try {
      await fetch(`${API_BASE_URL}/rotas/${form.id}`, { method: "DELETE" });
      listarRotas();
      limparForm();
    } catch (error) {
      alert("Erro ao deletar");
    }
  }

  // --- HANDLERS ---
  const limparForm = () => {
    setForm({ id: "", nome: "", latA: "", lngA: "", latB: "", lngB: "" });
  };

  const selecionarRota = (rota) => {
    // Tenta extrair Ponto A (índice 0) e Ponto B (índice 1) do array de coordenadas
    const pontoA = rota.coordenadas?.[0] || {};
    const pontoB = rota.coordenadas?.[1] || {};

    setForm({
      id: rota.id || rota._id,
      nome: rota.nome,
      latA: pontoA.latitude || "",
      lngA: pontoA.longitude || "",
      latB: pontoB.latitude || "",
      lngB: pontoB.longitude || "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Lógica simples de clique no mapa para preencher inputs (Alterna entre A e B)
  const handleMapClick = (latLng) => {
    // Se A está vazio, preenche A. Se A tem valor, preenche B.
    if (!form.latA) {
      setForm((prev) => ({ ...prev, latA: latLng.lat, lngA: latLng.lng }));
    } else {
      setForm((prev) => ({ ...prev, latB: latLng.lat, lngB: latLng.lng }));
    }
  };

  // Filtro
  const rotasFiltradas = listaRotas.filter(
    (r) =>
      r.nome?.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (r.id && r.id.toString().includes(termoBusca))
  );

  // Objetos auxiliares para o MapaSimulacao renderizar os pontos visualmente
  const visualPontoA =
    form.latA && form.lngA
      ? { lat: parseFloat(form.latA), lng: parseFloat(form.lngA) }
      : { lat: "", lng: "" };
  const visualPontoB =
    form.latB && form.lngB
      ? { lat: parseFloat(form.latB), lng: parseFloat(form.lngB) }
      : { lat: "", lng: "" };

  // --- RENDER ---
  const RightSideContent = (
    <div className="right-panel-split">
      {/* Tabela */}
      <div className="top-section-table">
        <div className="header-box">
          <h2>Rotas Cadastradas</h2>
          <button
            className="btn-save"
            style={{ width: "auto", padding: "5px" }}
            onClick={listarRotas}
          >
            ↻
          </button>
        </div>
        <div className="table-wrapper-scroll">
          <table>
            <thead>
              <tr>
                <th>Nome/ID</th>
                <th>Origem (Lat)</th>
                <th>Destino (Lat)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rotasFiltradas.map((rota, i) => (
                <tr
                  key={i}
                  onClick={() => selecionarRota(rota)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{rota.nome}</td>
                  <td>{rota.coordenadas?.[0]?.latitude?.toFixed(4)}...</td>
                  <td>{rota.coordenadas?.[1]?.latitude?.toFixed(4)}...</td>
                  <td>
                    <span style={{ fontSize: "0.8rem" }}>✏️ Editar</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mapa */}
      <div className="bottom-section-map" style={{ position: "relative" }}>
        <div style={{ width: "100%", height: "100%" }}>
          {/* Usamos o MapaSimulacao pois ele desenha linhas entre A e B */}
          <MapaSimulacao
            pontoA={visualPontoA}
            pontoB={visualPontoB}
            onMapClick={handleMapClick}
            // Passamos null em rota calculada para ele mostrar só os marcadores A e B por enquanto,
            // ou você pode implementar a logica de rota completa aqui se quiser.
            pontosRota={[]}
            posicaoCaminhao={null}
          />
        </div>
      </div>
    </div>
  );

  return (
    <ScreenLayout title="Gerenciador de Rotas" rightContent={RightSideContent}>
      {/* Busca */}
      <div className="barra-busca-clean">
        <input
          type="text"
          className="input-busca-clean"
          placeholder="Pesquise por Nome ou ID"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
        />
        <button className="botao-busca-clean">🔍</button>
      </div>

      {/* Form Edição */}
      <div className="card-edit-form">
        <h3>{form.id ? "Editar Rota" : "Nova Rota"}</h3>

        <label>Nome da Rota</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Ex: Rota Centro-Norte"
        />

        <div className="coord-group">
          <label style={{ fontSize: "0.85rem", color: "#036b1a" }}>
            Ponto A (Origem)
          </label>
          <input
            name="latA"
            value={form.latA}
            onChange={handleChange}
            placeholder="Lat A"
            style={{ marginBottom: "5px" }}
          />
          <input
            name="lngA"
            value={form.lngA}
            onChange={handleChange}
            placeholder="Lng A"
          />
        </div>

        <div className="coord-group" style={{ marginTop: "10px" }}>
          <label style={{ fontSize: "0.85rem", color: "#036b1a" }}>
            Ponto B (Destino)
          </label>
          <input
            name="latB"
            value={form.latB}
            onChange={handleChange}
            placeholder="Lat B"
            style={{ marginBottom: "5px" }}
          />
          <input
            name="lngB"
            value={form.lngB}
            onChange={handleChange}
            placeholder="Lng B"
          />
        </div>

        <div className="button-group">
          <button className="btn-action btn-save" onClick={salvarRota}>
            Salvar
          </button>
          <button className="btn-action btn-delete" onClick={deletarRota}>
            Deletar
          </button>
          <button
            className="btn-action btn-clear"
            onClick={limparForm}
            style={{ background: "#6c757d" }}
          >
            Novo
          </button>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default GerenciadorRotas;
