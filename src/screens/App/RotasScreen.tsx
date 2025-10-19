// src/screens/App/RotasScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const rotas = [ { id: '1', name: 'Dendezeiros X Ribeira' }, { id: '2', name: 'Barra X Ondina' } ];

const RotasScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" backgroundColor="#2A6E4F" />
            <View style={[styles.header, { paddingTop: insets.top + moderateScale(10) }]}>
                <View>
                    <Text style={styles.headerTitle}>Rotas</Text>
                    <Text style={styles.headerSubtitle}>Escolha a rota mais próxima!</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.headerIconButton} onPress={() => router.push('/notificacoes')}>
                        <MaterialCommunityIcons name="bell-outline" size={moderateScale(26)} color="white" />
                    </TouchableOpacity>
                    {/* ANOTAÇÃO: CORREÇÃO AQUI! Imagem substituída pelo ícone de perfil. */}
                    <TouchableOpacity style={styles.headerIconButton} onPress={() => {/* Lógica para perfil */}}>
                        <Ionicons name="person-circle-outline" size={moderateScale(30)} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.darkButton} onPress={() => router.push('/favoritos')}>
                    <Text style={styles.darkButtonText}>Favoritos</Text>
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={moderateScale(20)} color="#555" />
                    <TextInput style={styles.searchInput} placeholder="Rotas" placeholderTextColor="#888" />
                    <TouchableOpacity style={styles.favoriteButton}>
                        <Ionicons name="heart-outline" size={moderateScale(20)} color="#555" />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.listContainer}>
                    {rotas.map(rota => (
                        <TouchableOpacity key={rota.id} style={styles.listItem}>
                            <MaterialCommunityIcons name="swap-horizontal" size={moderateScale(24)} color="#2E7D32" style={styles.listIcon} />
                            <Text style={styles.listItemText}>{rota.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <TouchableOpacity style={[styles.closeButton, { bottom: insets.bottom + moderateScale(20) }]} onPress={() => router.dismissAll()}>
                <Ionicons name="close" size={moderateScale(28)} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A6E4F' },
    container: { flex: 1, backgroundColor: '#6EB030', padding: moderateScale(20) },
    header: {
        backgroundColor: '#2A6E4F', paddingHorizontal: moderateScale(20), paddingVertical: moderateScale(15),
        borderBottomLeftRadius: moderateScale(20), borderBottomRightRadius: moderateScale(20),
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    headerTitle: { color: 'white', fontSize: moderateScale(28), fontWeight: 'bold' },
    headerSubtitle: { color: 'white', fontSize: moderateScale(16) },
    headerIcons: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(15) },
    headerIconButton: {
        backgroundColor: '#6EB030',
        width: moderateScale(45), height: moderateScale(45),
        borderRadius: moderateScale(22.5), justifyContent: 'center', alignItems: 'center',
    },
    darkButton: {
        backgroundColor: '#2A6E4F', alignSelf: 'center', paddingVertical: moderateScale(12),
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
    listIcon: { marginRight: moderateScale(15) },
    listItemText: { fontSize: moderateScale(16), fontWeight: '500', color: '#333' },
    closeButton: {
        position: 'absolute', alignSelf: 'center', backgroundColor: '#2A6E4F', 
        width: moderateScale(50), height: moderateScale(50), borderRadius: moderateScale(25), 
        justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000',
        zIndex: 10,
    },
});

export default RotasScreen;