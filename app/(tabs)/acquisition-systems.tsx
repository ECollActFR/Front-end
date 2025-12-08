import { LoadingSpinner } from '@/components/atoms';
import { ErrorMessage, SearchBar } from '@/components/molecules';
import AcquisitionSystemCard from '@/components/organisms/AcquisitionSystemCard';
import { useAcquisitionSystems } from '@/hooks/useAcquisitionSystems';
import { AcquisitionSystem } from '@/types/acquisitionSystem';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Breakpoint for desktop layout
const DESKTOP_BREAKPOINT = 768;

export default function AcquisitionSystemsScreen() {
  const router = useRouter();
  const { systems, isLoading, error, refetch } = useAcquisitionSystems();
  const [searchTerm, setSearchTerm] = useState('');
  const { width } = useWindowDimensions();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBlue = useThemeColor({}, 'cardBlue');

  const { t } = useTranslation();

  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const numColumns = isDesktop ? 2 : 1;

  const filteredSystems = useMemo(() => {
    return systems.filter(
      (system) =>
        system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (system.roomName && system.roomName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [systems, searchTerm]);

  const handleSystemPress = (systemId: number) => {
    router.push(`/acquisition-system/${systemId}`);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } catch (error: any) {
      Alert.alert(
        t.common?.error || 'Erreur',
        error.message || 'Échec de la mise à jour des données'
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderSystem = ({ item, index }: { item: AcquisitionSystem; index: number }) => (
    <View style={isDesktop ? styles.gridItem : styles.listItem}>
      <AcquisitionSystemCard
        system={item}
        onPress={() => handleSystemPress(item.id)}
        index={index}
      />
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
        {t.acquisitionSystems?.noSystems || 'Aucun système trouvé'}
      </Text>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={[styles.header, { backgroundColor: cardBlue, borderBottomColor: borderColor }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: textColor }]}>
              {t.acquisitionSystems?.title || 'Systèmes d\'acquisition'}
            </Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
              {t.acquisitionSystems?.subtitle || 'Gérez vos ESP32'}
            </Text>
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
            <Text style={[styles.title, { color: textColor }]}>
              {t.acquisitionSystems?.title || 'Systèmes d\'acquisition'}
            </Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
              {t.acquisitionSystems?.subtitle || 'Gérez vos ESP32'}
            </Text>
          </View>
        </View>
        <ErrorMessage
          message={error.message || t.acquisitionSystems?.error || 'Erreur lors du chargement'}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cardBlue, borderBottomColor: borderColor }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { color: textColor }]}>
                {t.acquisitionSystems?.title || 'Systèmes d\'acquisition'}
              </Text>
              <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
                {t.acquisitionSystems?.subtitle || 'Gérez vos ESP32'}
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
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder={t.acquisitionSystems?.searchPlaceholder || 'Rechercher un système...'}
          />
        </View>
      </View>

      {/* Systems List */}
      <FlatList
        key={numColumns} // Force re-render when columns change
        data={filteredSystems}
        renderItem={renderSystem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={[styles.listContent, isDesktop && styles.gridContent]}
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
    maxWidth: '48%',
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
});
