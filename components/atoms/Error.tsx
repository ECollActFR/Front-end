import { useTranslation } from '@/hooks/useTranslation';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Logout } from './Logout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/contexts/AuthContext';

type ErrorProps = {
    error: string | null,
    setIsLoading: (value: boolean) => void,
    setError: (value: string | null) => void,
    isLogoutHovered: boolean,
    setIsLogoutHovered: (value: boolean) => void,
    handleLogout: () => void
}


export const Error : React.FC<ErrorProps> = (
    { isLogoutHovered, setIsLogoutHovered, handleLogout, error, setIsLoading, setError }
) => {
    const { t } = useTranslation();
    const accentOrange = useThemeColor({}, 'accentOrange');
    const tintColor = useThemeColor({}, 'tint');
    const { loadUserInfo } = useAuth();
    if(error)
    return(
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
        <Logout isLogoutHovered={isLogoutHovered} setIsLogoutHovered={setIsLogoutHovered} handleLogout={handleLogout} />
        </>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
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
})