import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useSettings, ThemePreference, Language } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';

export default function SettingsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'textSecondary');
  const borderColor = useThemeColor({}, 'border');
  const cardBackground = useThemeColor({}, 'cardNeutral');
  const tintColor = useThemeColor({}, 'tint');

  const colorScheme = useColorScheme();
  const { themePreference, setThemePreference } = useSettings();
  const { t, language, setLanguage } = useTranslation();

  const themeOptions: { value: ThemePreference; label: string; description: string }[] = [
    { value: 'auto', label: t.settings.themeAuto, description: t.settings.themeAutoDesc },
    { value: 'light', label: t.settings.themeLight, description: t.settings.themeLightDesc },
    { value: 'dark', label: t.settings.themeDark, description: t.settings.themeDarkDesc },
  ];

  const languageOptions: { value: Language; label: string; description: string }[] = [
    { value: 'fr', label: t.settings.languageFr, description: t.settings.languageFrDesc },
    { value: 'en', label: t.settings.languageEn, description: t.settings.languageEnDesc },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
        <Text style={[styles.title, { color: textColor }]}>{t.settings.title}</Text>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
          {t.settings.subtitle}
        </Text>
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{t.settings.appearance}</Text>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            {themeOptions.map((option, index) => (
              <React.Fragment key={option.value}>
                {index > 0 && <View style={[styles.divider, { backgroundColor: borderColor }]} />}
                <TouchableOpacity
                  style={styles.themeOption}
                  onPress={() => setThemePreference(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeOptionContent}>
                    <View style={styles.themeOptionText}>
                      <Text style={[styles.settingLabel, { color: textColor }]}>
                        {option.label}
                      </Text>
                      <Text style={[styles.settingDescription, { color: secondaryTextColor }]}>
                        {option.description}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioButton,
                        { borderColor: tintColor },
                        themePreference === option.value && { backgroundColor: tintColor },
                      ]}
                    >
                      {themePreference === option.value && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>

          {/* Current theme indicator */}
          <View style={styles.currentThemeInfo}>
            <Text style={[styles.currentThemeText, { color: secondaryTextColor }]}>
              {t.settings.currentTheme} : {colorScheme === 'dark' ? t.theme.dark : t.theme.light}
            </Text>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{t.settings.language}</Text>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            {languageOptions.map((option, index) => (
              <React.Fragment key={option.value}>
                {index > 0 && <View style={[styles.divider, { backgroundColor: borderColor }]} />}
                <TouchableOpacity
                  style={styles.themeOption}
                  onPress={() => setLanguage(option.value)}
                  activeOpacity={0.7}
                >
                  <View style={styles.themeOptionContent}>
                    <View style={styles.themeOptionText}>
                      <Text style={[styles.settingLabel, { color: textColor }]}>
                        {option.label}
                      </Text>
                      <Text style={[styles.settingDescription, { color: secondaryTextColor }]}>
                        {option.description}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioButton,
                        { borderColor: tintColor },
                        language === option.value && { backgroundColor: tintColor },
                      ]}
                    >
                      {language === option.value && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>

          {/* Current language indicator */}
          <View style={styles.currentThemeInfo}>
            <Text style={[styles.currentThemeText, { color: secondaryTextColor }]}>
              {t.settings.currentLanguage} : {language === 'fr' ? 'Français' : 'English'}
            </Text>
          </View>
        </View>

        {/* Theme Preview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{t.settings.themePreviewTitle}</Text>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <View style={styles.previewContainer}>
              <View style={[styles.previewItem, { backgroundColor }]}>
                <View style={[styles.previewCircle, { backgroundColor: textColor }]} />
                <Text style={[styles.previewText, { color: textColor }]}>{t.settings.primaryText}</Text>
              </View>
              <View style={[styles.previewItem, { backgroundColor }]}>
                <View style={[styles.previewCircle, { backgroundColor: secondaryTextColor }]} />
                <Text style={[styles.previewText, { color: secondaryTextColor }]}>
                  {t.settings.secondaryText}
                </Text>
              </View>
              <View style={[styles.previewItem, { backgroundColor }]}>
                <View style={[styles.previewCircle, { backgroundColor: tintColor }]} />
                <Text style={[styles.previewText, { color: textColor }]}>{t.settings.accent}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{t.settings.about}</Text>

          <View style={[styles.card, { backgroundColor: cardBackground }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>{t.settings.appName}</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{t.settings.appNameValue}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: borderColor }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>{t.settings.version}</Text>
              <Text style={[styles.infoValue, { color: textColor }]}>{t.settings.versionValue}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  themeOption: {
    padding: 16,
  },
  themeOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeOptionText: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  currentThemeInfo: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  currentThemeText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  previewContainer: {
    gap: 16,
    padding: 16,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  previewCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});
