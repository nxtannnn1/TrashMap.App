// app/(app)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    // Este Stack controla as telas de rotas, favoritos, etc.
    <Stack screenOptions={{ headerShown: false, presentation: 'fullScreenModal' }} />
  );
}