import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ValidateToken } from '@/types/user';
import { userService } from '@/services/userService';
import { tokenManager } from '@/services/tokenManager';

interface UserState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface UserContextType extends UserState {
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User) => void;
    setLoading: (isLoading: boolean) => void;
    validateToken: () => Promise<boolean>;
    loadUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'user-storage';

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Hydrate from AsyncStorage on mount
    useEffect(() => {
        const hydrate = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const { user, token } = JSON.parse(stored);
                    setUser(user);
                    setToken(token);
                    tokenManager.setToken(token);
                }
            } catch (error) {
                console.error('Error hydrating user store:', error);
            } finally {
                setIsLoading(false);
            }
        };

        hydrate();
    }, []);

    const login = async (newUser: User, newToken: string) => {
        setUser(newUser);
        setToken(newToken);
        setIsAuthenticated(true);
        setIsLoading(false);
        tokenManager.setToken(newToken);

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token: newToken }));
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        tokenManager.clearToken();

        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error removing user from storage:', error);
        }
    };

    const updateUser = (newUser: User) => {
        setUser(newUser);

        if (token) {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user: newUser, token }))
                .catch(error => console.error('Error updating user in storage:', error));
        }
    };

    const validateToken = async (): Promise<boolean> => {
        if (!token) {
            setIsLoading(false);
            setIsAuthenticated(false);
            return false;
        }

        try {
            const payload: ValidateToken = { token };
            const isValid = await userService.validateToken(payload);

            if (!isValid) {
                await logout();
                return false;
            }

            setIsAuthenticated(true);
            setIsLoading(false);
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            await logout();
            return false;
        }
    };

    const loadUserInfo = async (): Promise<void> => {
        if (!token || !isAuthenticated) {
            return;
        }

        try {
            const userInfo = await userService.getUserInfo(token);
            updateUser(userInfo);
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    };

    const value: UserContextType = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setUser: updateUser,
        setLoading: setIsLoading,
        validateToken,
        loadUserInfo,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
