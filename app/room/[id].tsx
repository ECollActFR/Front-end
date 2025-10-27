import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoadingSpinner, Button } from '@/components/atoms';
import { ErrorMessage, AmenityChip, ConfirmDeleteModal, EquipmentItem } from '@/components/molecules';
import { SensorCard, RoomEditModal } from '@/components/organisms';
import { useRoomDetail } from '@/hooks/useRoomDetail';
import Icon from '@/components/atoms/Icon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { roomService } from '@/services/roomService';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

// Breakpoint for desktop layout
const DESKTOP_BREAKPOINT = 768;

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const roomId = parseInt(id || '0', 10);
  const { roomDetail, isLoading, error, refetch } = useRoomDetail(roomId);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const tintColor = useThemeColor({}, 'tint');
  const accentOrange = useThemeColor({}, 'accentOrange');
  const backgroundColor = useThemeColor({}, 'background');
  const backgroundSecondary = useThemeColor({}, 'backgroundSecondary');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');

  const { t } = useTranslation();

  const isDesktop = width >= DESKTOP_BREAKPOINT;

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage message={error.message || 'Une erreur est survenue'} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  // Room not found
  if (!roomDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorMessage
          message="Salle introuvable"
          onRetry={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const handleEditSave = () => {
    refetch();
  };

  const handleDeleteClick = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await roomService.deleteRoom(roomId);
      setIsDeleteModalVisible(false);
      // Navigate back and force a refresh by replacing the route
      router.replace('/');
    } catch (error: any) {
      console.error('Error deleting room:', error);
      setIsDeleting(false);
      setIsDeleteModalVisible(false);

      // Check if it's a constraint violation error
      if (error?.message?.includes('constraint') || error?.message?.includes('foreign key')) {
        alert('Impossible de supprimer cette salle car elle contient des données de capteurs. Veuillez d\'abord supprimer les données associées.');
      } else {
        alert('Une erreur est survenue lors de la suppression de la salle.');
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with buttons */}
        <View style={[styles.headerButtons, { paddingTop: insets.top + 16, backgroundColor, borderBottomColor: borderColor }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="chevron-right" size={24} color={textColor} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <View style={styles.headerRightButtons}>
            <TouchableOpacity style={[styles.deleteButton, { backgroundColor: backgroundSecondary }]} onPress={handleDeleteClick}>
              <IconSymbol name="trash" size={20} color={accentOrange} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: backgroundSecondary }]} onPress={() => setIsEditModalVisible(true)}>
              <Text style={[styles.editButtonText, { color: tintColor }]}>{t.room.edit}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Room Details */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: textSecondary }]}>{roomDetail.name}</Text>
            {roomDetail.description && <Text style={[styles.description, { color: textSecondary }]}>{roomDetail.description}</Text>}
          </View>

          {/* Sensor Data Section */}
          {roomDetail.lastCapturesByType && roomDetail.lastCapturesByType.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textSecondary }]}>{t.room.realTimeData}</Text>
              <View style={[styles.sensorsGrid, isDesktop && styles.sensorsGridDesktop]}>
                {roomDetail.lastCapturesByType.map((captureData, index) => (
                  <View
                    key={captureData.type.id}
                    style={[
                      styles.sensorCardWrapper,
                      isDesktop && styles.sensorCardWrapperDesktop
                    ]}
                  >
                    <SensorCard captureData={captureData} />
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Equipment Section */}
          {roomDetail.equipment && roomDetail.equipment.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textSecondary }]}>{t.room.equipment}</Text>
              <View>
                {roomDetail.equipment.map((equipment) => (
                  <EquipmentItem key={equipment.id} equipment={equipment} />
                ))}
              </View>
            </View>
          )}

          {/* Amenities Section */}
          {roomDetail.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textSecondary }]}>{t.room.amenities}</Text>
              <View style={styles.amenitiesContainer}>
                {roomDetail.amenities.map((amenity, index) => (
                  <AmenityChip key={`${amenity}-${index}`} type={amenity} />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <RoomEditModal
        visible={isEditModalVisible}
        roomId={roomId}
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        visible={isDeleteModalVisible}
        roomName={roomDetail?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDeleting={isDeleting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sensorsGrid: {
    gap: 16,
  },
  sensorsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sensorCardWrapper: {
    width: '100%',
  },
  sensorCardWrapperDesktop: {
    width: '32%',
    minWidth: 250,
  },
  detailsContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
