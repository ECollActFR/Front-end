import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { acquisitionSystemService } from '@/services/acquisitionSystemService';
import { AcquisitionSystemConfig, ApiSensor, ApiTask } from '@/types/acquisitionSystem';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

interface AcquisitionSystemEditModalProps {
  visible: boolean;
  systemId: number;
  onClose: () => void;
  onSave: () => void;
}

export default function AcquisitionSystemEditModal({ visible, systemId, onClose, onSave }: AcquisitionSystemEditModalProps) {
  const insets = useSafeAreaInsets();
  
  // Form state
  const [name, setName] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [systemStatus, setSystemStatus] = useState<'active' | 'inactive' | 'error'>('inactive');
  
  // Network config
  const [wifiSsid, setWifiSsid] = useState('');
  const [ntpServer, setNtpServer] = useState('');
  const [timezone, setTimezone] = useState('');
  const [gmtOffsetSec, setGmtOffsetSec] = useState(0);
  const [daylightOffsetSec, setDaylightOffsetSec] = useState(0);
  
  // System config
  const [debug, setDebug] = useState(false);
  const [bufferSize, setBufferSize] = useState(0);
  const [deepSleepEnabled, setDeepSleepEnabled] = useState(false);
  const [webServerEnabled, setWebServerEnabled] = useState(false);
  const [webServerPort, setWebServerPort] = useState(0);
  
  // Dynamic arrays
  const [sensors, setSensors] = useState<ApiSensor[]>([]);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));
  const [config, setConfig] = useState<AcquisitionSystemConfig | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'cardBlue');

  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, systemId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const systemConfig = await acquisitionSystemService.getAcquisitionSystemConfig(systemId);
      setConfig(systemConfig);
      
      // Set form values
      setName(systemConfig.name);
      setDeviceType(systemConfig.deviceType);
      setSystemStatus(systemConfig.systemStatus);
      
      // Network config
      setWifiSsid(systemConfig.networkConfig.wifiSsid);
      setNtpServer(systemConfig.networkConfig.ntpServer);
      setTimezone(systemConfig.networkConfig.timezone);
      setGmtOffsetSec(systemConfig.networkConfig.gmtOffsetSec);
      setDaylightOffsetSec(systemConfig.networkConfig.daylightOffsetSec);
      
      // System config
      setDebug(systemConfig.systemConfig.debug);
      setBufferSize(systemConfig.systemConfig.bufferSize);
      setDeepSleepEnabled(systemConfig.systemConfig.deepSleepEnabled);
      setWebServerEnabled(systemConfig.systemConfig.webServerEnabled);
      setWebServerPort(systemConfig.systemConfig.webServerPort);
      
      // Dynamic arrays
      setSensors(systemConfig.sensors);
      setTasks(systemConfig.tasks);
    } catch (error) {
      console.error('Error loading system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const updateSensor = (index: number, field: keyof ApiSensor, value: any) => {
    setSensors(prev => {
      const newSensors = [...prev];
      newSensors[index] = { ...newSensors[index], [field]: value };
      return newSensors;
    });
  };

  const updateTask = (index: number, field: keyof ApiTask, value: any) => {
    setTasks(prev => {
      const newTasks = [...prev];
      newTasks[index] = { ...newTasks[index], [field]: value };
      return newTasks;
    });
  };

  const addSensor = () => {
    const newSensor: ApiSensor = {
      id: Date.now(), // Temporary ID
      captureType: '',
      sensorType: '',
      enabled: true,
      readIntervalMs: 1000,
    };
    setSensors(prev => [...prev, newSensor]);
  };

  const removeSensor = (index: number) => {
    setSensors(prev => prev.filter((_, i) => i !== index));
  };

  const addTask = () => {
    const newTask: ApiTask = {
      id: Date.now(), // Temporary ID
      taskName: '',
      enabled: true,
      intervalMs: 5000,
      priority: 1,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const removeTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        name,
        deviceType,
        systemStatus,
        networkConfig: {
          id: config?.networkConfig.id || 0,
          wifiSsid,
          ntpServer,
          timezone,
          gmtOffsetSec,
          daylightOffsetSec,
        },
        systemConfig: {
          id: config?.systemConfig.id || 0,
          debug,
          bufferSize,
          deepSleepEnabled,
          webServerEnabled,
          webServerPort,
        },
        sensors,
        tasks,
      };

      await acquisitionSystemService.updateAcquisitionSystem(systemId, updateData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating system:', error);
      alert('Failed to update acquisition system');
    } finally {
      setSaving(false);
    }
  };

  const renderReadonlyField = (label: string, value: string) => (
    <View style={styles.readonlyField}>
      <Text style={[styles.label, { color: secondaryTextColor }]}>{label}</Text>
      <View style={[styles.readonlyValue, { backgroundColor: cardBackground, borderColor }]}>
        <Text style={[styles.readonlyText, { color: secondaryTextColor }]}>{value}</Text>
        <IconSymbol name="lock.fill" size={12} color={secondaryTextColor} />
      </View>
    </View>
  );

  const renderSectionHeader = (title: string, section: string, iconName: string) => (
    <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(section)}>
      <View style={styles.sectionTitleContainer}>
        <IconSymbol name={iconName as any} size={20} color={tintColor} />
        <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      </View>
      <IconSymbol 
        name={expandedSections.has(section) ? "chevron.up" : "chevron.down"} 
        size={16} 
        color={secondaryTextColor} 
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.container, { backgroundColor }]}>
          <View style={[styles.centered, { paddingTop: insets.top + 50 }]}>
            <ActivityIndicator size="large" color={tintColor} />
          </View>
        </View>
      </Modal>
    );
  }

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
            <Text style={[styles.cancelButton, { color: secondaryTextColor }]}>{t.editAcquisitionSystem?.cancel || 'Annuler'}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>{t.editAcquisitionSystem?.title || 'Modifier le système'}</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveButton, { color: tintColor }, saving && styles.saveButtonDisabled]}>
              {saving ? (t.editAcquisitionSystem?.saving || 'Enregistrement...') : (t.editAcquisitionSystem?.save || 'Enregistrer')}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* General Information Section */}
          {renderSectionHeader(t.editAcquisitionSystem?.generalInfo || 'Informations générales', 'general', 'info.circle')}
          {expandedSections.has('general') && (
            <View style={styles.section}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.name || 'Nom'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={name}
                  onChangeText={setName}
                  placeholder={t.editAcquisitionSystem?.namePlaceholder || 'Nom du système'}
                  placeholderTextColor={secondaryTextColor}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.deviceType || 'Type d\'appareil'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={deviceType}
                  onChangeText={setDeviceType}
                  placeholder={t.editAcquisitionSystem?.deviceTypePlaceholder || 'Type d\'appareil'}
                  placeholderTextColor={secondaryTextColor}
                />
              </View>

              {renderReadonlyField(
                t.editAcquisitionSystem?.firmwareVersion || 'Version firmware',
                config?.firmwareVersion || 'v1.0.0'
              )}

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.systemStatus || 'Statut système'}</Text>
                <View style={styles.switchContainer}>
                  <Text style={[styles.switchLabel, { color: secondaryTextColor }]}>
                    {systemStatus === 'active' ? 'Actif' : systemStatus === 'inactive' ? 'Inactif' : 'Erreur'}
                  </Text>
                  <Switch
                    value={systemStatus === 'active'}
                    onValueChange={(enabled) => setSystemStatus(enabled ? 'active' : 'inactive')}
                    trackColor={{ false: secondaryTextColor, true: tintColor }}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Network Configuration Section */}
          {renderSectionHeader(t.editAcquisitionSystem?.networkConfig || 'Configuration réseau', 'network', 'wifi')}
          {expandedSections.has('network') && (
            <View style={styles.section}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.wifiSsid || 'WiFi SSID'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={wifiSsid}
                  onChangeText={setWifiSsid}
                  placeholder="WiFi SSID"
                  placeholderTextColor={secondaryTextColor}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.ntpServer || 'Serveur NTP'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={ntpServer}
                  onChangeText={setNtpServer}
                  placeholder="pool.ntp.org"
                  placeholderTextColor={secondaryTextColor}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.timezone || 'Fuseau horaire'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={timezone}
                  onChangeText={setTimezone}
                  placeholder="Europe/Paris"
                  placeholderTextColor={secondaryTextColor}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.gmtOffset || 'Décalage GMT (s)'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={gmtOffsetSec.toString()}
                  onChangeText={(text) => setGmtOffsetSec(parseInt(text) || 0)}
                  placeholder="3600"
                  placeholderTextColor={secondaryTextColor}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.daylightOffset || 'Décalage heure d\'été (s)'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={daylightOffsetSec.toString()}
                  onChangeText={(text) => setDaylightOffsetSec(parseInt(text) || 0)}
                  placeholder="3600"
                  placeholderTextColor={secondaryTextColor}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}

          {/* System Configuration Section */}
          {renderSectionHeader(t.editAcquisitionSystem?.systemConfig || 'Configuration système', 'system', 'gear')}
          {expandedSections.has('system') && (
            <View style={styles.section}>
              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.debugMode || 'Mode debug'}</Text>
                  <Switch
                    value={debug}
                    onValueChange={setDebug}
                    trackColor={{ false: secondaryTextColor, true: tintColor }}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.bufferSize || 'Taille du buffer'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={bufferSize.toString()}
                  onChangeText={(text) => setBufferSize(parseInt(text) || 0)}
                  placeholder="1024"
                  placeholderTextColor={secondaryTextColor}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.deepSleep || 'Deep sleep'}</Text>
                  <Switch
                    value={deepSleepEnabled}
                    onValueChange={setDeepSleepEnabled}
                    trackColor={{ false: secondaryTextColor, true: tintColor }}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.webServer || 'Serveur web'}</Text>
                  <Switch
                    value={webServerEnabled}
                    onValueChange={setWebServerEnabled}
                    trackColor={{ false: secondaryTextColor, true: tintColor }}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>{t.editAcquisitionSystem?.webServerPort || 'Port serveur web'}</Text>
                <TextInput
                  style={[styles.input, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                  value={webServerPort.toString()}
                  onChangeText={(text) => setWebServerPort(parseInt(text) || 0)}
                  placeholder="80"
                  placeholderTextColor={secondaryTextColor}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}

          {/* Sensors Section */}
          {renderSectionHeader(`${t.editAcquisitionSystem?.sensors || 'Capteurs'} (${sensors.length})`, 'sensors', 'sensor.fill')}
          {expandedSections.has('sensors') && (
            <View style={styles.section}>
              {sensors.map((sensor, index) => (
                <View key={sensor.id} style={[styles.itemCard, { backgroundColor: cardBackground, borderColor }]}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.itemTitle, { color: textColor }]}>
                      {t.editAcquisitionSystem?.sensor || 'Capteur'} #{index + 1}
                    </Text>
                    <TouchableOpacity onPress={() => removeSensor(index)}>
                      <IconSymbol name="trash.fill" size={16} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={[styles.smallLabel, { color: secondaryTextColor }]}>{t.editAcquisitionSystem?.sensorType || 'Type'}</Text>
                    <TextInput
                      style={[styles.smallInput, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                      value={sensor.sensorType}
                      onChangeText={(text) => updateSensor(index, 'sensorType', text)}
                      placeholder="DHT22"
                      placeholderTextColor={secondaryTextColor}
                    />
                  </View>

                  <View style={styles.switchContainer}>
                    <Text style={[styles.smallLabel, { color: secondaryTextColor }]}>{t.editAcquisitionSystem?.enabled || 'Activé'}</Text>
                    <Switch
                      value={sensor.enabled}
                      onValueChange={(enabled) => updateSensor(index, 'enabled', enabled)}
                      trackColor={{ false: secondaryTextColor, true: tintColor }}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.smallLabel, { color: secondaryTextColor }]}>{t.editAcquisitionSystem?.readInterval || 'Intervalle (ms)'}</Text>
                    <TextInput
                      style={[styles.smallInput, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                      value={sensor.readIntervalMs.toString()}
                      onChangeText={(text) => updateSensor(index, 'readIntervalMs', parseInt(text) || 0)}
                      placeholder="1000"
                      placeholderTextColor={secondaryTextColor}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ))}
              
              <TouchableOpacity style={[styles.addButton, { borderColor: tintColor }]} onPress={addSensor}>
                <IconSymbol name="plus.circle.fill" size={20} color={tintColor} />
                <Text style={[styles.addButtonText, { color: tintColor }]}>
                  {t.editAcquisitionSystem?.addSensor || 'Ajouter un capteur'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Tasks Section */}
          {renderSectionHeader(`${t.editAcquisitionSystem?.tasks || 'Tâches'} (${tasks.length})`, 'tasks', 'list.bullet')}
          {expandedSections.has('tasks') && (
            <View style={styles.section}>
              {tasks.map((task, index) => (
                <View key={task.id} style={[styles.itemCard, { backgroundColor: cardBackground, borderColor }]}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.itemTitle, { color: textColor }]}>
                      {task.taskName || `${t.editAcquisitionSystem?.task || 'Tâche'} #${index + 1}`}
                    </Text>
                    <TouchableOpacity onPress={() => removeTask(index)}>
                      <IconSymbol name="trash.fill" size={16} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={[styles.smallLabel, { color: secondaryTextColor }]}>{t.editAcquisitionSystem?.taskName || 'Nom'}</Text>
                    <TextInput
                      style={[styles.smallInput, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                      value={task.taskName}
                      onChangeText={(text) => updateTask(index, 'taskName', text)}
                      placeholder="Data Collection"
                      placeholderTextColor={secondaryTextColor}
                    />
                  </View>

                  <View style={styles.switchContainer}>
                    <Text style={[styles.smallLabel, { color: secondaryTextColor }]}>{t.editAcquisitionSystem?.enabled || 'Activé'}</Text>
                    <Switch
                      value={task.enabled}
                      onValueChange={(enabled) => updateTask(index, 'enabled', enabled)}
                      trackColor={{ false: secondaryTextColor, true: tintColor }}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.smallLabel, { color: secondaryTextColor }]}>{t.editAcquisitionSystem?.interval || 'Intervalle (ms)'}</Text>
                    <TextInput
                      style={[styles.smallInput, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                      value={task.intervalMs.toString()}
                      onChangeText={(text) => updateTask(index, 'intervalMs', parseInt(text) || 0)}
                      placeholder="5000"
                      placeholderTextColor={secondaryTextColor}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={[styles.smallLabel, { color: secondaryTextColor }]}>{t.editAcquisitionSystem?.priority || 'Priorité'}</Text>
                    <TextInput
                      style={[styles.smallInput, { backgroundColor, borderColor: secondaryTextColor, color: textColor }]}
                      value={task.priority.toString()}
                      onChangeText={(text) => updateTask(index, 'priority', parseInt(text) || 0)}
                      placeholder="1"
                      placeholderTextColor={secondaryTextColor}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ))}
              
              <TouchableOpacity style={[styles.addButton, { borderColor: tintColor }]} onPress={addTask}>
                <IconSymbol name="plus.circle.fill" size={20} color={tintColor} />
                <Text style={[styles.addButtonText, { color: tintColor }]}>
                  {t.editAcquisitionSystem?.addTask || 'Ajouter une tâche'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  smallLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
  },
  smallInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    fontSize: 14,
  },
  readonlyField: {
    marginBottom: 16,
  },
  readonlyValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    opacity: 0.6,
  },
  readonlyText: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
  },
  itemCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});