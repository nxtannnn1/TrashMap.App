// src/screens/App/NotificacoesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const notificacoes = [
    { id: '1', title: 'Atualização 29/08/2025', content: 'Confira a mais nova atualização do app' },
    { id: '2', title: 'Fora do ar!', content: 'O sistema ficará fora do ar no dia 15/08/2025' },
    { id: '3', title: 'Alterações para os usuários', content: 'Confira a alteração da conta de usuário' },
];

const NotificacoesScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        // ANOTAÇÃO: A tela inteira agora terá o fundo verde escuro único.
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor="#1E603A" />
            <View style={[styles.header, { paddingTop: insets.top + moderateScale(10) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={moderateScale(24)} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notificações</Text>
                {/* View fantasma para garantir a centralização correta do título */}
                <View style={{ width: moderateScale(40) }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.listContainer}>
                {notificacoes.map(item => (
                    <View key={item.id} style={styles.notificationItem}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        <TouchableOpacity style={styles.notificationContent}>
                            <Text style={styles.notificationContentText}>{item.content}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        // ANOTAÇÃO: CORREÇÃO AQUI! Fundo único para a tela inteira.
        backgroundColor: '#1E603A' 
    },
    header: {
        flexDirection: 'row', alignItems: 'center', 
        paddingHorizontal: moderateScale(20),
        justifyContent: 'space-between',
        paddingBottom: moderateScale(25), // ANOTAÇÃO: Aumentamos o padding inferior para mais espaço
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Um pouco mais visível
        width: moderateScale(40), height: moderateScale(40), 
        borderRadius: moderateScale(20),
        justifyContent: 'center', alignItems: 'center', 
    },
    headerTitle: { 
        color: 'white', fontSize: moderateScale(22), // Tamanho ajustado
        fontWeight: 'bold',
    },
    listContainer: { 
        paddingHorizontal: moderateScale(20),
        paddingTop: moderateScale(10),
    },
    notificationItem: { 
        marginBottom: moderateScale(20) 
    },
    notificationTitle: { 
        color: 'white', fontSize: moderateScale(16), 
        marginBottom: moderateScale(8), fontWeight: '500',
    },
    notificationContent: {
        backgroundColor: 'white', borderRadius: moderateScale(15),
        padding: moderateScale(20),
    },
    notificationContentText: {
        fontSize: moderateScale(14), color: '#333'
    }
});

export default NotificacoesScreen;