import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoadingSpinner, Button } from '@/components/atoms';
import { ErrorMessage, DetailRow, AmenityChip, ConfirmDeleteModal } from '@/components/molecules';
import { SensorCard, RoomEditModal } from '@/components/organisms';
import { useRoomDetail } from '@/hooks/useRoomDetail';
import Icon from '@/components/atoms/Icon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { roomService } from '@/services/roomService';

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

  const handleBooking = () => {
    console.log('Booking room:', roomDetail);
    // TODO: Add booking logic
  };

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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Room Header Image/Color */}
        <View style={[styles.headerImage, { backgroundColor: roomDetail.color }]}>
          <View style={[styles.headerButtons, { top: insets.top + 16 }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Icon name="chevron-right" size={24} color="#FFFFFF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <View style={styles.headerRightButtons}>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteClick}>
                <IconSymbol name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
                <Text style={styles.editButtonText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!roomDetail.available && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>Occupée</Text>
            </View>
          )}
        </View>

        {/* Room Details */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{roomDetail.name}</Text>
            {roomDetail.description && <Text style={styles.description}>{roomDetail.description}</Text>}
          </View>

          {/* Sensor Data Section */}
          {roomDetail.lastCapturesByType && roomDetail.lastCapturesByType.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Données en temps réel</Text>
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

          {/* Amenities Section */}
          {roomDetail.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Équipements</Text>
              <View style={styles.amenitiesContainer}>
                {roomDetail.amenities.map((amenity, index) => (
                  <AmenityChip key={`${amenity}-${index}`} type={amenity} />
                ))}
              </View>
            </View>
          )}

          {/* Availability Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponibilité</Text>
            <View style={styles.availabilityCard}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: roomDetail.available ? '#7FB068' : '#EF4444' },
                ]}
              />
              <Text style={styles.availabilityText}>
                {roomDetail.available ? 'Disponible maintenant' : 'Occupée'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      {roomDetail.available && (
        <View style={styles.bottomButton}>
          <Button title="Réserver cette salle" onPress={handleBooking} />
        </View>
      )}

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
    backgroundColor: '#F9FAFB',
  },
  headerImage: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  headerButtons: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#7FB068',
    fontSize: 14,
    fontWeight: '600',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unavailableText: {
    color: '#EF4444',
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
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
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
    backgroundColor: '#FFFFFF',
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
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  bottomButton: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
});
