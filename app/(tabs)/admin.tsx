import { SearchBar } from '@/components/molecules';
import ClientAccountList from '@/components/admin/ClientAccountList';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';
import { useIsSuperAdmin } from '@/hooks/useRoleCheck';
import { 
  useClientAccountsInfiniteQuery, 
  useCreateClientAccountMutation, 
  useDeleteClientAccountMutation 
} from '@/hooks/queries/useClientAccountsQuery';
import { ClientAccount } from '@/types/clientAccount';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AdminScreen() {
  const isSuperAdmin = useIsSuperAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    clientAccount: ClientAccount | null;
  }>({ visible: false, clientAccount: null });

  const [formData, setFormData] = useState({
    companyName: '',
    siret: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    contactEmail: '',
  });

  const [isCreating, setIsCreating] = useState(false);

  const {
    data: clientAccounts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error,
  } = useClientAccountsInfiniteQuery();

  const createMutation = useCreateClientAccountMutation();
  const deleteMutation = useDeleteClientAccountMutation();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBlue = useThemeColor({}, 'cardBlue');

  const { t } = useTranslation();

  // Redirect non-super admins
  if (!isSuperAdmin) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.unauthorizedContainer}>
          <IconSymbol name="shield.slash" size={64} color={secondaryTextColor} />
          <Text style={[styles.unauthorizedText, { color: textColor }]}>
            Accès non autorisé
          </Text>
          <Text style={[styles.unauthorizedSubtext, { color: secondaryTextColor }]}>
            Vous n&apos;avez pas les permissions nécessaires pour accéder à cette page.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleClientAccountPress = (clientAccount: ClientAccount) => {
    // For now, just show details. Later we can navigate to a detail page
    console.log('Client account pressed:', clientAccount);
  };

  const handleEditClientAccount = (clientAccount: ClientAccount) => {
    // TODO: Implement edit modal
    Alert.alert('Fonctionnalité à venir', 'La modification des comptes clients sera bientôt disponible.');
  };

  const handleDeleteClientAccount = (clientAccount: ClientAccount) => {
    setDeleteModal({ visible: true, clientAccount });
  };

  const handleViewUsers = (clientAccount: ClientAccount) => {
    // For now, just show an alert. Later we can implement user management
    Alert.alert('Fonctionnalité à venir', 'La gestion des utilisateurs sera bientôt disponible.');
  };

  const confirmDelete = async () => {
    if (!deleteModal.clientAccount) return;

    try {
      await deleteMutation.mutateAsync(deleteModal.clientAccount.id);
      setDeleteModal({ visible: false, clientAccount: null });
      Alert.alert(t.common.success, t.admin.clientAccountDeleted);
    } catch (error: any) {
      Alert.alert(t.common.error, error.message || t.admin.clientAccountDeleted);
    }
  };

  const handleCreateClientAccount = async () => {
    if (!formData.companyName.trim()) {
      Alert.alert(t.common.error, 'Le nom de l\'entreprise est requis.');
      return;
    }

    try {
      setIsCreating(true);
      await createMutation.mutateAsync(formData);
      setIsCreateModalVisible(false);
      setFormData({
        companyName: '',
        siret: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
        contactEmail: '',
      });
      Alert.alert(t.common.success, t.admin.clientAccountCreated);
    } catch (error: any) {
      Alert.alert(t.common.error, error.message || t.admin.clientAccountCreated);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefresh = async () => {
    refetch();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBlue, borderBottomColor: borderColor }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: textColor }]}>{t.admin.title}</Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
              {t.admin.clientAccounts}
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.refreshButton, { backgroundColor: 'rgba(126, 159, 120, 0.15)' }]}
              onPress={handleRefresh}
              activeOpacity={0.7}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color={tintColor} />
              ) : (
                <IconSymbol name="arrow.clockwise" size={20} color={tintColor} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: tintColor }]}
              onPress={() => setIsCreateModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.addButtonText, { color: '#FFFFFF' }]}>
                {t.admin.addClientAccount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder={t.admin.searchPlaceholder}
          />
        </View>
      </View>

      {/* Client Accounts List */}
      <ClientAccountList
        data={clientAccounts}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        error={error}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onClientAccountPress={handleClientAccountPress}
        onEditClientAccount={handleEditClientAccount}
        onDeleteClientAccount={handleDeleteClientAccount}
        onViewUsers={handleViewUsers}
      />

      {/* Create Client Account Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {t.admin.addClientAccount}
            </Text>
            <TouchableOpacity onPress={() => setIsCreateModalVisible(false)}>
              <IconSymbol name="xmark" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>
                {t.admin.companyName} *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                placeholder={t.admin.companyName}
                placeholderTextColor={secondaryTextColor}
                value={formData.companyName}
                onChangeText={(text) => setFormData({ ...formData, companyName: text })}
                editable={!isCreating}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.admin.siret}</Text>
              <TextInput
                style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                placeholder={t.admin.siret}
                placeholderTextColor={secondaryTextColor}
                value={formData.siret}
                onChangeText={(text) => setFormData({ ...formData, siret: text })}
                editable={!isCreating}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.admin.address}</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                placeholder={t.admin.address}
                placeholderTextColor={secondaryTextColor}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!isCreating}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.admin.city}</Text>
              <TextInput
                style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                placeholder={t.admin.city}
                placeholderTextColor={secondaryTextColor}
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                editable={!isCreating}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.admin.postalCode}</Text>
              <TextInput
                style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                placeholder={t.admin.postalCode}
                placeholderTextColor={secondaryTextColor}
                value={formData.postalCode}
                onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
                editable={!isCreating}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.admin.country}</Text>
              <TextInput
                style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                placeholder={t.admin.country}
                placeholderTextColor={secondaryTextColor}
                value={formData.country}
                onChangeText={(text) => setFormData({ ...formData, country: text })}
                editable={!isCreating}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.admin.phone}</Text>
              <TextInput
                style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                placeholder={t.admin.phone}
                placeholderTextColor={secondaryTextColor}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                editable={!isCreating}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.admin.contactEmail}</Text>
              <TextInput
                style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                placeholder={t.admin.contactEmail}
                placeholderTextColor={secondaryTextColor}
                value={formData.contactEmail}
                onChangeText={(text) => setFormData({ ...formData, contactEmail: text })}
                keyboardType="email-address"
                editable={!isCreating}
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { backgroundColor: borderColor }]}
              onPress={() => {
                setIsCreateModalVisible(false);
                setFormData({
                  companyName: '',
                  siret: '',
                  address: '',
                  city: '',
                  postalCode: '',
                  country: '',
                  phone: '',
                  contactEmail: '',
                });
              }}
              disabled={isCreating}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelButtonText, { color: textColor }]}>
                {t.common.cancel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton, { backgroundColor: tintColor }, isCreating && styles.disabledButton]}
              onPress={handleCreateClientAccount}
              disabled={isCreating}
              activeOpacity={0.8}
            >
              <Text style={[styles.submitButtonText, { color: '#FFFFFF' }]}>
                {isCreating ? t.common.loading : t.common.add}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        visible={deleteModal.visible}
        title={t.admin.deleteClientAccount}
        message={t.admin.confirmDeleteClient}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ visible: false, clientAccount: null })}
        isDeleting={deleteMutation.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  unauthorizedText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  unauthorizedSubtext: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});