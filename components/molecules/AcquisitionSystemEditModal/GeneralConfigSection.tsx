/**
 * General configuration section for Acquisition System Edit Modal
 */

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTranslation } from '@/hooks/useTranslation';

interface GeneralConfigSectionProps {
  name: string;
  deviceType: string;
  systemStatus: 'active' | 'inactive' | 'error';
  onNameChange: (value: string) => void;
  onDeviceTypeChange: (value: string) => void;
  onSystemStatusChange: (value: 'active' | 'inactive' | 'error') => void;
}

export default function GeneralConfigSection({
  name,
  deviceType,
  systemStatus,
  onNameChange,
  onDeviceTypeChange,
  onSystemStatusChange,
}: GeneralConfigSectionProps) {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'border');
  const { t } = useTranslation();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        {t.editAcquisitionSystem.generalInfo}
      </Text>
      
      <View style={styles.field}>
        <Text style={[styles.label, { color: secondaryTextColor }]}>
          {t.editAcquisitionSystem.name}
        </Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor }]}
          value={name}
          onChangeText={onNameChange}
          placeholder={t.editAcquisitionSystem.namePlaceholder}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: secondaryTextColor }]}>
          {t.editAcquisitionSystem.deviceType}
        </Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor }]}
          value={deviceType}
          onChangeText={onDeviceTypeChange}
          placeholder={t.editAcquisitionSystem.deviceTypePlaceholder}
        />
      </View>

      <View style={styles.field}>
        <Text style={[styles.label, { color: secondaryTextColor }]}>
          {t.editAcquisitionSystem.systemStatus}
        </Text>
        <TextInput
          style={[styles.input, { color: textColor, borderColor }]}
          value={systemStatus}
          onChangeText={(value) => onSystemStatusChange(value as 'active' | 'inactive' | 'error')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});