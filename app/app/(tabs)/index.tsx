import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, useWindowDimensions } from 'react-native';
import { LoadingSpinner } from '@/components/atoms';
import { SearchBar, ErrorMessage } from '@/components/molecules';
import { RoomCard } from '@/components/organisms';
import { useRooms } from '@/hooks/useRooms';
import { Room } from '@/types/room';
import { useRouter } from 'expo-router';

// Breakpoint for desktop layout
const DESKTOP_BREAKPOINT = 768;

export default function HomeScreen() {
  const router = useRouter();
  const { rooms, isLoading, error, refetch } = useRooms();
  const [searchTerm, setSearchTerm] = useState('');
  const { width } = useWindowDimensions();

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

  const renderRoom = ({ item }: { item: Room }) => (
    <View style={isDesktop ? styles.gridItem : styles.listItem}>
      <RoomCard room={item} onPress={() => handleRoomPress(item.id)} />
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucune salle trouvée</Text>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Neutria</Text>
            <Text style={styles.subtitle}>Choisissez votre salle</Text>
          </View>
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Neutria</Text>
            <Text style={styles.subtitle}>Choisissez votre salle</Text>
          </View>
        </View>
        <ErrorMessage
          message={error.message || 'Une erreur est survenue'}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Neutria</Text>
          <Text style={styles.subtitle}>Choisissez votre salle</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar value={searchTerm} onChangeText={setSearchTerm} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
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
    color: '#6B7280',
  },
});
