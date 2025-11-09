import { User, ValidateToken } from '@/types/user';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '@/services/userService';

interface UserState {
    // État
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User) => void;
    setLoading: (isLoading: boolean) => void;
    validateToken: () => Promise<boolean>;
    loadUserInfo: () => Promise<void>;
    hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'user-storage';

const useUserStore = create<UserState>((set, get) => ({
    // État initial
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,

    // Hydrater le store depuis AsyncStorage
    hydrate: async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const { user, token } = JSON.parse(stored);
                set({ user, token });
            }
        } catch (error) {
            console.error('Error hydrating user store:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Actions
    login: async (user: User, token: string) => {
        set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
        });

        // Persister dans AsyncStorage
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
        } catch (error) {
            console.error('Error saving user to storage:', error);
        }
    },

    logout: async () => {
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
        });

        // Nettoyer AsyncStorage
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error removing user from storage:', error);
        }
    },

    setUser: (user: User) => {
        set({ user });

        // Mettre à jour AsyncStorage
        const state = get();
        if (state.token) {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token: state.token }))
                .catch(error => console.error('Error updating user in storage:', error));
        }
    },

    setLoading: (isLoading: boolean) => {
        set({ isLoading });
    },

    validateToken: async (): Promise<boolean> => {
        const { token } = get();

        if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return false;
        }

        try {
            const payload: ValidateToken = { token };
            const isValid = await userService.validateToken(payload);

            if (!isValid) {
                // Token invalide, on nettoie
                await get().logout();
                return false;
            }

            set({ isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            await get().logout();
            return false;
        }
    },

    loadUserInfo: async (): Promise<void> => {
        const { token, isAuthenticated } = get();

        if (!token || !isAuthenticated) {
            return;
        }

        try {
            const user = await userService.getUserInfo(token);
            get().setUser(user);
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    },
}));

export default useUserStore;
