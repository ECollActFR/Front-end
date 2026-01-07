import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/hooks/useTranslation";
import { User } from "@/types/user";
import { formatService } from "@/services/formatService";

type UserDetailsProps = {
    user: User,
    handleEditProfile: () => void,
    isLogoutHovered: boolean,
    handleLogout: () => void,
    setIsLogoutHovered: (value: boolean) => void,
}

export const UserDetails : React.FC<UserDetailsProps> = ({user, handleEditProfile, isLogoutHovered, handleLogout, setIsLogoutHovered}) => {

    const borderColor = useThemeColor({}, 'border');
    const cardBackground = useThemeColor({}, 'cardNeutral');
    const secondaryTextColor = useThemeColor({}, 'textSecondary')
    const tintColor = useThemeColor({}, 'tint');
    const textColor = useThemeColor({}, 'text');
    const {t} = useTranslation();

    return (
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
                        {formatService.formatRoles(user.roles)}
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
                                {formatService.formatDate(user.createdAt)}
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
    );
}

const styles = StyleSheet.create({
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
    actionsContainer: {
        gap: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        marginTop: 8,
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
    value: {
        fontSize: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    separator: {
        height: 1,
        width: '100%',
    },
});