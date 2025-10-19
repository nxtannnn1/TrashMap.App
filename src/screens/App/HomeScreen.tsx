// src/screens/App/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// ANOTAÇÃO: Importações para o Mapa
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const HomeScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const isLoggedIn = false;
    const userName = "Usuário";

    // Região inicial do mapa (Salvador, Bahia)
    const initialRegion = {
        latitude: -12.9777,
        longitude: -38.5016,
        latitudeDelta: 0.0922, // Zoom level
        longitudeDelta: 0.0421, // Zoom level
    };

    return (
        <SafeAreaView style={styles.container}>
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

                {/* ANOTAÇÃO: Componente MapView substituindo o placeholder */}
                <MapView
                    style={styles.map} // Estilo flex: 1 para ocupar o espaço
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                    showsMyLocationButton={false} // Você pode habilitar se quiser (true)
                    // mapPadding={{ bottom: moderateScale(110) }} // Adiciona padding para botões sobre o mapa
                >
                    {/* Exemplo de Marcador */}
                    {/* <Marker coordinate={{ latitude: -12.9777, longitude: -38.5016 }} title="Exemplo" /> */}
                    {/* No futuro, buscará os pontos da API e fará um map aqui */}
                </MapView>

                {/* Fundo verde para a área da barra de busca */}
                <View style={styles.footerBackground} />

                {/* Barra de busca como botão de navegação */}
                <TouchableOpacity
                    style={[styles.searchContainer, { bottom: insets.bottom > 0 ? insets.bottom + 5 : moderateScale(15) }]}
                    onPress={() => router.push('/rotas')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="search" size={moderateScale(22)} color="#555" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar rotas..."
                        placeholderTextColor="#888"
                        editable={false}
                        pointerEvents="none" // Garante que o input não seja clicável
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
        backgroundColor: '#EAEAEA', // Cor de fundo geral se o mapa não carregar
    },
    innerContainer: {
        flex: 1,
    },
    header: {
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
    map: {
        flex: 1, // Faz o mapa ocupar todo o espaço disponível
    },
    footerBackground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: moderateScale(100),
        backgroundColor: '#1E603A',
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20),
        // Adiciona um ponteiro none para garantir que toques no fundo verde não interfiram no mapa
        pointerEvents: 'none',
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
        pointerEvents: 'none', // Necessário para TouchableOpacity funcionar corretamente
    },
    favoriteButton: {
        width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20),
        backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center',
        marginLeft: moderateScale(10),
    },
});

export default HomeScreen;