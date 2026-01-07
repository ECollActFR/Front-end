import { SearchBar, ErrorMessage } from '@/components/molecules';
import { LoadingSpinner } from '@/components/atoms';
import InfiniteList from '@/components/InfiniteList';
import { RoomCard } from '@/components/organisms';
import { useRoomsInfiniteQuery, useCreateRoomMutation } from '@/hooks/queries/useRoomsInfiniteQuery';
import { Room } from '@/types/room';
import { useRouter } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StyleSheet, Text, useWindowDimensions, View, Modal, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { roomService } from '@/services/roomService';
import { acquisitionSystemService } from '@/services/acquisitionSystemService';
import { buildingService } from '@/services/buildingService';
import { ApiCaptureType } from '@/types/room';
import { AcquisitionSystem } from '@/types/acquisitionSystem';
import { ApiBuilding } from '@/services/buildingService';
import AcquisitionSystemSummary from '@/components/molecules/AcquisitionSystemSummary';
import AcquisitionSystemSelectorModal from '@/components/molecules/AcquisitionSystemSelectorModal';


// Breakpoint for desktop layout
const DESKTOP_BREAKPOINT = 768;

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { 
    data: rooms, 
    isLoading, 
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error 
  } = useRoomsInfiniteQuery(isAuthenticated);
  const createMutation = useCreateRoomMutation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const { width } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  
  // New states for capture types and acquisition system
  const [selectedCaptureTypes, setSelectedCaptureTypes] = useState<number[]>([]);
  const [captureTypes, setCaptureTypes] = useState<ApiCaptureType[]>([]);
  const [selectedAcquisitionSystem, setSelectedAcquisitionSystem] = useState<string>('');
  const [currentAcquisitionSystem, setCurrentAcquisitionSystem] = useState<AcquisitionSystem | null>(null);
  const [showSystemSelector, setShowSystemSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // States for buildings
  const [buildings, setBuildings] = useState<ApiBuilding[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBlue = useThemeColor({}, 'cardBlue');

  const { t } = useTranslation();

  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const numColumns = isDesktop ? 3 : 1;

  const filteredRooms = useMemo(() => {
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [rooms, searchTerm]);

  const handleRoomPress = (roomId: number) => {
    router.push(`/room/${roomId}`);
  };

  useEffect(() => {
    if (isModalVisible) {
      loadData();
    }
  }, [isModalVisible]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [captureTypesData, acquisitionSystemsData, buildingsData] = await Promise.all([
        roomService.getCaptureTypes(),
        acquisitionSystemService.getAcquisitionSystems(),
        buildingService.getBuildings(),
      ]);
      setCaptureTypes(captureTypesData);
      setBuildings(buildingsData);
      
      // Reset selections for new room
      setSelectedCaptureTypes([]);
      setSelectedAcquisitionSystem('');
      setCurrentAcquisitionSystem(null);
      // Set default building if not already selected
      if (!selectedBuildingId && buildingsData.length > 0) {
        setSelectedBuildingId(buildingsData[0]?.id || null);
      }
    } catch (error: any) {
      console.error('Error loading form data:', error);
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

  const handleCreateRoom = async () => {
    // Validation à la soumission uniquement
    if (!formData.name.trim()) {
      Alert.alert(t.common.error, t.addRoom.nameRequired);
      return;
    }

    if (!selectedBuildingId) {
      Alert.alert(t.common.error, 'Le bâtiment est requis');
      return;
    }

    try {
      setIsCreating(true);
      // Convert numeric IDs back to IRIs for API submission
      const captureTypeIris = selectedCaptureTypes.map(id => `/capture_types/${id}`);
      
      const payload = {
        name: formData.name,
        description: formData.description,
        captureTypes: captureTypeIris,
        acquisitionSystem: selectedAcquisitionSystem || undefined,
        buildingId: selectedBuildingId,
      };
      
      console.log('🚀 BEFORE MUTATION - Sending payload to API:', JSON.stringify(payload, null, 2));
      console.log('🏢 BEFORE MUTATION - selectedBuildingId:', selectedBuildingId);
      
      // Additional check using buildingId instead of buildingIRI
      if (!selectedBuildingId) {
        Alert.alert(t.common.error, 'Erreur: Aucun bâtiment sélectionné');
        return;
      }
      
      // Log before calling mutation
      console.log('🔥 CALLING createMutation.mutateAsync with payload:', payload);
      const result = await createMutation.mutateAsync(payload);
      console.log('✅ MUTATION SUCCESSFUL, result:', result);
      setIsModalVisible(false);
      setFormData({ name: '', description: '' });
      setSelectedCaptureTypes([]);
      setSelectedAcquisitionSystem('');
      setCurrentAcquisitionSystem(null);
      setSelectedBuildingId(null);
      Alert.alert(t.common.success, t.addRoom.success);
    } catch (error: any) {
      console.error('❌ Error creating room:', error);
      Alert.alert(t.common.error, error.message || t.addRoom.error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefresh = async () => {
    refetch();
  };

  const renderRoom = ({ item, index }: { item: Room; index: number }) => (
    <View style={isDesktop ? styles.gridItem : styles.listItem}>
      <RoomCard room={item} onPress={() => handleRoomPress(item.id)} index={index} />
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: secondaryTextColor }]}>{t.home.noRooms}</Text>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: cardBlue, borderBottomColor: borderColor }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: textColor }]}>{t.home.title}</Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>{t.home.subtitle}</Text>
          </View>
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: cardBlue, borderBottomColor: borderColor }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: textColor }]}>{t.home.title}</Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>{t.home.subtitle}</Text>
          </View>
        </View>
        <ErrorMessage
          message={error.message || t.home.error}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>

      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBlue, borderBottomColor: borderColor }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: textColor }]}>{t.home.title}</Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>{t.home.subtitle}</Text>
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
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.addButtonText, { color: '#FFFFFF' }]}>{t.home.addButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar value={searchTerm} onChangeText={setSearchTerm} placeholder={t.home.searchPlaceholder} />
      </View>

      {/* Rooms List */}
      <InfiniteList
        key={`rooms-list-${numColumns}`}
        data={filteredRooms}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        error={error}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        emptyMessage={t.home.noRooms}
        loadingMoreText={t.admin.loadingMore}
        renderItem={({ item, index }) => (
          <View style={isDesktop ? styles.gridItem : styles.listItem}>
            <RoomCard room={item} onPress={() => handleRoomPress(item.id)} index={index} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          isDesktop && styles.gridContent,
        ]}
        numColumns={numColumns}
        columnWrapperStyle={isDesktop ? styles.columnWrapper : undefined}
      />

      {/* Add Room Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor }]}>
          <View style={[styles.modalHeader, { paddingTop: 60, backgroundColor, borderBottomColor: borderColor }]}>
            <TouchableOpacity onPress={() => {
              setIsModalVisible(false);
              setFormData({ name: '', description: '' });
              setSelectedCaptureTypes([]);
              setSelectedAcquisitionSystem('');
              setCurrentAcquisitionSystem(null);
              setSelectedBuildingId(null);
            }}>
              <Text style={[styles.cancelButton, { color: secondaryTextColor }]}>{t.addRoom.cancel}</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: textColor }]}>{t.addRoom.title}</Text>
            <TouchableOpacity onPress={handleCreateRoom} disabled={isCreating}>
              <Text style={[styles.saveButton, { color: tintColor }, isCreating && styles.saveButtonDisabled]}>
                {isCreating ? t.addRoom.creating : t.addRoom.create}
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
                <Text style={[styles.label, { color: textColor }]}>{t.addRoom.nameLabel} *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder={t.addRoom.namePlaceholder}
                  placeholderTextColor={secondaryTextColor}
                  editable={!isCreating}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.addRoom.buildingLabel} *</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={[styles.buildingSelector, { backgroundColor, borderColor: secondaryTextColor }]}
                  contentContainerStyle={styles.buildingSelectorContent}
                >
                  {buildings.map((building) => (
                    <TouchableOpacity
                      key={building.id}
                      style={[
                        styles.buildingOption,
                        { 
                          backgroundColor: selectedBuildingId === building.id ? tintColor : backgroundColor,
                          borderColor: selectedBuildingId === building.id ? tintColor : secondaryTextColor
                        }
                      ]}
                      onPress={() => setSelectedBuildingId(building.id)}
                      disabled={isCreating || loading}
                    >
                      <Text style={[
                        styles.buildingOptionText,
                        { 
                          color: selectedBuildingId === building.id ? '#FFFFFF' : textColor 
                        }
                      ]}>
                        {building.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.addRoom.descriptionLabel}</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder={t.addRoom.descriptionPlaceholder}
                  placeholderTextColor={secondaryTextColor}
                  multiline
                  numberOfLines={4}
                  editable={!isCreating}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.addRoom.sensorTypesLabel}</Text>
                {captureTypes.map(captureType => {
                  const isSelected = selectedCaptureTypes.includes(captureType.id);
                  
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
                <Text style={[styles.label, { color: textColor }]}>{t.addRoom.acquisitionSystemLabel}</Text>
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
            roomId={0} // Use 0 for new room
            onSystemSelect={handleSystemSelect}
            onClose={() => setShowSystemSelector(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
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
    minWidth: 100,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: {
    padding: 16,
  },
  gridContent: {
    paddingHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    marginBottom: 12,
  },
  listItem: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorMessage: {
    margin: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    flex: 1,
  },
  selectArrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  buildingSelector: {
    maxHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
  },
  buildingSelectorContent: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buildingOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buildingOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});