// src/screens/Auth/LoginScreen.tsx
import { RootStackParamList } from "@/src/Types/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Importando ícones (Padrão do Expo. Se não usar Expo, use react-native-vector-icons)
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  // NOVO: Estado para controlar visibilidade da senha
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    // Remove espaços em branco
    const emailTrimmed = email.trim();
    const senhaTrimmed = senha.trim();

    if (!emailTrimmed || !senhaTrimmed) {
      Alert.alert("Atenção", "Por favor, preencha o email e a senha.");
      return;
    }

    setIsLoading(true);

    try {
      // CORREÇÃO IMPORTANTE: Passar as variáveis "Trimmed" (limpas)
      await signIn(emailTrimmed, senhaTrimmed);
    } catch (error) {
      Alert.alert(
        "Falha no Login",
        "Credenciais inválidas. Verifique seus dados e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>

      {/* MUDANÇA: Container para agrupar Input + Ícone */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputFlex} // Estilo modificado para preencher espaço
          placeholder="Digite a senha"
          value={senha}
          onChangeText={setSenha}
          // Lógica: Se showPassword for true, secureText é false
          secureTextEntry={!showPassword}
        />

        {/* Botão do Olho */}
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Ainda não tem conta na TrashMap? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={[styles.signupText, styles.signupLink]}>
            Criar agora!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    paddingHorizontal: moderateScale(25),
  },
  logo: {
    width: moderateScale(100),
    height: moderateScale(100),
    resizeMode: "contain",
    marginBottom: moderateScale(10),
    alignSelf: "center",
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
    marginBottom: moderateScale(20),
    color: "#333",
    textAlign: "center",
  },
  label: {
    marginBottom: moderateScale(5),
    fontSize: moderateScale(14),
    color: "#555",
  },
  // Estilo do Input Comum (Email)
  input: {
    width: "100%",
    height: moderateScale(50),
    backgroundColor: "#FFF",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    marginBottom: moderateScale(15),
    fontSize: moderateScale(16),
    borderWidth: 1,
    borderColor: "#ddd",
  },
  // NOVO: Estilo do Container da Senha (Imita o visual do input normal)
  passwordContainer: {
    width: "100%",
    height: moderateScale(50),
    backgroundColor: "#FFF",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(15),
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row", // Coloca input e ícone lado a lado
    alignItems: "center",
    paddingHorizontal: moderateScale(15),
  },
  // NOVO: Input dentro do container (Sem borda, ocupa o espaço restante)
  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: moderateScale(16),
    color: "#000",
  },
  // NOVO: Área de toque do ícone
  iconContainer: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: moderateScale(20),
    fontSize: moderateScale(13),
    color: "#555",
  },
  button: {
    width: "100%",
    height: moderateScale(50),
    backgroundColor: "#7CB342",
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(10),
  },
  buttonText: {
    color: "#FFF",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: moderateScale(20),
    justifyContent: "center",
  },
  signupText: { fontSize: moderateScale(14), color: "#555" },
  signupLink: { fontWeight: "bold" },
});

export default LoginScreen;
