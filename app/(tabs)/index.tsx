import { SearchBar, ErrorMessage } from '@/components/molecules';
import { LoadingSpinner } from '@/components/atoms';
import InfiniteList from '@/components/InfiniteList';
import { RoomCard } from '@/components/organisms';
import { useRoomsInfiniteQuery, useCreateRoomMutation } from '@/hooks/queries/useRoomsInfiniteQuery';
import { Room } from '@/types/room';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View, Modal, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import { IconSymbol } from '@/components/ui/icon-symbol';


// Breakpoint for desktop layout
const DESKTOP_BREAKPOINT = 768;

export default function HomeScreen() {
  const router = useRouter();
  const { 
    data: rooms, 
    isLoading, 
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    error 
  } = useRoomsInfiniteQuery();
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

  const handleCreateRoom = async () => {
    try {
      setIsCreating(true);
      await createMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        captureTypes: [], // Empty array for now
      });
      setIsModalVisible(false);
      setFormData({ name: '', description: '' });
      Alert.alert(t.common.success, t.addRoom.success);
    } catch (error: any) {
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
          style={styles.errorMessage}
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
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>{t.addRoom.title}</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <IconSymbol name="xmark" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: textColor }]}>{t.addRoom.title}</Text>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.addRoom.nameLabel} *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  placeholder={t.addRoom.namePlaceholder}
                  placeholderTextColor={secondaryTextColor}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  editable={!isCreating}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.addRoom.descriptionLabel}</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  placeholder={t.addRoom.descriptionPlaceholder}
                  placeholderTextColor={secondaryTextColor}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!isCreating}
                />
              </View>
            </ScrollView>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { backgroundColor: borderColor }]}
              onPress={() => {
                setIsModalVisible(false);
                setFormData({ name: '', description: '' });
              }}
              disabled={isCreating}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelButtonText, { color: textColor }]}>{t.addRoom.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton, { backgroundColor: tintColor }, isCreating && styles.disabledButton]}
              onPress={handleCreateRoom}
              disabled={isCreating}
              activeOpacity={0.8}
            >
              <Text style={[styles.submitButtonText, { color: '#FFFFFF' }]}>
                {isCreating ? t.addRoom.creating : t.addRoom.create}
              </Text>
            </TouchableOpacity>
          </View>
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
});