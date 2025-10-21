import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { roomService } from '@/services/roomService';
import { ApiCaptureType } from '@/types/room';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

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
  const [selectedCaptureTypes, setSelectedCaptureTypes] = useState<string[]>([]);
  const [captureTypes, setCaptureTypes] = useState<ApiCaptureType[]>([]);
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
      const [roomData, captureTypesData] = await Promise.all([
        roomService.getRoom(roomId),
        roomService.getCaptureTypes(),
      ]);
      setName(roomData.name);
      setDescription(roomData.description || '');
      setSelectedCaptureTypes(roomData.captureTypes || []);
      setCaptureTypes(captureTypesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCaptureType = (captureTypeId: string) => {
    setSelectedCaptureTypes(prev => {
      if (prev.includes(captureTypeId)) {
        return prev.filter(id => id !== captureTypeId);
      } else {
        return [...prev, captureTypeId];
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await roomService.updateRoom(roomId, {
        name,
        description,
        captureTypes: selectedCaptureTypes,
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
              <Text style={[styles.label, { color: textColor }]}>{t.editRoom.sensorTypesLabel}</Text>
              {captureTypes.map(captureType => (
                <TouchableOpacity
                  key={captureType.id}
                  style={[styles.checkbox, { backgroundColor, borderColor: secondaryTextColor }]}
                  onPress={() => toggleCaptureType(captureType['@id'])}
                >
                  <View style={[
                    styles.checkboxBox,
                    { borderColor: tintColor },
                    selectedCaptureTypes.includes(captureType['@id']) && { backgroundColor: tintColor }
                  ]}>
                    {selectedCaptureTypes.includes(captureType['@id']) && (
                      <Text style={[styles.checkboxCheck, { color: backgroundColor }]}>✓</Text>
                    )}
                  </View>
                  <View style={styles.checkboxLabel}>
                    <Text style={[styles.checkboxText, { color: textColor }]}>{captureType.name}</Text>
                    <Text style={[styles.checkboxDescription, { color: secondaryTextColor }]}>{captureType.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
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
});
