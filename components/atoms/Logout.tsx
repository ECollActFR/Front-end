import { useTranslation } from "@/hooks/useTranslation";
import { StyleSheet, Pressable, View, Text } from "react-native";
type LogoutProps = {
  isLogoutHovered: boolean;
  setIsLogoutHovered: (value: boolean) => void;
  handleLogout: () => void;
};

export const Logout: React.FC<LogoutProps> = ({ isLogoutHovered, setIsLogoutHovered, handleLogout }) => {
    const { t } = useTranslation();

    return(
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
    );
}

const styles = StyleSheet.create({
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