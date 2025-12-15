
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import StatusBadge from '@/components/atoms/StatusBadge';
import { ClientAccount } from '@/types/clientAccount';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

interface ClientAccountCardProps {
  clientAccount: ClientAccount;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddUser?: () => void;
  index?: number;
}

export default function ClientAccountCard({
  clientAccount,
  onPress,
  onEdit,
  onDelete,
  onAddUser,
  index = 0,
}: ClientAccountCardProps) {
  const cardGreen = useThemeColor({}, 'cardGreen');
  const cardBlue = useThemeColor({}, 'cardBlue');
  const cardBackground = index % 2 === 0 ? cardBlue : cardGreen;
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBackground }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Header row: company name + status */}
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
              {clientAccount.companyName}
            </Text>
            <Text style={[styles.siret, { color: secondaryTextColor }]} numberOfLines={1}>
              {clientAccount.siret || 'N/A'}
            </Text>
          </View>
          <StatusBadge 
            status={clientAccount.active ? 'active' : 'inactive'} 
            size="small" 
          />
        </View>

        {/* Contact info */}
        <View style={styles.infoRow}>
          <IconSymbol name="envelope.fill" size={14} color={secondaryTextColor} />
          <Text style={[styles.infoText, { color: secondaryTextColor }]} numberOfLines={1}>
            {clientAccount.contactEmail || 'N/A'}
          </Text>
        </View>

        {clientAccount.phone && (
          <View style={styles.infoRow}>
            <IconSymbol name="phone.fill" size={14} color={secondaryTextColor} />
            <Text style={[styles.infoText, { color: secondaryTextColor }]} numberOfLines={1}>
              {clientAccount.phone}
            </Text>
          </View>
        )}

        {/* Location info */}
        {(clientAccount.city || clientAccount.postalCode) && (
          <View style={styles.infoRow}>
            <IconSymbol name="location.fill" size={14} color={secondaryTextColor} />
            <Text style={[styles.infoText, { color: secondaryTextColor }]} numberOfLines={1}>
              {[clientAccount.postalCode, clientAccount.city].filter(Boolean).join(', ') || 'N/A'}
            </Text>
          </View>
        )}

        {/* Footer row: users count + actions */}
        <View style={styles.footerRow}>
          <View style={styles.usersInfo}>
            <IconSymbol name="person.2.fill" size={14} color={secondaryTextColor} />
            <Text style={[styles.usersCount, { color: secondaryTextColor }]}>
              {clientAccount.users.length === 1 
                ? t.admin.userCount.replace('{{count}}', clientAccount.users.length.toString())
                : t.admin.userCount_plural.replace('{{count}}', clientAccount.users.length.toString())
              }
            </Text>
          </View>
          
          <View style={styles.actions}>
            {onAddUser && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: tintColor }]}
                onPress={onAddUser}
                activeOpacity={0.7}
              >
                <IconSymbol name="plus" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            {onEdit && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: secondaryTextColor }]}
                onPress={onEdit}
                activeOpacity={0.7}
              >
                <IconSymbol name="pencil" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={onDelete}
                activeOpacity={0.7}
              >
                <IconSymbol name="trash" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Creation date */}
        <View style={styles.dateRow}>
          <Text style={[styles.dateText, { color: secondaryTextColor }]}>
            {t.admin.createdAt} {formatDate(clientAccount.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  siret: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  usersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usersCount: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  dateRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  dateText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});