// src/screens/App/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2A6E4F" />
            <View style={[styles.header, { paddingTop: insets.top + moderateScale(10) }]}>
                <View>
                    <Text style={styles.headerTitle}>Olá, {isLoggedIn ? userName : 'Visitante'}!</Text>
                    <Text style={styles.headerSubtitle}>Combata a poluição!</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notificacoes')}>
                        <Text style={styles.emojiIcon}>🔔</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => !isLoggedIn && router.push('/login')}>
                        <Image
                            source={require('../../assets/profile_placeholder.png')}
                            style={styles.profilePic}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapPlaceholderText}>O mapa aparecerá aqui</Text>
            </View>

            <TouchableOpacity onPress={() => router.push('/rotas')}>
                <View style={[styles.searchContainer, { bottom: insets.bottom + moderateScale(15) }]}>
                    <Text style={styles.emojiIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rotas"
                        placeholderTextColor="#888"
                        // Impede que o teclado abra, já que a barra é um botão
                        editable={false}
                    />
                    <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                            // Impede que o clique na barra de busca seja ativado junto
                            e.stopPropagation();
                            router.push('/favoritos');
                        }}
                    >
                        <Text style={styles.emojiIcon}>🤍</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EAEAEA' },
    header: {
        backgroundColor: '#2A6E4F', paddingHorizontal: moderateScale(20),
        paddingBottom: moderateScale(20), borderBottomLeftRadius: moderateScale(20),
        borderBottomRightRadius: moderateScale(20), flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center',
    },
    headerTitle: { color: 'white', fontSize: moderateScale(24), fontWeight: 'bold' },
    headerSubtitle: { color: 'white', fontSize: moderateScale(16) },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    profilePic: { width: moderateScale(45), height: moderateScale(45), borderRadius: moderateScale(45 / 2) },
    iconButton: { marginRight: moderateScale(15) },
    mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    mapPlaceholderText: { fontSize: moderateScale(18), color: '#999', fontWeight: '500' },
    searchContainer: {
        position: 'absolute', left: moderateScale(20), right: moderateScale(20),
        backgroundColor: 'white', borderRadius: moderateScale(50), height: moderateScale(60),
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(20),
        elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 5,
    },
    searchInput: { flex: 1, fontSize: moderateScale(18), color: '#333', marginLeft: moderateScale(10) },
    favoriteButton: {
        width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20),
        backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center',
        marginLeft: moderateScale(10),
    },
    emojiIcon: { fontSize: moderateScale(20) }
});

export default HomeScreen;