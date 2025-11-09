import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import useUserStore from '@/store/userStore';
import { userService } from '@/services/userService';
import { User } from '@/types/user';

export default function UserScreen() {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const secondaryTextColor = useThemeColor({}, 'textSecondary');
    const borderColor = useThemeColor({}, 'border');
    const cardBackground = useThemeColor({}, 'cardNeutral');
    const tintColor = useThemeColor({}, 'tint');
    const accentOrange = useThemeColor({}, 'accentOrange');

    const { t } = useTranslation();
    const token = useUserStore((state) => state.token);
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const loadUserInfo = useUserStore((state) => state.loadUserInfo);
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLogoutHovered, setIsLogoutHovered] = useState(false);

    // Load user info on mount
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!token) {
                router.replace('/sign-in');
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                await loadUserInfo();
            } catch (err: any) {
                console.error('Error loading user info:', err);
                setError(err?.message || 'Failed to load user info');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserInfo();
    }, [token]);

    const handleLogout = () => {
        Alert.alert(
            t.user.logout,
            t.user.logoutConfirm,
            [
                {
                    text: t.user.cancel,
                    style: 'cancel',
                },
                {
                    text: t.user.confirm,
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        router.replace('/sign-in');
                    },
                },
            ]
        );
    };

    const handleEditProfile = () => {
        // TODO: Navigate to edit profile screen
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

    const formatRoles = (roles: string[]) => {
        return roles.map(role => role.replace('ROLE_', '')).join(', ');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
                <Text style={[styles.title, { color: textColor }]}>{t.user.title}</Text>
                <Text style={[styles.subtitle, { color: secondaryTextColor }]}>{t.user.subtitle}</Text>
            </View>

            {/* Content */}
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
                                {t.user.error}
                            </Text>
                            <TouchableOpacity
                                style={[styles.retryButton, { backgroundColor: tintColor }]}
                                onPress={() => {
                                    const fetchUserInfo = async () => {
                                        setIsLoading(true);
                                        setError(null);
                                        try {
                                            await loadUserInfo();
                                        } catch (err: any) {
                                            console.error('Error loading user info:', err);
                                            setError(err?.message || 'Failed to load user info');
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    };
                                    fetchUserInfo();
                                }}
                            >
                                <Text style={styles.retryButtonText}>{t.user.retry}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Logout button even on error */}
                        <View style={styles.actionsContainer}>
                            <Pressable
                                style={[
                                    styles.button,
                                    styles.logoutButton,
                                    isLogoutHovered ? { backgroundColor: '#E74C3C' } : { backgroundColor: 'transparent' },
                                    { borderColor: '#E74C3C', borderWidth: 2 }
                                ]}
                                onPress={handleLogout}
                                onHoverIn={() => setIsLogoutHovered(true)}
                                onHoverOut={() => setIsLogoutHovered(false)}
                            >
                                <Text style={[styles.buttonText, { color: isLogoutHovered ? '#FFFFFF' : '#E74C3C' }]}>
                                    {t.user.logout}
                                </Text>
                            </Pressable>
                        </View>
                    </>
                ) : user ? (
                    <>
                        {/* User Info Card */}
                        <View style={[styles.card, { backgroundColor: cardBackground, borderColor }]}>
                            <View style={styles.infoRow}>
                                <Text style={[styles.label, { color: secondaryTextColor }]}>
                                    {t.user.username}
                                </Text>
                                <Text style={[styles.value, { color: textColor }]}>
                                    {user.username}
                                </Text>
                            </View>

                            <View style={[styles.separator, { backgroundColor: borderColor }]} />

                            <View style={styles.infoRow}>
                                <Text style={[styles.label, { color: secondaryTextColor }]}>
                                    {t.user.email}
                                </Text>
                                <Text style={[styles.value, { color: textColor }]}>
                                    {user.email}
                                </Text>
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

                        {/* Action Buttons */}
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: tintColor }]}
                                onPress={handleEditProfile}
                            >
                                <Text style={styles.buttonText}>{t.user.editProfile}</Text>
                            </TouchableOpacity>

                            <Pressable
                                style={[
                                    styles.button,
                                    styles.logoutButton,
                                    isLogoutHovered ? { backgroundColor: '#E74C3C' } : { backgroundColor: 'transparent' },
                                    { borderColor: '#E74C3C', borderWidth: 2 }
                                ]}
                                onPress={handleLogout}
                                onHoverIn={() => setIsLogoutHovered(true)}
                                onHoverOut={() => setIsLogoutHovered(false)}
                            >
                                <Text style={[styles.buttonText, { color: isLogoutHovered ? '#FFFFFF' : '#E74C3C' }]}>
                                    {t.user.logout}
                                </Text>
                            </Pressable>
                        </View>
                    </>
                ) : null}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    infoRow: {
        paddingVertical: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
    },
    separator: {
        height: 1,
        width: '100%',
    },
    actionsContainer: {
        gap: 12,
    },
    button: {
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    logoutButton: {
        marginTop: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
