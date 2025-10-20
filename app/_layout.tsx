// app/_layout.tsx
import { Stack, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const { isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    if (isLoading) {
        return null;
    }

    // ANOTAÇÃO: Este Stack agora é muito mais simples.
    // Ele não precisa mais das opções para (app) e (auth),
    // pois eles agora têm seus próprios _layout.tsx que cuidam disso.
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
        </Stack>
    );
}

const RootLayout: React.FC = () => {
  return (
    <SafeAreaProvider>
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    </SafeAreaProvider>
  );
}

export default RootLayout;