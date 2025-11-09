import useSettingsStore from '@/store/settingsStore';
import { getTranslation } from '@/locales';

export function useTranslation() {
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const t = getTranslation(language);

  // Helper function to replace placeholders like {{count}}
  const translate = (text: string, params?: Record<string, string | number>): string => {
    if (!params) return text;

    let result = text;
    Object.keys(params).forEach((key) => {
      result = result.replace(`{{${key}}}`, String(params[key]));
    });
    return result;
  };

  return {
    t,
    language,
    setLanguage,
    translate,
  };
}
