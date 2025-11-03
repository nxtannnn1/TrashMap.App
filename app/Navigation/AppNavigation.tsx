import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "@/app/Navigation/types";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "@/src/screens/HomeScreen";
import UsuarioScreen from "@/src/screens/UsuarioScreen";
import NotificationScreen from "@/src/screens/NotificationScreen";
import EditUsuarioScreen from "@/src/screens/EditUsuarioScreen";
import LoginScreen from "@/src/screens/Auth/LoginScreen";
import CadastroScreen from "@/src/screens/Auth/CadastroScreen";

const profileImageUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";

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
});

// Lógica de navegação
function AppNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({
          navigation,
        }: StackScreenProps<RootStackParamList, "Home">) => ({
          title: "",
          headerStyle: { backgroundColor: "#1E603A", height: 140 },
          headerLeft: () => (
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.headerTextTop}>Olá, Leticia</Text>
              <Text style={styles.headerTextBottom}>Combata a Poluição</Text>
            </View>
          ),
          headerRight: () => [
            <Ionicons
              key="notifications"
              name="notifications-outline"
              size={30}
              color="#000"
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate("Notification")}
            />,

            <TouchableOpacity
              key="profile"
              onPress={() => navigation.navigate("Usuario")}
              style={{ marginRight: 15 }}
            >
              <Image
                source={{ uri: profileImageUrl }}
                style={{
                  width: 57,
                  height: 57,
                  borderRadius: 27,
                  borderWidth: 1,
                  borderColor: "#ddd",
                }}
              />
            </TouchableOpacity>,
          ],
        })}
      />
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
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Cadastro"
        component={CadastroScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigation;
