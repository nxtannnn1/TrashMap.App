import React from "react";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppNavigation from "@/app/Navigation/AppNavigation";


export default function App() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
          <AppNavigation />
        </GestureHandlerRootView>
    </AuthProvider>
  );
}
