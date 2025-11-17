import { RootStackParamList } from "@/src/Types/types";
import CadastroScreen from "@/src/screens/Auth/CadastroScreen";
import LoginScreen from "@/src/screens/Auth/LoginScreen";
import EditUsuarioScreen from "@/src/screens/EditUsuarioScreen";
import HomeScreen from "@/src/screens/HomeScreen";
import NotificationScreen from "@/src/screens/NotificationScreen";
import UsuarioScreen from "@/src/screens/UsuarioScreen";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native"; // Adicionei TouchableOpacity
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "@/src/contexts/AuthContext";

const Stack = createStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  headerTextTop: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTextBottom: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  // Estilo para o botão de entrar (Visitante)
  loginButtonHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 15,
  },
  loginButtonText: {
    color: "#1E603A",
    fontWeight: "bold",
  },
});

function AppNavigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E603A" />
      </View>
    );
  }

  // Função auxiliar para proteger rotas
  // Se não tiver user, manda pro Login. Se tiver, manda pra tela desejada.
  const handleProtectedRoute = (
    navigation: any,
    screenName: keyof RootStackParamList
  ) => {
    if (user) {
      navigation.navigate(screenName);
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <Stack.Navigator>
      {/* A Home agora é acessível para TODOS.
          A mágica acontece dentro do 'options'
      */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({
          navigation,
        }: StackScreenProps<RootStackParamList, "Home">) => ({
          title: "",
          headerStyle: { backgroundColor: "#1E603A", height: 140 },

          // LADO ESQUERDO DO HEADER (Saudação)
          headerLeft: () => (
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.headerTextTop}>
                {user ? `Olá, ${user.nome}` : "Olá, Visitante"}
              </Text>
              <Text style={styles.headerTextBottom}>Combata a Poluição</Text>
            </View>
          ),

          // LADO DIREITO DO HEADER (Ações)
          headerRight: () => {
            if (!user) {
              // =================================================
              // CENÁRIO VISITANTE: Botão "Entrar"
              // =================================================
              return (
                <TouchableOpacity
                  style={styles.loginButtonHeader}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.loginButtonText}>
                    Entrar / Criar Conta
                  </Text>
                </TouchableOpacity>
              );
            }

            // =================================================
            // CENÁRIO LOGADO: Ícones de Notificação e Perfil
            // =================================================
            return (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="notifications"
                  size={36}
                  color="#f0cf17ff"
                  style={{
                    padding: 3,
                    marginRight: 15,
                    backgroundColor: "#1E603A",
                    borderRadius: 50,
                  }}
                  // Usa a função de proteção (embora aqui o user já exista, é boa prática)
                  onPress={() =>
                    handleProtectedRoute(navigation, "Notification")
                  }
                />

                <Ionicons
                  name="person-circle-outline"
                  size={45}
                  color="#f0cf17ff"
                  style={{
                    marginRight: 16,
                    backgroundColor: "#1E603A",
                    borderRadius: 25,
                  }}
                  onPress={() => handleProtectedRoute(navigation, "Usuario")}
                />
              </View>
            );
          },
        })}
      />

      {/* As outras telas continuam aqui, disponíveis na pilha */}

      <Stack.Screen
        name="Usuario"
        component={UsuarioScreen}
        options={{
          title: "Usuário",
          headerStyle: { backgroundColor: "#1E603A" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <Stack.Screen
        name="EditUsuario"
        component={EditUsuarioScreen}
        options={{
          title: "Editar Usuário",
          headerStyle: { backgroundColor: "#1E603A" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          title: "Notificações",
          headerStyle: { backgroundColor: "#1E603A" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      {/* Telas de Auth agora fazem parte da pilha principal */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // Login sem header
      />

      <Stack.Screen
        name="Cadastro"
        component={CadastroScreen}
        options={{ headerShown: false }} // Cadastro sem header
      />
    </Stack.Navigator>
  );
}

export default AppNavigation;
