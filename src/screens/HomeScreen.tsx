import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  StatusBar,
  Alert,
  TouchableOpacity,
  FlatList, // Componente que garante o Scroll (Rolagem)
} from "react-native";
import { useRouter } from "expo-router";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

// Contextos e Serviços
import { useAuth } from "@/src/contexts/AuthContext";
import api from "@/src/services/api";
import { Rota, MapMarker, Geopoint } from "@/src/Types";
// @ts-ignore
import { GOOGLE_MAPS_API_KEY as ENV_KEY } from "@env";

// Componentes
import CustomBottomSheet, {
  BottomSheetHandle,
} from "@/src/components/CustomBottomSheet";
import SearchBar from "@/src/components/ui/searchBar";

// --- CONFIGURAÇÃO GOOGLE API ---
const GOOGLE_API_KEY = ENV_KEY;

// --- CONSTANTES VISUAIS ---
const SENAI_LOCATION = {
  latitude: -12.9326,
  longitude: -38.5067,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

const COLORS = {
  TRASH_BG: "#0A3B1A",
  TRUCK_BG: "#28a745",
  BORDER: "#FFFFFF",
  CARD_BG: "#FFFFFF",
  TEXT_PRIMARY: "#333333",
  TEXT_SECONDARY: "#666666",
};

// --- DADOS MOCKADOS (Aumentei a lista para testar o SCROLL) ---
const MOCK_ROTAS: Rota[] = [
  {
    id: "mock-1",
    nome: "Rota SENAI (Demo)",
    pontoDeColetaId: 1,
    coordenadas: [
      { latitude: -12.9326, longitude: -38.5067 },
      { latitude: -12.935, longitude: -38.508 },
      { latitude: -12.938, longitude: -38.505 },
    ],
  },
  {
    id: "mock-2",
    nome: "Rota Bonfim (Demo)",
    pontoDeColetaId: 2,
    coordenadas: [
      { latitude: -12.925, longitude: -38.5 },
      { latitude: -12.928, longitude: -38.502 },
    ],
  },
  {
    id: "mock-3",
    nome: "Rota Ribeira (Demo)",
    pontoDeColetaId: 1,
    coordenadas: [
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 0 },
    ],
  },
  {
    id: "mock-4",
    nome: "Rota Comércio (Demo)",
    pontoDeColetaId: 1,
    coordenadas: [
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 0 },
    ],
  },
  {
    id: "mock-5",
    nome: "Rota Barra (Demo)",
    pontoDeColetaId: 1,
    coordenadas: [
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 0 },
    ],
  },
];

const MOCK_MARKERS: MapMarker[] = [
  {
    id: "m1",
    latitude: -12.9326,
    longitude: -38.5067,
    titulo: "Lixeira SENAI",
  },
  { id: "m2", latitude: -12.938, longitude: -38.505, titulo: "Lixeira Bonfim" },
];

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const bottomSheetRef = useRef<BottomSheetHandle | null>(null);
  const mapRef = useRef<MapView>(null);

  // --- ESTADOS ---
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // --- ESTADOS VISUAIS ---
  const [routeStart, setRouteStart] = useState<Geopoint | null>(null);
  const [routeEnd, setRouteEnd] = useState<Geopoint | null>(null);

  // --- ESTADOS DA SIMULAÇÃO ---
  const [simulatedPath, setSimulatedPath] = useState<Geopoint[]>([]);
  const [truckLocation, setTruckLocation] = useState<Geopoint | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // --- 1. BUSCAR DADOS DO BACKEND ---
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        const [resRotas, resPontos] = await Promise.all([
          api.get("/rotas"),
          api.get("/pontos-de-coleta"),
        ]);

        const listaRotas = resRotas.data.content
          ? resRotas.data.content
          : resRotas.data;
        const listaPontos = resPontos.data.content
          ? resPontos.data.content
          : resPontos.data;

        setRotas(Array.isArray(listaRotas) ? listaRotas : []);

        const pontosFormatados = Array.isArray(listaPontos)
          ? listaPontos
              .map((p: any) => ({
                id: p.id.toString(),
                latitude: p.latitude ?? p.endereco?.latitude,
                longitude: p.longitude ?? p.endereco?.longitude,
                titulo: p.nome,
                descricao: "Ponto de Coleta",
              }))
              .filter((p: any) => p.latitude && p.longitude)
          : [];

        setMarkers(pontosFormatados);
      } catch (err: any) {
        setRotas(MOCK_ROTAS);
        setMarkers(MOCK_MARKERS);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  // --- 2. MOTOR DE ANIMAÇÃO ---
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSimulating && simulatedPath.length > 0) {
      interval = setInterval(() => {
        setStepIndex((prev) => {
          const next = prev + 1;
          if (next >= simulatedPath.length) {
            setIsSimulating(false);
            return prev;
          }
          setTruckLocation(simulatedPath[next]);
          return next;
        });
      }, 300); // <--- ALTERADO: 300ms para o caminhão andar mais devagar
    }
    return () => clearInterval(interval);
  }, [isSimulating, simulatedPath]);

  // --- 3. UTILITÁRIOS: DECODIFICAR GOOGLE POLYLINE ---
  const decodePolyline = (encoded: string) => {
    const poly = [];
    let index = 0,
      len = encoded.length;
    let lat = 0,
      lng = 0;
    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;
      poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return poly;
  };

  const generateSmoothPath = (
    start: Geopoint,
    end: Geopoint,
    numSteps: number
  ) => {
    const path = [];
    for (let i = 0; i <= numSteps; i++) {
      const ratio = i / numSteps;
      path.push({
        latitude: start.latitude + (end.latitude - start.latitude) * ratio,
        longitude: start.longitude + (end.longitude - start.longitude) * ratio,
      });
    }
    return path;
  };

  // --- 4. CONSULTA SILENCIOSA AO GOOGLE ---
  const fetchGoogleRoute = async (start: Geopoint, end: Geopoint) => {
    if (!GOOGLE_API_KEY) {
      console.log(
        "⚠️ Chave Google não configurada. Usando fallback (Linha Reta)."
      );
      return generateSmoothPath(start, end, 80);
    }

    try {
      setLoadingRoute(true);
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=${GOOGLE_API_KEY}&mode=driving`;

      console.log("🔍 Consultando Google Directions:", url);

      const resp = await fetch(url);
      const respJson = await resp.json();

      if (respJson.status !== "OK") {
        console.error(
          "❌ Erro Google API:",
          respJson.status,
          respJson.error_message
        );
        throw new Error(`Erro API: ${respJson.status}`);
      }

      if (respJson.routes.length > 0) {
        console.log(
          "✅ Rota real encontrada! Pontos:",
          respJson.routes[0].overview_polyline.points.length
        );
        return decodePolyline(respJson.routes[0].overview_polyline.points);
      } else {
        throw new Error("Google não encontrou rota.");
      }
    } catch (error) {
      console.error("⚠️ Falha na rota inteligente. Usando linha reta.", error);
      return generateSmoothPath(start, end, 80);
    } finally {
      setLoadingRoute(false);
    }
  };

  // --- 5. AÇÃO DE SELECIONAR ROTA ---
  const handleSelectRoute = async (rota: Rota) => {
    if (!rota.coordenadas || rota.coordenadas.length < 2) {
      Alert.alert("Aviso", "Rota sem coordenadas definidas.");
      return;
    }

    bottomSheetRef.current?.close();
    setSimulatedPath([]);
    setTruckLocation(null);

    const pontoA = rota.coordenadas[0];
    const pontoB = rota.coordenadas[rota.coordenadas.length - 1];

    setRouteStart(pontoA);
    setRouteEnd(pontoB);

    mapRef.current?.animateToRegion(
      {
        latitude: pontoA.latitude,
        longitude: pontoA.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      1000
    );

    const realPath = await fetchGoogleRoute(pontoA, pontoB);

    setSimulatedPath(realPath);
    setTruckLocation(realPath[0]);
    setStepIndex(0);
    setIsSimulating(true);
  };

  const handleRecenter = () => {
    mapRef.current?.animateToRegion(SENAI_LOCATION, 1000);
  };

  // --- LÓGICA DE FILTRO ---
  const filteredRotas = rotas.filter((rota) =>
    rota.nome.toLowerCase().includes(searchText.toLowerCase())
  );

  // --- RENDERIZAÇÃO DO ITEM DA LISTA ---
  const renderRouteItem = ({ item }: { item: Rota }) => {
    const tempoEstimado = item.coordenadas
      ? Math.ceil(item.coordenadas.length * 1.5) + 10
      : 15;

    return (
      <TouchableOpacity
        style={Styles.cardItem}
        onPress={() => handleSelectRoute(item)}
        activeOpacity={0.7}
      >
        <View style={Styles.cardHeader}>
          <View style={Styles.iconContainer}>
            <FontAwesome5 name="route" size={20} color="white" />
          </View>
          <View style={Styles.textContainer}>
            <Text style={Styles.cardTitle} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={Styles.cardSubtitle} numberOfLines={1}>
              {item.descricao || "Coleta regular"}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#ccc" />
        </View>

        <View style={Styles.cardFooter}>
          <View style={Styles.badge}>
            <MaterialIcons name="access-time" size={14} color="#555" />
            <Text style={Styles.badgeText}>~{tempoEstimado} min</Text>
          </View>
          <View style={[Styles.badge, { backgroundColor: "#e3f2fd" }]}>
            <MaterialIcons name="place" size={14} color="#1565c0" />
            <Text style={[Styles.badgeText, { color: "#1565c0" }]}>
              {item.coordenadas?.length || 0} pontos
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // --- RENDERIZAÇÃO DO BOTTOM SHEET ---
  const renderBottomSheetContent = () => {
    if (loading)
      return (
        <ActivityIndicator
          size="large"
          color="#1E603A"
          style={{ marginTop: 20 }}
        />
      );
    return (
      <>
        <View style={Styles.viewPesquisa}>
          <SearchBar
            onChangeText={setSearchText}
            value={searchText}
          />
        </View>
        <View style={Styles.viewRotas}>
          {/* FlatList GARANTE o Scroll se a lista for grande */}
          <FlatList
            data={filteredRotas}
            renderItem={renderRouteItem}
            keyExtractor={(item) => item.id.toString()}
            // contentContainerStyle com paddingBottom generoso para não cortar o último item
            contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}
            showsVerticalScrollIndicator={true} // Habilita barra de rolagem visual
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", color: "#999", marginTop: 20 }}
              >
                Nenhuma rota encontrada.
              </Text>
            }
          />
        </View>
      </>
    );
  };

  return (
    <View style={Styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={Styles.MapContainer}>
        <MapView
          ref={mapRef}
          style={Styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={SENAI_LOCATION}
          showsUserLocation={true}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.titulo}
            >
              <View style={Styles.trashMarker}>
                <View style={Styles.trashInner}>
                  <View
                    style={{
                      width: 6,
                      height: 8,
                      backgroundColor: "white",
                      borderRadius: 1,
                    }}
                  />
                </View>
              </View>
            </Marker>
          ))}

          {routeStart && (
            <Marker coordinate={routeStart} title="Início" pinColor="teal" />
          )}

          {routeEnd && (
            <Marker coordinate={routeEnd} title="Fim" pinColor="red" />
          )}

          {simulatedPath.length > 0 && (
            <Polyline
              coordinates={simulatedPath}
              strokeColor="#4285F4"
              strokeWidth={5}
            />
          )}

          {truckLocation && (
            <Marker
              coordinate={truckLocation}
              anchor={{ x: 0.5, y: 0.5 }}
              zIndex={999}
              title="Caminhão"
            >
              <View style={Styles.truckMarker}>
                <Text style={{ fontSize: 40 }}>🚛</Text>
              </View>
            </Marker>
          )}
        </MapView>

        {loadingRoute && (
          <View style={Styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={Styles.loadingText}>
              Calculando rota real nas ruas...
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={Styles.recenterButton}
          onPress={handleRecenter}
        >
          <MaterialIcons name="my-location" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <CustomBottomSheet ref={bottomSheetRef}>
        <View style={Styles.contentContainer}>
          {renderBottomSheetContent()}
        </View>
      </CustomBottomSheet>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  MapContainer: { flex: 1, position: "relative" },
  map: { flex: 1 },
  viewPesquisa: { width: "100%", marginBottom: 10 },

  // Flex 1 aqui é essencial para o FlatList ocupar o espaço e permitir Scroll
  viewRotas: { width: "100%", flex: 1, marginTop: 40 },

  contentContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  truckMarker: {
    alignItems: "center",
    justifyContent: "center",
  },

  trashMarker: {
    backgroundColor: COLORS.TRASH_BG,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
  },
  trashInner: {
    alignItems: "center",
    justifyContent: "center",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  loadingText: { color: "white", marginTop: 10, fontWeight: "bold" },

  recenterButton: {
    position: "absolute",
    top: 50,
    right: 15,
    backgroundColor: "#4285F4",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    zIndex: 10,
  },

  cardItem: {
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 12, // Espaço entre os cartões
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1E603A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    gap: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
  },
});

export default HomeScreen;
