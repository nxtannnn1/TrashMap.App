// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { login } from '../../services/authService';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (!email || !senha) { Alert.alert("Atenção", "Por favor, preencha o email e a senha."); return; }
    setIsLoading(true);
    try {
      const data = await login(email, senha);
      Alert.alert("Sucesso!", `Seja bem-vindo(a), ${data.usuario.nome}!`);
      router.back();
    } catch (error) { Alert.alert("Falha no Login", "Credenciais inválidas.");
    } finally { setIsLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>
        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} placeholder="Digite o seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} placeholder="Digite a senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <TouchableOpacity><Text style={styles.forgotPassword}>Esqueci minha senha</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>
        <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Ainda não tem conta na TrashMap? </Text>
            <TouchableOpacity onPress={() => router.push('/cadastro')}><Text style={[styles.signupText, styles.signupLink]}>Criar agora!</Text></TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};

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