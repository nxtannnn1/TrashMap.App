import React, { useState } from "react";
import ScreenLayout from "../../ScreenLayout/ScreenLayout";
import MapaADM from "../../mapas/MapaADM";
import { API_BASE_URL } from "../../../config/api";
import "./CadastroColeta.css";

function CadastroColeta() {
  // --- STATES ---
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    tipo: "RESIDENCIAL",
    capacidade: "",
    latitude: "",
    longitude: "",
    endereco: {
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: ""
    }
  });

  const [feedback, setFeedback] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [enderecoCompleto, setEnderecoCompleto] = useState("");

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Função para capturar o clique no mapa
  const handleMapClick = (latLng) => {
    setForm(prev => ({
      ...prev,
      latitude: latLng.lat.toString(),
      longitude: latLng.lng.toString()
    }));
    
    // Tenta buscar endereço a partir das coordenadas
    buscarEnderecoPorCoordenadas(latLng.lat, latLng.lng);
    
    // Feedback visual
    setFeedback({
      type: "success",
      msg: `Localização definida: ${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`
    });
  };

  // Função para buscar endereço usando Geocoding API
  const buscarEnderecoPorCoordenadas = async (lat, lng) => {
    if (!window.google) return;
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = { lat, lng };
      
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const endereco = results[0];
          setEnderecoCompleto(endereco.formatted_address);
          
          // Extrair componentes do endereço
          let logradouro = "", numero = "", bairro = "", cidade = "", estado = "", cep = "";
          
          endereco.address_components.forEach(component => {
            if (component.types.includes("route")) {
              logradouro = component.long_name;
            } else if (component.types.includes("street_number")) {
              numero = component.long_name;
            } else if (component.types.includes("sublocality") || component.types.includes("neighborhood")) {
              bairro = component.long_name;
            } else if (component.types.includes("locality")) {
              cidade = component.long_name;
            } else if (component.types.includes("administrative_area_level_1")) {
              estado = component.short_name;
            } else if (component.types.includes("postal_code")) {
              cep = component.long_name;
            }
          });
          
          setForm(prev => ({
            ...prev,
            endereco: {
              logradouro,
              numero,
              bairro,
              cidade,
              estado: estado.toUpperCase(),
              cep
            }
          }));
        }
      });
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  // --- FUNÇÃO DE CADASTRO ---
  const cadastrarPontoColeta = async () => {
    setFeedback({ type: "", msg: "" });

    // Validações
    if (!form.nome) {
      setFeedback({ type: "error", msg: "Informe o nome do ponto de coleta." });
      return;
    }

    if (!form.latitude || !form.longitude) {
      setFeedback({ type: "error", msg: "Selecione uma localização no mapa." });
      return;
    }

    // Validar estado (deve ser sigla válida como "SP", "RJ", etc.)
    if (!form.endereco.estado || form.endereco.estado.length !== 2) {
      setFeedback({ type: "error", msg: "Estado deve ser uma sigla de 2 letras (ex: SP, RJ)." });
      return;
    }

    // Validar CEP
    const cepRegex = /^\d{8}$|^\d{5}-\d{3}$/;
    if (form.endereco.cep && !cepRegex.test(form.endereco.cep)) {
      setFeedback({ type: "error", msg: "CEP inválido. Use o formato 12345678 ou 12345-678." });
      return;
    }

    setLoading(true);

    try {
      const latitude = parseFloat(form.latitude);
      const longitude = parseFloat(form.longitude);

      const payload = {
        nome: form.nome,
        descricao: form.descricao || "",
        tipo: form.tipo,
        capacidade: form.capacidade ? parseInt(form.capacidade) : 0,
        coordenadas: {
          latitude: latitude,
          longitude: longitude
        },
        endereco: {
          logradouro: form.endereco.logradouro || "",
          numero: form.endereco.numero || "",
          bairro: form.endereco.bairro || "",
          cidade: form.endereco.cidade || "",
          estado: form.endereco.estado.toUpperCase(),
          cep: form.endereco.cep || "",
          complemento: form.endereco.complemento || "",
          coordenadas: {
            latitude: latitude,
            longitude: longitude
          }
        },
        status: "ATIVO"
      };

      console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2));

      const res = await fetch(`${API_BASE_URL}/pontos-de-coleta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log("📥 Status da resposta:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Erro da API:", errorText);
        throw new Error(`Erro ${res.status}: ${errorText}`);
      }

      const resultado = await res.json();
      console.log("✅ Ponto cadastrado:", resultado);

      setFeedback({ 
        type: "success", 
        msg: `Ponto de coleta "${form.nome}" cadastrado com sucesso! ID: ${resultado.id}` 
      });

      // Limpar formulário
      setForm({
        nome: "",
        descricao: "",
        tipo: "RESIDENCIAL",
        capacidade: "",
        latitude: "",
        longitude: "",
        endereco: {
          logradouro: "",
          numero: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: ""
        }
      });
      setEnderecoCompleto("");

    } catch (error) {
      setFeedback({ 
        type: "error", 
        msg: `Erro: ${error.message || "Falha ao cadastrar ponto de coleta"}` 
      });
    } finally {
      setLoading(false);
    }
  };

  // Limpar feedback após 5 segundos
  React.useEffect(() => {
    if (feedback.msg) {
      const timer = setTimeout(() => {
        setFeedback({ type: "", msg: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback.msg]);

  // --- CONTEÚDO DIREITA (Mapa) ---
  const RightSideContent = (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Feedback Overlay */}
      {feedback.msg && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: feedback.type === "error" ? "#f8d7da" : "#d4edda",
            border: feedback.type === "error" ? "1px solid #dc3545" : "1px solid #28a745",
            color: feedback.type === "error" ? "#721c24" : "#155724",
            fontWeight: "bold",
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
          {feedback.type === "error" ? "❌ " : "✅ "}{feedback.msg}
        </div>
      )}

      <MapaADM
        onMapClick={handleMapClick}
        pontos={[]}
        mode="COLETA"
        containerHeight="100%"
        containerWidth="100%"
      />

      {/* Instrução sobre o clique no mapa */}
      {!form.latitude && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            padding: "10px 15px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            borderRadius: "5px",
            fontSize: "0.85rem",
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          💡 <strong>Clique no mapa</strong> para definir a localização do ponto de coleta
        </div>
      )}

      {/* Mostrar coordenadas selecionadas */}
      {form.latitude && form.longitude && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "10px",
            zIndex: 999,
            padding: "8px 12px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "5px",
            fontSize: "0.8rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            border: "1px solid #4CAF50"
          }}
        >
          <div style={{ fontWeight: "bold", color: "#0A3B1A", marginBottom: "3px" }}>
            🗺️ Localização selecionada
          </div>
          <div style={{ fontFamily: "monospace" }}>
            Lat: {parseFloat(form.latitude).toFixed(6)}
            <br />
            Long: {parseFloat(form.longitude).toFixed(6)}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ScreenLayout title="Cadastro de Ponto de Coleta" rightContent={RightSideContent}>
      {/* Formulário na Esquerda */}
      <div className="card-form">
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: "20px", 
          color: "#036b1a",
          textAlign: "center",
          borderBottom: "1px solid #eee",
          paddingBottom: "10px"
        }}>
          Dados do Ponto de Coleta
        </h3>

        <label>Nome do Ponto*</label>
        <input
          name="nome"
          type="text"
          placeholder="Ex: Coleta Residencial Centro"
          value={form.nome}
          onChange={handleChange}
          required
        />

        <label>Descrição</label>
        <textarea
          name="descricao"
          placeholder="Descreva o ponto de coleta..."
          value={form.descricao}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            minHeight: "80px",
            resize: "vertical",
            fontFamily: "inherit",
            fontSize: "0.95rem"
          }}
        />

        <label>Tipo de Coleta</label>
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
        >
          <option value="RESIDENCIAL">Residencial</option>
          <option value="COMERCIAL">Comercial</option>
          <option value="INDUSTRIAL">Industrial</option>
          <option value="PUBLICO">Público</option>
          <option value="ESPECIAL">Especial</option>
        </select>

        <label>Capacidade (Litros)</label>
        <input
          name="capacidade"
          type="number"
          placeholder="Ex: 1000"
          value={form.capacidade}
          onChange={handleChange}
          min="0"
          step="10"
        />

        <label style={{ marginTop: "15px", color: "#495057", fontWeight: "bold" }}>
          📍 Localização
        </label>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "10px",
          marginBottom: "10px"
        }}>
          <div>
            <label style={{ fontSize: "0.85rem" }}>Latitude*</label>
            <input
              name="latitude"
              type="text"
              placeholder="-12.9326"
              value={form.latitude}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: "0.85rem" }}>Longitude*</label>
            <input
              name="longitude"
              type="text"
              placeholder="-38.5067"
              value={form.longitude}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Dados do Endereço */}
        <div style={{ 
          marginTop: "15px", 
          padding: "12px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "5px",
          border: "1px solid #e9ecef"
        }}>
          <label style={{ display: "block", marginBottom: "10px", color: "#495057" }}>
            📍 Endereço (Opcional - preenchido automaticamente)
          </label>
          
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "0.85rem" }}>Logradouro*</label>
              <input
                name="endereco.logradouro"
                type="text"
                placeholder="Rua, Avenida, etc."
                value={form.endereco.logradouro}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem" }}>Número</label>
              <input
                name="endereco.numero"
                type="text"
                placeholder="Nº"
                value={form.endereco.numero}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "0.85rem" }}>Bairro*</label>
              <input
                name="endereco.bairro"
                type="text"
                placeholder="Bairro"
                value={form.endereco.bairro}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem" }}>CEP*</label>
              <input
                name="endereco.cep"
                type="text"
                placeholder="00000-000 ou 00000000"
                value={form.endereco.cep}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "0.85rem" }}>Cidade*</label>
              <input
                name="endereco.cidade"
                type="text"
                placeholder="Cidade"
                value={form.endereco.cidade}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem" }}>Estado (UF)*</label>
              <input
                name="endereco.estado"
                type="text"
                placeholder="UF (ex: SP, RJ)"
                value={form.endereco.estado}
                onChange={handleChange}
                maxLength="2"
                style={{ textTransform: "uppercase" }}
                required
              />
            </div>
          </div>

          {/* Complemento */}
          <div style={{ marginTop: "10px" }}>
            <label style={{ fontSize: "0.85rem" }}>Complemento</label>
            <input
              name="endereco.complemento"
              type="text"
              placeholder="Apto, Bloco, etc."
              value={form.endereco.complemento || ""}
              onChange={(e) => setForm(prev => ({
                ...prev,
                endereco: { ...prev.endereco, complemento: e.target.value }
              }))}
            />
          </div>
        </div>

        {form.latitude && form.longitude && (
          <div style={{ 
            marginTop: "10px", 
            padding: "8px", 
            backgroundColor: "#e8f5e9", 
            borderRadius: "5px",
            fontSize: "0.85rem",
            color: "#2e7d32",
            border: "1px solid #c8e6c9"
          }}>
            ✅ Localização selecionada no mapa
          </div>
        )}

        <small style={{ marginTop: "15px", color: "#6c757d", fontSize: "0.8rem", display: "block" }}>
          * Campos obrigatórios. Clique no mapa para definir a localização.<br/>
          Estado deve ser sigla de 2 letras (ex: SP, RJ). CEP: 12345678 ou 12345-678.
        </small>
      </div>

      <button
        className="btn-success"
        onClick={cadastrarPontoColeta}
        disabled={loading || !form.nome || !form.latitude || !form.longitude || 
                 !form.endereco.logradouro || !form.endereco.bairro || 
                 !form.endereco.cidade || !form.endereco.estado || !form.endereco.cep}
        style={{
          opacity: (loading || !form.nome || !form.latitude || !form.longitude || 
                   !form.endereco.logradouro || !form.endereco.bairro || 
                   !form.endereco.cidade || !form.endereco.estado || !form.endereco.cep) ? 0.6 : 1,
          cursor: (loading || !form.nome || !form.latitude || !form.longitude || 
                  !form.endereco.logradouro || !form.endereco.bairro || 
                  !form.endereco.cidade || !form.endereco.estado || !form.endereco.cep) ? "not-allowed" : "pointer",
          marginTop: "20px"
        }}
      >
        {loading ? (
          <>
            <span style={{ display: "inline-block", marginRight: "8px" }}>
              <div style={{
                width: "16px",
                height: "16px",
                border: "2px solid white",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 1s linear infinite"
              }}></div>
            </span>
            Cadastrando...
          </>
        ) : (
          "Cadastrar Ponto de Coleta"
        )}
      </button>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ScreenLayout>
  );
}

export default CadastroColeta;