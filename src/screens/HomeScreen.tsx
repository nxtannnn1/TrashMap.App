import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator, // Para feedback de loading
  Text, // Para feedback de erro
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useAuth } from "@/src/contexts/AuthContext";

import CustomBottomSheet, {
  BottomSheetHandle,
} from "@/src/components/CustomBottomSheet";
import SearchBar from "@/src/components/ui/searchBar";
import CardRotas from "@/src/components/CardListRotas";
import api from "@/src/services/api"; // <-- NOSSA IMPORTAÇÃO DO AXIOS

// --- DEFINIÇÃO DE TIPOS PARA OS DADOS DA API ---
type Rota = {
  id: string;
  nome: string;
  descricao: string;
  // Adicione outros campos que sua API retorna
};

type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  titulo: string;
  descricao?: string;
};
// ------------------------------------------------

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const isLoggedIn = !!user;
  const userName = user ? user.nome : "Visitante";

  const bottomSheetRef = useRef<BottomSheetHandle | null>(null);

  // --- ESTADOS PARA OS DADOS DA API ---
  const [rotas, setRotas] = useState<Rota[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // -------------------------------------

  // --- HOOK PARA BUSCAR DADOS QUANDO O COMPONENTE MONTAR ---
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        setError(null);

        // Faz as duas requisições em paralelo
        const [responseRotas, responseMarkers] = await Promise.all([
          api.get("/rotas"), // Endpoint de rotas
          api.get("/markers"), // Endpoint de marcadores
        ]);

        setRotas(responseRotas.data);
        setMarkers(responseMarkers.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Não foi possível carregar os dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []); // O array vazio [] garante que isso rode apenas 1 vez
  // --------------------------------------------------------

  // ABRINDO NO ESTADO PADRÃO (50% da tela)
  const handlePresentSheet = () => {
    bottomSheetRef.current?.openDefault();
  };
  // CHAMA A FUNÇÃO `close()` para fechar completamente (0%)
  const handleCloseSheet = () => {
    bottomSheetRef.current?.close();
  };
  // CHAMA A FUNÇÃO `openFull()` para ir para 85%
  const handleOpenFull = () => {
    bottomSheetRef.current?.openFull();
  };

  const initialRegion = {
    latitude: -12.9777,
    longitude: -38.5016,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleProfilePress = () => {
    if (isLoggedIn && user) {
      Alert.alert(
        "Sair",
        `Você está logado como ${user.nome}. Deseja realmente sair?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sair", onPress: signOut, style: "destructive" },
        ]
      );
    } else {
      router.push("/screens/Auth/LoginScreen");
    }
  };

  // --- FUNÇÃO PARA RENDERIZAR O CONTEÚDO DO BOTTOMSHEET ---
  const renderBottomSheetContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color="#1E603A"
          style={{ marginTop: 20 }}
        />
      );
    }

    if (error) {
      return <Text style={Styles.errorText}>{error}</Text>;
    }

    return (
      <>
        <View style={Styles.viewPesquisa}>
          <SearchBar
            onChangeText={() => {
              /* lógica para atualizar o estado de pesquisa */
            }}
            value={"" /* estado de pesquisa atual */}
          />
        </View>
        <View style={Styles.viewRotas}>
          {/* ANOTAÇÃO: 
            Seu componente CardRotas agora precisa ser atualizado 
            para receber a prop 'data' e renderizar a lista de rotas.
          */}
          <CardRotas data={rotas} />
        </View>
      </>
    );
  };
  // ----------------------------------------------------------

  return (
    <View style={Styles.container}>
      <View style={Styles.MapContainer}>
        <MapView
          style={Styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Renderiza os markers vindos da API */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.titulo}
              description={marker.descricao}
            />
          ))}
        </MapView>
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
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  MapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1E603A",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1E603A",
  },
  sheetText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#000000ff",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 5,
    paddingVertical: 10,
    gap: 45,
  },
  viewPesquisa: {
    width: "100%",
  },
  viewRotas: {
    width: "100%",
    flex: 1,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default HomeScreen;
