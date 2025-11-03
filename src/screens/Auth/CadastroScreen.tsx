// src/screens/Auth/CadastroScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { cadastrar } from '../../services/authService';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const CadastroScreen: React.FC = () => {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleCadastro = async () => {
        if (!nome || !email || !senha || !confirmarSenha) { Alert.alert('Atenção', 'Todos os campos são obrigatórios.'); return; }
        if (senha !== confirmarSenha) { Alert.alert('Atenção', 'As senhas não coincidem.'); return; }
        setIsLoading(true);
        try {
            await cadastrar({ nome, email, senha, tipoUsuario: "CLIENTE" });
            Alert.alert('Sucesso!', 'Sua conta foi criada. Por favor, faça o login.');
            router.back();
        } catch (error) { Alert.alert('Erro no Cadastro', 'Não foi possível criar sua conta. Tente novamente.');
        } finally { setIsLoading(false); }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Criar conta</Text>
                <Text style={styles.label}>Nome</Text>
                <TextInput style={styles.input} placeholder="Digite o seu nome" value={nome} onChangeText={setNome}/>
                <Text style={styles.label}>E-mail</Text>
                <TextInput style={styles.input} placeholder="Digite o seu melhor e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize='none'/>
                <Text style={styles.label}>Senha</Text>
                <TextInput style={styles.input} placeholder="Digite a senha" value={senha} onChangeText={setSenha} secureTextEntry/>
                <Text style={styles.label}>Confirmar senha</Text>
                <TextInput style={styles.input} placeholder="Confirme a senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry/>
                <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={isLoading}>
                    {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Criar conta</Text>}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                    Ao clicar no botão Criar conta, você concorda com nossos <Text style={styles.link}>Termos de Uso</Text> e a nossa <Text style={styles.link}>Política de Privacidade</Text>.
                </Text>
                <TouchableOpacity style={{marginTop: moderateScale(15)}} onPress={() => router.back()}>
                    <Text style={styles.loginLink}>Já tem conta na TrashMap? <Text style={styles.link}>Acessar conta!</Text></Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F0F0' },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: moderateScale(25), paddingVertical: moderateScale(20) },
    logo: { width: moderateScale(80), height: moderateScale(80), resizeMode: 'contain', marginBottom: moderateScale(10), alignSelf: 'center' },
    title: { fontSize: moderateScale(28), fontWeight: 'bold', marginBottom: moderateScale(20), color: '#333', textAlign: 'center' },
    label: { marginBottom: moderateScale(5), fontSize: moderateScale(14), color: '#555' },
    input: {
        width: '100%', height: moderateScale(50), backgroundColor: '#FFF', borderRadius: moderateScale(10),
        paddingHorizontal: moderateScale(15), marginBottom: moderateScale(10), fontSize: moderateScale(16),
        borderWidth: 1, borderColor: '#ddd'
    },
    button: {
        width: '100%', height: moderateScale(50), backgroundColor: '#7CB342', borderRadius: moderateScale(10),
        justifyContent: 'center', alignItems: 'center', marginTop: moderateScale(20)
    },
    buttonText: { color: '#FFF', fontSize: moderateScale(18), fontWeight: 'bold' },
    termsText: { marginTop: moderateScale(15), textAlign: 'center', fontSize: moderateScale(12), color: '#666' },
    link: { fontWeight: 'bold' },
    loginLink: { color: '#555', textAlign: 'center', marginTop: moderateScale(10) }
});

export default CadastroScreen;