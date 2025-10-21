import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/locales';

export function useTranslation() {
  const { language, setLanguage } = useLanguage();
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
