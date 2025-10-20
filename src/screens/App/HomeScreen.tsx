// src/screens/App/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const HomeScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, signOut } = useAuth();
    
    const isLoggedIn = !!user;
    const userName = user ? user.nome : "Visitante";

    const initialRegion = {
        latitude: -12.9777,
        longitude: -38.5016,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const handleProfilePress = () => {
        if (isLoggedIn && user) {
            Alert.alert("Sair", `Você está logado como ${user.nome}. Deseja realmente sair?`, [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", onPress: signOut, style: "destructive" },
            ]);
        } else {
            router.push('/(auth)/login');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1E603A" />
            <View style={styles.innerContainer}>
                <View>
                    <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top : moderateScale(15) }]}>
                        <View>
                            <Text style={styles.headerTitle}>Olá, {userName}!</Text>
                            <Text style={styles.headerSubtitle}>Combata a poluição!</Text>
                        </View>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.headerIconButton} onPress={() => router.push('/(app)/notificacoes')}>
                                <MaterialCommunityIcons name="bell-outline" size={moderateScale(26)} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIconButton} onPress={handleProfilePress}>
                                <Ionicons name="person-circle-outline" size={moderateScale(30)} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                    showsMyLocationButton={false} 
                >
                    {/* ANOTAÇÃO: Adicionamos um Marker de exemplo para usar a importação. */}
                    <Marker coordinate={{ latitude: -12.9777, longitude: -38.5016 }} title="Exemplo" />
                </MapView>

                <View style={styles.footerBackground} />

                <TouchableOpacity
                    style={[styles.searchContainer, { bottom: insets.bottom > 0 ? insets.bottom + 5 : moderateScale(15) }]}
                    onPress={() => router.push('/(app)/rotas')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="search" size={moderateScale(22)} color="#555" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar rotas..."
                        placeholderTextColor="#888"
                        editable={false}
                        pointerEvents="none"
                    />
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            router.push('/(app)/favoritos');
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
        flex: 1,
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
        pointerEvents: 'none',
    },
    favoriteButton: {
        width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20),
        backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center',
        marginLeft: moderateScale(10),
    },
});

export default HomeScreen;