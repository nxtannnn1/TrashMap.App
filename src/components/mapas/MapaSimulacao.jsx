import React, { useCallback, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
} from "@react-google-maps/api";

// --- CORREÇÃO 1: Definir bibliotecas FORA do componente ---
// Isso impede que o React ache que mudou a configuração e tente recarregar
const LIBRARIES = ["places", "geometry"];

const containerStyle = {
  width: "100%", // Ajustado para 100% para preencher o painel do ScreenLayout
  height: "100%",
  borderRadius: "15px",
};

const MapaSimulacao = ({
  onMapClick,
  pontoA,
  pontoB,
  pontosRota = [],
  posicaoCaminhao = null,
  pontosDeColeta = [],
  centro = { lat: -12.931, lng: -38.507 },
}) => {
  // --- CORREÇÃO 2: Usar o mesmo ID do MapaADM ---
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script", // ID Padronizado
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES, // Referência constante
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) return <div>Carregando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={posicaoCaminhao || centro}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        gestureHandling: "greedy", // Melhora a rolagem
        mapId: "f920ced75bc6f2eee7969c92", // (Opcional) ID do estilo do mapa, se tiver
      }}
      onClick={(e) =>
        onMapClick &&
        onMapClick({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        })
      }
    >
      {/* Marcadores dos PONTOS DE COLETA */}
      {pontosDeColeta.map((ponto) => {
        const coords = ponto.endereco?.coordenadas || ponto.coordenadas;
        // Validação extra para garantir que são números
        const lat = parseFloat(coords?.latitude);
        const lng = parseFloat(coords?.longitude);

        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker
            key={ponto.id}
            position={{ lat, lng }}
            icon={{
              url: "/icons/trash-bin.png", // Certifique-se que essa imagem existe na pasta public
              scaledSize: new window.google.maps.Size(25, 25),
            }}
            title={`${ponto.nome}`}
          />
        );
      })}

      {/* Marcador do CAMINHÃO em movimento */}
      {posicaoCaminhao && (
        <Marker
          position={posicaoCaminhao}
          icon={{
            url: "/icons/garbage-truck.png", // Certifique-se que essa imagem existe
            scaledSize: new window.google.maps.Size(40, 40),
          }}
          title="Caminhão em Movimento"
          zIndex={999} // Garante que o caminhão fique por cima
        />
      )}

      {/* Marcador Ponto A */}
      {pontoA?.lat && pontoA?.lng && (
        <Marker
          position={{
            lat: parseFloat(pontoA.lat),
            lng: parseFloat(pontoA.lng),
          }}
          label="A"
          title="Ponto A"
        />
      )}

      {/* Marcador Ponto B */}
      {pontoB?.lat && pontoB?.lng && (
        <Marker
          position={{
            lat: parseFloat(pontoB.lat),
            lng: parseFloat(pontoB.lng),
          }}
          label="B"
          title="Ponto B"
        />
      )}

      {/* Linha da rota */}
      {pontosRota.length > 0 && (
        <Polyline
          path={pontosRota}
          options={{
            strokeColor: "#1E90FF",
            strokeWeight: 4,
            strokeOpacity: 0.8,
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapaSimulacao;
