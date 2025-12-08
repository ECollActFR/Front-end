import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AcquisitionSystem } from '@/types/acquisitionSystem';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import StatusBadge from '@/components/atoms/StatusBadge';

interface AcquisitionSystemSelectorModalProps {
  visible: boolean;
  currentSystemId?: number;
  roomId: number;
  onSystemSelect: (system: AcquisitionSystem | null) => void;
  onClose: () => void;
}

export default function AcquisitionSystemSelectorModal({
  visible,
  currentSystemId,
  roomId,
  onSystemSelect,
  onClose
}: AcquisitionSystemSelectorModalProps) {
  const insets = useSafeAreaInsets();
  const [availableSystems, setAvailableSystems] = useState<AcquisitionSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      loadAvailableSystems();
    }
  }, [visible, roomId]);

  const loadAvailableSystems = async () => {
    try {
      setLoading(true);
      // Import here to avoid circular dependencies
      const { acquisitionSystemService } = await import('@/services/acquisitionSystemService');
      const systems = await acquisitionSystemService.getAcquisitionSystems();
      setAvailableSystems(systems);
      
      // Set current selection
      if (currentSystemId) {
        setSelectedSystemId(currentSystemId);
      }
    } catch (error) {
      console.error('Error loading available systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSelect = (system: AcquisitionSystem) => {
    setSelectedSystemId(system.id);
  };

  const handleConfirm = () => {
    const selectedSystem = availableSystems.find(sys => sys.id === selectedSystemId);
    onSystemSelect(selectedSystem || null);
    onClose();
  };

  const filteredSystems = availableSystems.filter(system =>
    system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    system.deviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor, borderBottomColor: secondaryTextColor }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelButton, { color: secondaryTextColor }]}>{t.common?.cancel || 'Annuler'}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {t.editRoom?.acquisitionSystemLabel || 'Sélectionner un système'}
          </Text>
          <TouchableOpacity onPress={handleConfirm} disabled={loading}>
            <Text style={[styles.confirmButton, { color: tintColor }, loading && styles.confirmButtonDisabled]}>
              {t.common?.confirm || 'Confirmer'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={tintColor} />
          </View>
        ) : (
          <ScrollView style={styles.content}>
            {/* Search Bar */}
            {availableSystems.length > 5 && (
              <View style={styles.searchContainer}>
                <TextInput
                  style={[styles.searchInput, { backgroundColor, borderWidth: 1, borderColor: secondaryTextColor, color: textColor }]}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={t.common?.search || 'Rechercher...'}
                  placeholderTextColor={secondaryTextColor}
                />
              </View>
            )}

            {/* No System Option */}
            <TouchableOpacity
              style={[styles.systemOption, { backgroundColor }, selectedSystemId === null && styles.selectedOption]}
              onPress={() => setSelectedSystemId(null)}
            >
              <View style={styles.systemInfo}>
                <Text style={[styles.systemName, { color: textColor }]}>
                  {t.editRoom?.noAcquisitionSystem || 'Aucun système d\'acquisition'}
                </Text>
                <Text style={[styles.systemDescription, { color: secondaryTextColor }]}>
                  Retirer le système d&apos;acquisition de cette salle
                </Text>
              </View>
              <View style={[styles.radio, { borderColor: tintColor }]}>
                {selectedSystemId === null && (
                  <View style={[styles.radioSelected, { backgroundColor: tintColor }]} />
                )}
              </View>
            </TouchableOpacity>

            {/* Available Systems */}
            {filteredSystems.length === 0 && searchQuery ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
                  Aucun résultat trouvé
                </Text>
              </View>
            ) : (
              filteredSystems.map(system => (
                <TouchableOpacity
                  key={system.id}
                  style={[styles.systemOption, { backgroundColor }, selectedSystemId === system.id && styles.selectedOption]}
                  onPress={() => handleSystemSelect(system)}
                >
                  <View style={styles.systemInfo}>
                    <View style={styles.systemHeader}>
                      <Text style={[styles.systemName, { color: textColor }]}>{system.name}</Text>
                      <StatusBadge status={system.systemStatus} />
                    </View>
                    <Text style={[styles.systemDescription, { color: secondaryTextColor }]}>
                      {system.deviceType} • {system.firmwareVersion}
                    </Text>
                    <View style={styles.systemStats}>
                      <Text style={[styles.statText, { color: secondaryTextColor }]}>
                        {system.activeSensorsCount} capteurs actifs
                      </Text>
                      <Text style={[styles.statText, { color: secondaryTextColor }]}>
                        {system.enabledTasksCount} tâches activées
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.radio, { borderColor: tintColor }]}>
                    {selectedSystemId === system.id && (
                      <View style={[styles.radioSelected, { backgroundColor: tintColor }]} />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}

            {/* Empty State */}
            {!loading && availableSystems.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
                  Aucun système d&apos;acquisition disponible
                </Text>
                <Text style={[styles.emptySubtext, { color: secondaryTextColor }]}>
                  Tous les systèmes sont déjà assignés à d&apos;autres salles
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 16,
  },
  confirmButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
  },
  systemOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderWidth: 2,
  },
  systemInfo: {
    flex: 1,
  },
  systemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  systemName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  systemDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  systemStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});