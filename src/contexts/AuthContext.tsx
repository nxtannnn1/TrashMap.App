// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
// ANOTAÇÃO: O 'cadastrar' não estava sendo usado aqui, mas o importei para o futuro
import { login as apiLogin, cadastrar as apiCadastrar } from '../services/authService';

interface User {
    id: number;
    nome: string;
    email: string;
}

interface AuthContextData {
    user: User | null;
    signIn: (email: string, senha: string) => Promise<void>;
    signOut: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadUserFromStorage() {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) {
                    const userData = await SecureStore.getItemAsync('userData');
                    if (userData) {
                        setUser(JSON.parse(userData));
                    }
                }
            } catch (e) {
                console.error("Failed to load auth data from storage", e);
            } finally {
                setIsLoading(false);
            }
        }
        loadUserFromStorage();
    }, []);

    // ANOTAÇÃO: O hook useProtectedRoute foi REMOVIDO daqui.

    const signIn = async (email: string, senha: string) => {
        const response = await apiLogin(email, senha);
        setUser(response.usuario);
        await SecureStore.setItemAsync('userToken', response.token);
        await SecureStore.setItemAsync('userData', JSON.stringify(response.usuario));
    };

    const signOut = async () => {
        setUser(null);
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}