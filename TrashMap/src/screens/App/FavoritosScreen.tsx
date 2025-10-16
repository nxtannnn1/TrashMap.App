// src/screens/App/FavoritosScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// Ferramentas de responsividade
const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Dados de exemplo para a lista de favoritos
const favoritos = [
    { id: '1', name: 'Coleta Dendezeiros' },
    { id: '2', name: 'Rota Dendezeiros X Ribeira' },
    { id: '3', name: 'Coleta Cajazeiras' },
    { id: '4', name: 'Rota Massaranduba X Uruguai' },
    { id: '5', name: 'Coleta Paripe' },
    { id: '6', name: 'Rota Pirajá X São Caetano' },
];

const FavoritosScreen: React.FC = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Favoritos</Text>
                    <Text style={styles.headerSubtitle}>Pontos e rotas favoritados!</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => router.push('/notificacoes')}><Text style={styles.emojiIcon}>🔔</Text></TouchableOpacity>
                    <Image source={require('../../assets/profile_placeholder.png')} style={styles.profilePic} />
                </View>
            </View>

            <View style={styles.container}>
                <TouchableOpacity style={styles.darkButton} onPress={() => router.push('/rotas')}>
                    <Text style={styles.darkButtonText}>Rotas</Text>
                </TouchableOpacity>

                <View style={styles.searchContainer}>
                    <Text style={styles.emojiIcon}>🔍</Text> 
                    <TextInput style={styles.searchInput} placeholder="Rotas favoritas" placeholderTextColor="#888" />
                    <TouchableOpacity style={styles.favoriteButton}><Text style={styles.emojiIcon}>🤍</Text></TouchableOpacity>
                </View>

                <ScrollView style={styles.listContainer}>
                    {favoritos.map(item => (
                        <TouchableOpacity key={item.id} style={styles.listItem}>
                            <Text style={styles.locationIcon}>📍</Text>
                            <Text style={styles.listItemText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

// Estilos (muito similares aos da tela de Rotas)
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2E7D32' },
    container: { flex: 1, backgroundColor: '#66BB6A', padding: moderateScale(20) },
    header: {
        backgroundColor: '#2E7D32', paddingHorizontal: moderateScale(20), paddingVertical: moderateScale(15),
        borderBottomLeftRadius: moderateScale(20), borderBottomRightRadius: moderateScale(20),
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    headerTitle: { color: 'white', fontSize: moderateScale(28), fontWeight: 'bold' },
    headerSubtitle: { color: 'white', fontSize: moderateScale(16) },
    headerIcons: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(15) },
    profilePic: { width: moderateScale(45), height: moderateScale(45), borderRadius: moderateScale(22.5) },
    darkButton: {
        backgroundColor: '#2E7D32', alignSelf: 'center', paddingVertical: moderateScale(12),
        paddingHorizontal: moderateScale(30), borderRadius: moderateScale(50), marginBottom: moderateScale(20),
    },
    darkButtonText: { color: 'white', fontSize: moderateScale(16), fontWeight: 'bold' },
    searchContainer: {
        backgroundColor: 'white', borderRadius: moderateScale(50), height: moderateScale(55),
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(20),
        marginBottom: moderateScale(20),
    },
    searchInput: { flex: 1, fontSize: moderateScale(16), color: '#333', marginLeft: moderateScale(10) },
    favoriteButton: {
        width: moderateScale(35), height: moderateScale(35), borderRadius: moderateScale(17.5),
        backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginLeft: moderateScale(10),
    },
    listContainer: { flex: 1 },
    listItem: {
        backgroundColor: 'white', borderRadius: moderateScale(15), padding: moderateScale(20),
        flexDirection: 'row', alignItems: 'center', marginBottom: moderateScale(10),
    },
    locationIcon: { fontSize: moderateScale(20), marginRight: moderateScale(15), color: '#2E7D32' },
    listItemText: { fontSize: moderateScale(16), fontWeight: '500', color: '#333' },
    closeButton: {
        position: 'absolute', bottom: moderateScale(20), alignSelf: 'center',
        backgroundColor: '#2E7D32', width: moderateScale(50), height: moderateScale(50),
        borderRadius: moderateScale(25), justifyContent: 'center', alignItems: 'center',
    },
    closeButtonText: { color: 'white', fontSize: moderateScale(20), fontWeight: 'bold' },
    emojiIcon: { fontSize: moderateScale(20) }
});

export default FavoritosScreen;