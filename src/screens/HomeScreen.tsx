// src/screens/App/HomeScreen.tsx
import React, {
  useRef
} from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useAuth } from "../contexts/AuthContext";
import CustomBottomSheet, {
  BottomSheetHandle,
} from "@/src/components/CustomBottomSheet";
import SearchBar from "@/src/components/ui/searchBar";
import CardRotas from "../components/CardListRotas";

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
      router.push("/(auth)/login");
    }
  };
  
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
          {/* ANOTAÇÃO: Adicionamos um Marker de exemplo para usar a importação. */}
          <Marker
            coordinate={{ latitude: -12.9777, longitude: -38.5016 }}
            title="Exemplo"
          />
        </MapView>
      </View>
      <CustomBottomSheet ref={bottomSheetRef}>
        <View style={Styles.contentContainer}>
          <View style={Styles.viewPesquisa}>
            <SearchBar
              onChangeText={() => {
                /* lógica para atualizar o estado de pesquisa */
              }}
              value={"" /* estado de pesquisa atual */}
            />
          </View>
          <View style={Styles.viewRotas}>
            <CardRotas />
          </View>
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
});

export default HomeScreen;
