import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { roomService } from '@/services/roomService';
import { acquisitionSystemService } from '@/services/acquisitionSystemService';
import { buildingService, ApiBuilding } from '@/services/buildingService';
import { ApiCaptureType, buildingUtils } from '@/types/room';
import { AcquisitionSystem } from '@/types/acquisitionSystem';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import AcquisitionSystemSummary from '@/components/molecules/AcquisitionSystemSummary';
import AcquisitionSystemSelectorModal from '@/components/molecules/AcquisitionSystemSelectorModal';



interface RoomEditModalProps {
  visible: boolean;
  roomId: number;
  onClose: () => void;
  onSave: () => void;
}

export default function RoomEditModal({ visible, roomId, onClose, onSave }: RoomEditModalProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCaptureTypes, setSelectedCaptureTypes] = useState<number[]>([]);
  const [captureTypes, setCaptureTypes] = useState<ApiCaptureType[]>([]);

  const [selectedAcquisitionSystem, setSelectedAcquisitionSystem] = useState<string>('');
  const [currentAcquisitionSystem, setCurrentAcquisitionSystem] = useState<AcquisitionSystem | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | undefined>(undefined);
  const [buildings, setBuildings] = useState<ApiBuilding[]>([]);
  const [showSystemSelector, setShowSystemSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, roomId]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('RoomEditModal - Loading data for roomId:', roomId);
      const [roomData, captureTypesData, acquisitionSystemsData, buildingsData] = await Promise.all([
        roomService.getRoom(roomId),
        roomService.getCaptureTypes(),
        acquisitionSystemService.getAcquisitionSystems(),
        buildingService.getBuildings(),
      ]);
      console.log('RoomEditModal - Room data received:', roomData);
      console.log('RoomEditModal - Full roomData structure:', JSON.stringify(roomData, null, 2));
      console.log('RoomEditModal - Room name:', roomData.name);
      console.log('RoomEditModal - Room description:', roomData.description);
      console.log('RoomEditModal - Room captureTypes:', roomData.captureTypes);
      console.log('RoomEditModal - roomData.acquisitionSystems:', roomData.acquisitionSystems);
      console.log('RoomEditModal - Capture types data:', captureTypesData);
      console.log('RoomEditModal - Acquisition systems data:', acquisitionSystemsData);
      
      setName(roomData.name);
      setDescription(roomData.description || '');
      // Extract numeric IDs from room capture types
      const selectedCaptureTypeIds = Array.isArray(roomData.captureTypes) 
        ? roomData.captureTypes.map((ct: any) => typeof ct === 'object' && ct.id ? ct.id : 0)
        : [];
      
      // Debug logs to see data
      console.log('RoomEditModal - selectedCaptureTypeIds (from room):', selectedCaptureTypeIds);
      console.log('RoomEditModal - captureTypes from API (with IDs):', captureTypesData.map(ct => ({ id: ct.id, name: ct.name, '@id': ct['@id'] })));
      
      setSelectedCaptureTypes(selectedCaptureTypeIds);
      setCaptureTypes(captureTypesData);
      setBuildings(buildingsData);
      
      // Extract building ID from room data
      const buildingId = buildingUtils.extractId((roomData as any).building);
      setSelectedBuildingId(buildingId);
      
      // Set current acquisition system if available
      let currentSystemIri = '';
      if (roomData.acquisitionSystems) {
        if (Array.isArray(roomData.acquisitionSystems) && roomData.acquisitionSystems.length > 0) {
          // Take first system if multiple
          const firstSystem = roomData.acquisitionSystems[0] as any;
          currentSystemIri = firstSystem['@id'] || `/acquisition_systems/${firstSystem.id}`;
        } else if ((roomData.acquisitionSystems as any)['@id']) {
          // Direct object
          currentSystemIri = (roomData.acquisitionSystems as any)['@id'];
        }
      }
      setSelectedAcquisitionSystem(currentSystemIri);
      
      // Find the current system object from the loaded systems
      if (currentSystemIri) {
        const currentSystem = acquisitionSystemsData.find(sys => 
          `/acquisition_systems/${sys.id}` === currentSystemIri || currentSystemIri.includes(`/acquisition_systems/${sys.id}`)
        );
        setCurrentAcquisitionSystem(currentSystem || null);
        console.log('RoomEditModal - Found current system:', currentSystem);
      } else {
        setCurrentAcquisitionSystem(null);
      }
      
      console.log('RoomEditModal - Current acquisition system:', currentSystemIri);
      
      console.log('RoomEditModal - Form state after loading:');
      console.log('  - name:', roomData.name);
      console.log('  - description:', roomData.description || '');
      console.log('  - selectedCaptureTypeIds:', selectedCaptureTypeIds);
      console.log('  - selectedAcquisitionSystem:', currentAcquisitionSystem);
    } catch (error: any) {
      console.error('Error loading data:', error);
      
      // Ne pas afficher d'erreur locale pour les erreurs 401/403
      // Laisser AuthContext gérer globalement
      if (error.status !== 401 && error.status !== 403) {
        // Pourrait afficher une alerte ici si nécessaire pour les autres erreurs
        console.log('Non-auth error in RoomEditModal:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCaptureType = (captureTypeId: number) => {
    setSelectedCaptureTypes(prev => {
      if (prev.includes(captureTypeId)) {
        return prev.filter(id => id !== captureTypeId);
      } else {
        return [...prev, captureTypeId];
      }
    });
  };

  const handleSystemSelect = (system: AcquisitionSystem | null) => {
    setCurrentAcquisitionSystem(system);
    setSelectedAcquisitionSystem(system ? `/acquisition_systems/${system.id}` : '');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('RoomEditModal - Saving room with data:', {
        name,
        description,
        captureTypes: selectedCaptureTypes,
        acquisitionSystem: selectedAcquisitionSystem || undefined,
      });
      
      // Convert numeric IDs back to IRIs for API submission
      const captureTypeIris = selectedCaptureTypes.map(id => `/capture_types/${id}`);
      
      await roomService.updateRoom(roomId, {
        name,
        description,
        captureTypes: captureTypeIris,
        acquisitionSystem: selectedAcquisitionSystem || undefined,
        buildingId: selectedBuildingId,
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor }]}>
        <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor, borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelButton, { color: secondaryTextColor }]}>{t.editRoom.cancel}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>{t.editRoom.title}</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveButton, { color: tintColor }, saving && styles.saveButtonDisabled]}>
              {saving ? t.editRoom.saving : t.editRoom.save}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={tintColor} />
          </View>
        ) : (
          <ScrollView style={styles.content}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.editRoom.nameLabel}</Text>
              <TextInput
                style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                value={name}
                onChangeText={setName}
                placeholder={t.editRoom.namePlaceholder}
                placeholderTextColor={secondaryTextColor}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.editRoom.descriptionLabel}</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                value={description}
                onChangeText={setDescription}
                placeholder={t.editRoom.descriptionPlaceholder}
                placeholderTextColor={secondaryTextColor}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>Bâtiment</Text>
              <ScrollView style={[styles.buildingList, { backgroundColor, borderColor: secondaryTextColor }]}>
                {buildings.map(building => {
                  const isSelected = selectedBuildingId === building.id;
                  return (
                    <TouchableOpacity
                      key={building.id}
                      style={[
                        styles.buildingOption,
                        { backgroundColor: isSelected ? tintColor : backgroundColor, borderColor: secondaryTextColor }
                      ]}
                      onPress={() => setSelectedBuildingId(building.id)}
                    >
                      <Text style={[
                        styles.buildingName,
                        { color: isSelected ? backgroundColor : textColor }
                      ]}>
                        {building.name}
                      </Text>
                      <Text style={[
                        styles.buildingAddress,
                        { color: isSelected ? backgroundColor : secondaryTextColor }
                      ]}>
                        {building.address && `${building.address}, `}
                        {building.city && `${building.city} `}
                        {building.postalCode}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {buildings.length === 0 && (
                  <Text style={[styles.noBuildings, { color: secondaryTextColor }]}>
                    Aucun bâtiment disponible
                  </Text>
                )}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.editRoom.sensorTypesLabel}</Text>
              {captureTypes.map(captureType => {
                // Use numeric ID comparison
                const isSelected = selectedCaptureTypes.includes(captureType.id);
                
                // Debug log to see comparison
                console.log('Checkbox comparison:', {
                  captureTypeName: captureType.name,
                  captureTypeId: captureType.id,
                  selectedCaptureTypes,
                  isSelected
                });
                
                return (
                  <TouchableOpacity
                    key={captureType.id}
                    style={[styles.checkbox, { backgroundColor, borderColor: secondaryTextColor }]}
                    onPress={() => toggleCaptureType(captureType.id)}
                  >
                    <View style={[
                      styles.checkboxBox,
                      { borderColor: tintColor },
                      isSelected && { backgroundColor: tintColor }
                    ]}>
                      {isSelected && (
                        <Text style={[styles.checkboxCheck, { color: backgroundColor }]}>✓</Text>
                      )}
                    </View>
                    <View style={styles.checkboxLabel}>
                      <Text style={[styles.checkboxText, { color: textColor }]}>{captureType.name}</Text>
                      <Text style={[styles.checkboxDescription, { color: secondaryTextColor }]}>{captureType.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: textColor }]}>{t.editRoom.acquisitionSystemLabel || 'Système d\'acquisition'}</Text>
              <AcquisitionSystemSummary
                system={currentAcquisitionSystem}
                onPress={() => setShowSystemSelector(true)}
                loading={loading}
              />
            </View>
          </ScrollView>
        )}
        
        {/* Acquisition System Selector Modal */}
        <AcquisitionSystemSelectorModal
          visible={showSystemSelector}
          currentSystemId={currentAcquisitionSystem?.id}
          roomId={roomId}
          onSystemSelect={handleSystemSelect}
          onClose={() => setShowSystemSelector(false)}
        />
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
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
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
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCheck: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  checkboxDescription: {
    fontSize: 14,
  },
  buildingList: {
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
  },
  buildingOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 4,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  buildingAddress: {
    fontSize: 14,
  },
  noBuildings: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
});
