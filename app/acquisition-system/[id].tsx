import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoadingSpinner } from '@/components/atoms';
import StatusBadge from '@/components/atoms/StatusBadge';
import { ErrorMessage } from '@/components/molecules';
import ConfigRow from '@/components/molecules/ConfigRow';
import ConfigSection from '@/components/molecules/ConfigSection';
import { useAcquisitionSystemConfig } from '@/hooks/useAcquisitionSystemConfig';
import Icon from '@/components/atoms/Icon';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';
import AcquisitionSystemEditModal from '@/components/organisms/AcquisitionSystemEditModal';

export default function AcquisitionSystemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const systemId = parseInt(id || '0', 10);
  const { config, isLoading, error, refetch } = useAcquisitionSystemConfig(systemId);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const backgroundSecondary = useThemeColor({}, 'backgroundSecondary');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const cardBlue = useThemeColor({}, 'cardBlue');
  const tintColor = useThemeColor({}, 'tint');

  const { t } = useTranslation();

  // Update navigation title when config is loaded
  useEffect(() => {
    if (config?.name) {
      navigation.setOptions({ title: config.name });
    } else if (!isLoading) {
      navigation.setOptions({ title: `Système #${id}` });
    }
  }, [config, isLoading, id, navigation]);

  const handleEditSuccess = () => {
    refetch(); // Refresh data after successful edit
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ErrorMessage
          message={error.message || 'Une erreur est survenue'}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  // System not found
  if (!config) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ErrorMessage
          message="Système d'acquisition introuvable"
          onRetry={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with edit button */}
        <View
          style={[
            styles.headerButtons,
            { paddingTop: insets.top + 16, backgroundColor, borderBottomColor: borderColor },
          ]}
        >
          <View style={styles.headerRightButtons}>
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: backgroundSecondary }]} 
              onPress={() => setEditModalVisible(true)}
            >
              <Text style={[styles.editButtonText, { color: tintColor }]}>{t.common?.edit || 'Modifier'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Details */}
        <View style={styles.content}>
          {/* Title Section (always visible) */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: textSecondary }]}>{config.name}</Text>
            <View style={styles.generalInfo}>
              <ConfigRow
                label={t.acquisitionSystemDetail?.deviceType || 'Type d\'appareil'}
                value={config.deviceType}
                icon="cpu"
              />
              <ConfigRow
                label={t.acquisitionSystemDetail?.firmware || 'Version firmware'}
                value={config.firmwareVersion}
                icon="gearshape"
              />
              <ConfigRow
                label={t.acquisitionSystemDetail?.createdAt || 'Créé le'}
                value={formatDate(config.createdAt)}
                icon="calendar"
              />
            </View>
            <View style={styles.statusContainer}>
              <StatusBadge status={config.systemStatus} size="medium" />
            </View>
          </View>

          {/* Network Configuration Section */}
          {config.networkConfig && (
            <ConfigSection
              title={t.acquisitionSystemDetail?.networkConfig || 'Configuration réseau'}
              icon="wifi"
              defaultOpen={true}
            >
              <ConfigRow
                label={t.acquisitionSystemDetail?.wifiSsid || 'WiFi SSID'}
                value={config.networkConfig.wifiSsid}
              />
              <ConfigRow
                label={t.acquisitionSystemDetail?.ntpServer || 'Serveur NTP'}
                value={config.networkConfig.ntpServer}
              />
              <ConfigRow
                label={t.acquisitionSystemDetail?.timezone || 'Fuseau horaire'}
                value={config.networkConfig.timezone}
              />
              <ConfigRow
                label="Décalage GMT"
                value={`${config.networkConfig.gmtOffsetSec}s`}
              />
              <ConfigRow
                label="Décalage heure d'été"
                value={`${config.networkConfig.daylightOffsetSec}s`}
              />
            </ConfigSection>
          )}

          {/* Sensors Section */}
          {config.sensors && (
            <ConfigSection
              title={`${t.acquisitionSystemDetail?.sensors || 'Capteurs'} (${config.sensors.length})`}
              icon="sensor.fill"
              defaultOpen={false}
            >
              {config.sensors.map((sensor, index) => (
              <View
                key={sensor.id}
                style={[
                  styles.sensorCard,
                  { backgroundColor: cardBlue, borderColor },
                  index < config.sensors.length - 1 && styles.sensorCardMargin,
                ]}
              >
                <Text style={[styles.sensorTitle, { color: textColor }]}>
                  Capteur #{sensor.id}
                </Text>
                <ConfigRow label="Type" value={sensor.sensorType} />
                <ConfigRow label="Activé" value={sensor.enabled} />
                <ConfigRow label="Intervalle lecture" value={`${sensor.readIntervalMs}ms`} />
                {sensor.i2cSdaPin !== undefined && (
                  <ConfigRow label="Pin I2C SDA" value={sensor.i2cSdaPin} />
                )}
                {sensor.i2cSclPin !== undefined && (
                  <ConfigRow label="Pin I2C SCL" value={sensor.i2cSclPin} />
                )}
                {sensor.adcPin !== undefined && (
                  <ConfigRow label="Pin ADC" value={sensor.adcPin} />
                )}
                {sensor.warmupDurationSec !== undefined && (
                  <ConfigRow
                    label="Durée préchauffage"
                    value={`${sensor.warmupDurationSec}s`}
                  />
                )}
              </View>
            ))}
            </ConfigSection>
          )}

          {/* Tasks Section */}
          {config.tasks && (
            <ConfigSection
              title={`${t.acquisitionSystemDetail?.tasks || 'Tâches'} (${config.tasks.length})`}
              icon="list.bullet"
              defaultOpen={false}
            >
              {config.tasks.map((task, index) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  { backgroundColor: cardBlue, borderColor },
                  index < config.tasks.length - 1 && styles.taskCardMargin,
                ]}
              >
                <Text style={[styles.taskTitle, { color: textColor }]}>
                  {task.taskName}
                </Text>
                <ConfigRow label="Activée" value={task.enabled} />
                <ConfigRow label="Intervalle" value={`${task.intervalMs}ms`} />
                <ConfigRow label="Priorité" value={task.priority} />
                {task.taskConfig && Object.keys(task.taskConfig).length > 0 && (
                  <View style={styles.taskConfigSection}>
                    <Text style={[styles.configTitle, { color: textSecondary }]}>
                      Configuration:
                    </Text>
                    {Object.entries(task.taskConfig).map(([key, value]) => (
                      <ConfigRow key={key} label={key} value={String(value)} />
                    ))}
                  </View>
                )}
              </View>
            ))}
            </ConfigSection>
          )}

          {/* System Configuration Section */}
          {config.systemConfig && (
            <ConfigSection
              title={t.acquisitionSystemDetail?.systemConfig || 'Configuration système'}
              icon="server.rack"
              defaultOpen={false}
            >
              <ConfigRow label="Mode debug" value={config.systemConfig.debug} />
              <ConfigRow label="Taille du buffer" value={config.systemConfig.bufferSize} />
              <ConfigRow label="Deep sleep" value={config.systemConfig.deepSleepEnabled} />
              <ConfigRow label="Serveur web" value={config.systemConfig.webServerEnabled} />
              <ConfigRow
                label="Port serveur web"
                value={config.systemConfig.webServerPort}
              />
            </ConfigSection>
          )}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <AcquisitionSystemEditModal
        visible={editModalVisible}
        systemId={systemId}
        onClose={() => setEditModalVisible(false)}
        onSave={handleEditSuccess}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 8,
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
    marginBottom: 16,
  },
  generalInfo: {
    marginBottom: 12,
  },
  statusContainer: {
    marginTop: 12,
  },
  sensorCard: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  sensorCardMargin: {
    marginBottom: 12,
  },
  sensorTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskCard: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  taskCardMargin: {
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskConfigSection: {
    marginTop: 8,
    paddingTop: 8,
  },
  configTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
});
