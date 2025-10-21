import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

interface ConfirmDeleteModalProps {
  visible: boolean;
  roomName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function ConfirmDeleteModal({
  visible,
  roomName,
  onConfirm,
  onCancel,
  isDeleting = false
}: ConfirmDeleteModalProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const buttonBackgroundColor = useThemeColor({}, 'background');
  const accentOrange = useThemeColor({}, 'accentOrange');

  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor }]}>
          <Text style={[styles.title, { color: textColor }]}>{t.deleteConfirm.title}</Text>
          <Text style={[styles.message, { color: secondaryTextColor }]}>
            {t.deleteConfirm.message}
          </Text>
          <Text style={[styles.warning, { color: accentOrange }]}>
            {/* Message already included in deleteConfirm.message */}
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: buttonBackgroundColor, borderColor: secondaryTextColor }]}
              onPress={onCancel}
              disabled={isDeleting}
            >
              <Text style={[styles.cancelButtonText, { color: secondaryTextColor }]}>{t.deleteConfirm.cancel}</Text>
            </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: accentOrange }, isDeleting && styles.deleteButtonDisabled]}
                  onPress={onConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <ActivityIndicator color={backgroundColor} />
                  ) : (
                    <Text style={[styles.deleteButtonText, { color: backgroundColor }]}>{t.deleteConfirm.confirm}</Text>
                  )}
                </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  warning: {
    fontSize: 14,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
