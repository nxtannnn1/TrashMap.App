// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    // Este Stack controla as telas de login e cadastro.
    // A opção screenOptions={{ headerShown: false }} remove o cabeçalho
    // de TODAS as telas dentro deste grupo.
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }} />
  );
}