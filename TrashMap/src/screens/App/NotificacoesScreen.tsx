// src/screens/App/NotificacoesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notificações</Text>
            </View>

            <ScrollView contentContainerStyle={styles.listContainer}>
                {notificacoes.map(item => (
                    <View key={item.id} style={styles.notificationItem}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        <TouchableOpacity style={styles.notificationContent}>
                            <Text>{item.content}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2E7D32' },
    header: {
        flexDirection: 'row', alignItems: 'center', padding: moderateScale(20),
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', width: moderateScale(40),
        height: moderateScale(40), borderRadius: moderateScale(20),
        justifyContent: 'center', alignItems: 'center', marginRight: moderateScale(20),
    },
    backButtonText: { color: 'white', fontSize: moderateScale(24) },
    headerTitle: { color: 'white', fontSize: moderateScale(28), fontWeight: 'bold' },
    listContainer: { padding: moderateScale(20) },
    notificationItem: { marginBottom: moderateScale(25) },
    notificationTitle: { color: 'white', fontSize: moderateScale(16), marginBottom: moderateScale(10) },
    notificationContent: {
        backgroundColor: 'white', borderRadius: moderateScale(15),
        padding: moderateScale(20),
    }
});

export default NotificacoesScreen;