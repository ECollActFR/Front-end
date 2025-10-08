import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { roomService } from '@/services/roomService';
import { ApiCaptureType } from '@/types/room';

interface RoomEditModalProps {
  visible: boolean;
  roomId: number;
  onClose: () => void;
  onSave: () => void;
}

export default function RoomEditModal({ visible, roomId, onClose, onSave }: RoomEditModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCaptureTypes, setSelectedCaptureTypes] = useState<string[]>([]);
  const [captureTypes, setCaptureTypes] = useState<ApiCaptureType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      loadData();
    }
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
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Annuler</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier la salle</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#7FB068" />
          </View>
        ) : (
          <ScrollView style={styles.content}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom de la salle</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Entrez le nom de la salle"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Entrez une description"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Types de capteurs</Text>
              {captureTypes.map(captureType => (
                <TouchableOpacity
                  key={captureType.id}
                  style={styles.checkbox}
                  onPress={() => toggleCaptureType(captureType['@id'])}
                >
                  <View style={[
                    styles.checkboxBox,
                    selectedCaptureTypes.includes(captureType['@id']) && styles.checkboxBoxChecked
                  ]}>
                    {selectedCaptureTypes.includes(captureType['@id']) && (
                      <Text style={styles.checkboxCheck}>✓</Text>
                    )}
                  </View>
                  <View style={styles.checkboxLabel}>
                    <Text style={styles.checkboxText}>{captureType.name}</Text>
                    <Text style={styles.checkboxDescription}>{captureType.description}</Text>
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  saveButton: {
    fontSize: 16,
    color: '#7FB068',
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
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#7FB068',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#7FB068',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#666',
  },
});
