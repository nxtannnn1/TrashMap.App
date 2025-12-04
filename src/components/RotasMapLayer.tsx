// src/components/map/RotasMapLayer.tsx
import React from "react";
import MapViewDirections from "react-native-maps-directions";
import { Rota } from "@/src/Types";

// Coloque sua chave aqui (ou idealmente num arquivo .env)
const GOOGLE_MAPS_APIKEY = "SUA_CHAVE_API_DO_GOOGLE_AQUI";

interface Props {
  rotas: Rota[];
}

export const RotasMapLayer: React.FC<Props> = ({ rotas }) => {
  return (
    <>
      {rotas.map((rota) => {
        // Validação de segurança: precisamos de pelo menos 2 pontos
        if (!rota.coordenadas || rota.coordenadas.length < 2) return null;

        const pontoInicial = rota.coordenadas[0];
        const pontoFinal = rota.coordenadas[1];

        return (
          <MapViewDirections
            key={rota.id}
            origin={pontoInicial}
            destination={pontoFinal}
            apikey={GOOGLE_MAPS_APIKEY}
            // Configurações visuais
            strokeWidth={4}
            strokeColor={rota.cor || "#1E603A"} // Verde padrão se não tiver cor
            // Otimização para caminhões de lixo (usar ruas)
            mode="DRIVING"
            // Tratamento de erros (opcional)
            onError={(errorMessage) => {
              console.log("Erro ao traçar rota:", errorMessage);
            }}
          />
        );
      })}
    </>
  );
};

export default RotasMapLayer;
