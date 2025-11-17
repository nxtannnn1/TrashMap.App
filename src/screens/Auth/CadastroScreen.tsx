// src/screens/Auth/CadastroScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
// Importando ícones
import { Ionicons } from "@expo/vector-icons";
import { cadastrar } from "@/src/services/authService";

const { width } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const CadastroScreen: React.FC = () => {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados para controlar a visibilidade das senhas separadamente
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const handleCadastro = async () => {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const senhaLimpa = senha.trim();
    const confirmarSenhaLimpa = confirmarSenha.trim();

    if (!nomeLimpo || !emailLimpo || !senhaLimpa || !confirmarSenhaLimpa) {
      Alert.alert("Atenção", "Todos os campos são obrigatórios.");
      return;
    }

    if (!emailLimpo.includes("@") || !emailLimpo.includes(".")) {
      Alert.alert("Atenção", "Digite um e-mail válido.");
      return;
    }

    if (senhaLimpa.length < 6) {
      Alert.alert("Senha Fraca", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senhaLimpa !== confirmarSenhaLimpa) {
      Alert.alert("Atenção", "As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      await cadastrar({
        nome: nomeLimpo,
        email: emailLimpo,
        senha: senhaLimpa,
      });

      Alert.alert(
        "Sucesso!",
        "Sua conta foi criada. Faça login para continuar.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.log(error);
      const mensagemErro =
        error.response?.data?.message ||
        "Não foi possível criar sua conta. Verifique se o e-mail já existe.";
      Alert.alert("Erro no Cadastro", mensagemErro);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Criar conta</Text>

        {/* Campo Nome (Input Padrão) */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o seu nome"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        {/* Campo Email (Input Padrão) */}
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o seu melhor e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Campo Senha (Input com Ícone) */}
        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputFlex}
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showSenha} // Controlado pelo estado showSenha
          />
          <TouchableOpacity
            onPress={() => setShowSenha(!showSenha)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={showSenha ? "eye-off" : "eye"}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* Campo Confirmar Senha (Input com Ícone) */}
        <Text style={styles.label}>Confirmar senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputFlex}
            placeholder="Confirme a senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={!showConfirmarSenha} // Controlado pelo estado showConfirmarSenha
          />
          <TouchableOpacity
            onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={showConfirmarSenha ? "eye-off" : "eye"}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleCadastro}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Criar conta</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.termsText}>
          Ao clicar no botão Criar conta, você concorda com nossos{" "}
          <Text style={styles.link}>Termos de Uso</Text> e a nossa{" "}
          <Text style={styles.link}>Política de Privacidade</Text>.
        </Text>

        <TouchableOpacity
          style={{ marginTop: moderateScale(15) }}
          onPress={() => router.back()}
        >
          <Text style={styles.loginLink}>
            Já tem conta na TrashMap?{" "}
            <Text style={styles.link}>Acessar conta!</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: moderateScale(25),
    paddingVertical: moderateScale(20),
  },
  logo: {
    width: moderateScale(80),
    height: moderateScale(80),
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
  // Estilo para inputs normais (Nome, Email)
  input: {
    width: "100%",
    height: moderateScale(50),
    backgroundColor: "#FFF",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    marginBottom: moderateScale(10),
    fontSize: moderateScale(16),
    borderWidth: 1,
    borderColor: "#ddd",
  },
  // Container para Inputs com senha (Borda e fundo vão aqui)
  passwordContainer: {
    width: "100%",
    height: moderateScale(50),
    backgroundColor: "#FFF",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(15),
  },
  // Input dentro do container (ocupa espaço, sem borda)
  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: moderateScale(16),
    color: "#000",
  },
  // Área de toque do ícone
  iconContainer: {
    padding: 5,
  },
  button: {
    width: "100%",
    height: moderateScale(50),
    backgroundColor: "#7CB342",
    borderRadius: moderateScale(10),
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(20),
  },
  buttonText: {
    color: "#FFF",
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  termsText: {
    marginTop: moderateScale(15),
    textAlign: "center",
    fontSize: moderateScale(12),
    color: "#666",
  },
  link: { fontWeight: "bold" },
  loginLink: {
    color: "#555",
    textAlign: "center",
    marginTop: moderateScale(10),
  },
});

export default CadastroScreen;
