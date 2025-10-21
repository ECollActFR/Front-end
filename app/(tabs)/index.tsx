import { LoadingSpinner } from '@/components/atoms';
import Button from '@/components/atoms/Button';
import { ErrorMessage, SearchBar } from '@/components/molecules';
import { RoomCard } from '@/components/organisms';
import { useRooms } from '@/hooks/useRooms';
import { Room } from '@/types/room';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, useWindowDimensions, View, Modal, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

// Breakpoint for desktop layout
const DESKTOP_BREAKPOINT = 768;

export default function HomeScreen() {
  const router = useRouter();
  const { rooms, isLoading, error, refetch, addRoom } = useRooms();
  const [searchTerm, setSearchTerm] = useState('');
  const { width } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

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
    if (!formData.name.trim()) {
      Alert.alert(t.common.error, t.addRoom.nameRequired);
      return;
    }

    try {
      setIsCreating(true);
      await addRoom({
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

  const renderRoom = ({ item }: { item: Room }) => (
    <View style={isDesktop ? styles.gridItem : styles.listItem}>
      <RoomCard room={item} onPress={() => handleRoomPress(item.id)} />
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
        <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
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
        <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
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
      <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: textColor }]}>{t.home.title}</Text>
              <Text style={[styles.subtitle, { color: secondaryTextColor }]}>{t.home.subtitle}</Text>
            </View>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: tintColor }]}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.addButtonText, { color: backgroundColor }]}>{t.home.addButton}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar value={searchTerm} onChangeText={setSearchTerm} placeholder={t.home.searchPlaceholder} />
        </View>
      </View>

      {/* Rooms List */}
      <FlatList
        key={numColumns} // Force re-render when columns change
        data={filteredRooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={[
          styles.listContent,
          isDesktop && styles.gridContent,
        ]}
        columnWrapperStyle={isDesktop ? styles.columnWrapper : undefined}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Room Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor }]}>
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

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton, { backgroundColor, borderColor: secondaryTextColor }]}
                  onPress={() => {
                    setIsModalVisible(false);
                    setFormData({ name: '', description: '' });
                  }}
                  disabled={isCreating}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cancelButtonText, { color: secondaryTextColor }]}>{t.addRoom.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton, { backgroundColor: tintColor }, isCreating && styles.disabledButton]}
                  onPress={handleCreateRoom}
                  disabled={isCreating}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.submitButtonText, { color: backgroundColor }]}>
                    {isCreating ? t.addRoom.creating : t.addRoom.create}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  gridContent: {
    paddingHorizontal: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 16,
  },
  gridItem: {
    flex: 1,
    maxWidth: '32%',
  },
  listItem: {
    width: '100%',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
