// src/screens/App/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const HomeScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const isLoggedIn = false;
    const userName = "Usuário";

    return (
        <SafeAreaView style={styles.container}>
            {/* ANOTAÇÃO: Cor do StatusBar atualizada */}
            <StatusBar barStyle="light-content" backgroundColor="#1E603A" />

            <View style={styles.innerContainer}>
                <View>
                    <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : moderateScale(15) }]}>
                        <View>
                            <Text style={styles.headerTitle}>Olá, {isLoggedIn ? userName : 'Visitante'}!</Text>
                            <Text style={styles.headerSubtitle}>Combata a poluição!</Text>
                        </View>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.headerIconButton} onPress={() => router.push('/notificacoes')}>
                                <MaterialCommunityIcons name="bell-outline" size={moderateScale(26)} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIconButton} onPress={() => !isLoggedIn && router.push('/login')}>
                                <Ionicons name="person-circle-outline" size={moderateScale(30)} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.mapPlaceholder}>
                    <Text style={styles.mapPlaceholderText}>O mapa aparecerá aqui</Text>
                </View>

                <View style={styles.footerBackground} />

                {/* ANOTAÇÃO: Posição 'bottom' ajustada para 15, deixando a barra mais baixa. */}
                <TouchableOpacity
                    style={[styles.searchContainer, { bottom: insets.bottom > 0 ? insets.bottom + 5 : moderateScale(95) }]}
                    onPress={() => router.push('/rotas')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="search" size={moderateScale(22)} color="#555" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar rotas..."
                        placeholderTextColor="#888"
                        editable={false}
                    />
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            router.push('/favoritos');
                        }}
                    >
                        <Ionicons name="heart-outline" size={moderateScale(22)} color="#555" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAEAEA',
    },
    innerContainer: {
        flex: 1,
    },
    header: {
        // ANOTAÇÃO: Cor do cabeçalho atualizada
        backgroundColor: '#1E603A', 
        paddingHorizontal: moderateScale(20),
        paddingBottom: moderateScale(20), 
        borderBottomLeftRadius: moderateScale(20),
        borderBottomRightRadius: moderateScale(20), 
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    headerTitle: { color: 'white', fontSize: moderateScale(24), fontWeight: 'bold' },
    headerSubtitle: { color: 'white', fontSize: moderateScale(16) },
    headerIcons: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(15) },
    headerIconButton: {
        backgroundColor: '#6EB030',
        width: moderateScale(45), height: moderateScale(45),
        borderRadius: moderateScale(22.5), justifyContent: 'center', alignItems: 'center',
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapPlaceholderText: { fontSize: moderateScale(18), color: '#999', fontWeight: '500' },
    footerBackground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: moderateScale(15),
        // ANOTAÇÃO: Cor do rodapé atualizada
        backgroundColor: '#1E603A',
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
    },
    searchContainer: {
        position: 'absolute',
        left: moderateScale(20),
        right: moderateScale(20),
        backgroundColor: 'white', borderRadius: moderateScale(50), height: moderateScale(60),
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(20),
        elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 5,
    },
    searchInput: {
        flex: 1,
        fontSize: moderateScale(18),
        color: '#333',
        marginLeft: moderateScale(10),
        pointerEvents: 'none',
    },
    favoriteButton: {
        width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20),
        backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center',
        marginLeft: moderateScale(10),
    },
});

export default HomeScreen;