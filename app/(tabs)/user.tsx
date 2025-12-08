import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserScreen() {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const secondaryTextColor = useThemeColor({}, 'textSecondary');
    const borderColor = useThemeColor({}, 'border');
    const cardBackground = useThemeColor({}, 'cardNeutral');
    const tintColor = useThemeColor({}, 'tint');
    const accentOrange = useThemeColor({}, 'accentOrange');

    const { t } = useTranslation();
    const { token, user, logout, loadUserInfo } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user info
    const fetchUser = async () => {
        if (!token) {
            router.replace('/sign-in');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            await loadUserInfo();
        } catch (err) {
            console.error('Error loading user info:', err);
            setError('Impossible de charger votre profil');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [token]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('auth-storage');
            await logout();
            router.replace('/sign-in');
        } catch (e) {
            console.error("Logout error:", e);
        }
    };

    const handleEditProfile = () => {
        Alert.alert('Modifier le profil', 'Fonctionnalité à venir');
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatRoles = (roles: string[]) =>
        roles.map(role => role.replace('ROLE_', '')).join(', ');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>

            <View style={[styles.header, { borderBottomColor: borderColor }]}>
                <Text style={[styles.title, { color: textColor }]}>{t.user.title}</Text>
                <Text style={[styles.subtitle, { color: secondaryTextColor }]}>{t.user.subtitle}</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={tintColor} />
                        <Text style={[styles.loadingText, { color: secondaryTextColor }]}>
                            {t.user.loading}
                        </Text>
                    </View>
                ) : error ? (
                    <>
                        <View style={styles.centerContainer}>
                            <Text style={[styles.errorText, { color: accentOrange }]}>
                                {error}
                            </Text>

                            <TouchableOpacity
                                style={[styles.retryButton, { backgroundColor: tintColor }]}
                                onPress={fetchUser}
                            >
                                <Text style={styles.retryButtonText}>{t.user.retry}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.actionsContainer}>
                            <Pressable
                                style={[styles.button, styles.logoutOutline]}
                                onPress={handleLogout}
                            >
                                <Text style={[styles.buttonTextOutline]}>
                                    {t.user.logout}
                                </Text>
                            </Pressable>
                        </View>
                    </>
                ) : (
                    user && (
                        <>
                            <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
                                <View style={styles.infoRow}>
                                    <Text style={[styles.label, { color: secondaryTextColor }]}>
                                        {t.user.username}
                                    </Text>
                                    <Text style={[styles.value, { color: textColor }]}>{user.username}</Text>
                                </View>

                                <View style={[styles.separator, { backgroundColor: borderColor }]} />

                                <View style={styles.infoRow}>
                                    <Text style={[styles.label, { color: secondaryTextColor }]}>
                                        {t.user.email}
                                    </Text>
                                    <Text style={[styles.value, { color: textColor }]}>{user.email}</Text>
                                </View>

                                <View style={[styles.separator, { backgroundColor: borderColor }]} />

                                <View style={styles.infoRow}>
                                    <Text style={[styles.label, { color: secondaryTextColor }]}>
                                        {t.user.roles}
                                    </Text>
                                    <Text style={[styles.value, { color: textColor }]}>
                                        {formatRoles(user.roles)}
                                    </Text>
                                </View>

                                {user.createdAt && (
                                    <>
                                        <View style={[styles.separator, { backgroundColor: borderColor }]} />
                                        <View style={styles.infoRow}>
                                            <Text style={[styles.label, { color: secondaryTextColor }]}>
                                                {t.user.createdAt}
                                            </Text>
                                            <Text style={[styles.value, { color: textColor }]}>
                                                {formatDate(user.createdAt)}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            </View>

                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: tintColor }]}
                                    onPress={handleEditProfile}
                                >
                                    <Text style={styles.buttonText}>{t.user.editProfile}</Text>
                                </TouchableOpacity>

                                <Pressable
                                    style={[styles.button, styles.logoutOutline]}
                                    onPress={handleLogout}
                                >
                                    <Text style={styles.buttonTextOutline}>
                                        {t.user.logout}
                                    </Text>
                                </Pressable>
                            </View>
                        </>
                    )
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: 16,
        borderBottomWidth: 1,
    },
    title: { fontSize: 24, fontWeight: '700' },
    subtitle: { fontSize: 14, marginTop: 2 },
    content: { padding: 16 },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: { marginTop: 12, fontSize: 16 },
    errorText: { fontSize: 16, marginBottom: 16, textAlign: 'center' },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 24,
    },
    infoRow: { paddingVertical: 12 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
    value: { fontSize: 16 },
    separator: { height: 1, width: '100%' },
    actionsContainer: { gap: 12 },
    button: {
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    logoutOutline: {
        borderColor: '#E74C3C',
        borderWidth: 2,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextOutline: {
        color: '#E74C3C',
        fontSize: 16,
        fontWeight: '600',
    },
});
