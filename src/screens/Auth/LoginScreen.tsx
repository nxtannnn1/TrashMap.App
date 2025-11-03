// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, Dimensions} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app/Navigation/types";

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  // ANOTAÇÃO: Pegamos o signIn do contexto
  const { signIn } = useAuth();
  // ANOTAÇÃO: Usamos um isLoading local para controlar o botão
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (!email || !senha) { Alert.alert("Atenção", "Por favor, preencha o email e a senha."); return; }

    setIsLoading(true); // Ativa o loading local
    
    try {
      // Chama a função signIn do contexto
      await signIn(email, senha);
      
      // ANOTAÇÃO: Se o login deu certo, fechamos o modal manualmente.

    } catch (error) { 
      // Se o signIn falhar, ele vai estourar um erro que nós pegamos aqui.
      Alert.alert("Falha no Login", "Credenciais inválidas. Verifique seus dados e tente novamente.");
    } finally {
      setIsLoading(false); // Desativa o loading local
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
      <TextInput
        style={styles.input}
        placeholder="Digite a senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {/* ANOTAÇÃO: O botão agora olha para o isLoading local */}
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

// ... Seus estilos (iguais aos que você já tinha) ...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F0F0', justifyContent: 'center', paddingHorizontal: moderateScale(25) },
    logo: { width: moderateScale(100), height: moderateScale(100), resizeMode: 'contain', marginBottom: moderateScale(10), alignSelf: 'center' },
    title: { fontSize: moderateScale(28), fontWeight: 'bold', marginBottom: moderateScale(20), color: '#333', textAlign: 'center' },
    label: { marginBottom: moderateScale(5), fontSize: moderateScale(14), color: '#555' },
    input: {
        width: '100%', height: moderateScale(50), backgroundColor: '#FFF', borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(15), marginBottom: moderateScale(15), fontSize: moderateScale(16),
        borderWidth: 1, borderColor: '#ddd'
    },
    forgotPassword: { alignSelf: 'flex-end', marginBottom: moderateScale(20), fontSize: moderateScale(13), color: '#555' },
    button: {
        width: '100%', height: moderateScale(50), backgroundColor: '#7CB342', borderRadius: moderateScale(10),
        justifyContent: 'center', alignItems: 'center', marginTop: moderateScale(10),
    },
    buttonText: { color: '#FFF', fontSize: moderateScale(18), fontWeight: 'bold' },
    signupContainer: { flexDirection: 'row', marginTop: moderateScale(20), justifyContent: 'center' },
    signupText: { fontSize: moderateScale(14), color: '#555' },
    signupLink: { fontWeight: 'bold' }
});


export default LoginScreen;