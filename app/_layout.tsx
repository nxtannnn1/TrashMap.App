// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout: React.FC = () => {
  return (
    <SafeAreaProvider>
      <Stack>
        {/* Telas já existentes */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ presentation: 'modal', headerShown: false }} />

        {/* --- ANOTAÇÃO: Adicionando as novas telas --- */}
        <Stack.Screen name="rotas" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="favoritos" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="notificacoes" options={{ presentation: 'fullScreenModal', headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

export default RootLayout;