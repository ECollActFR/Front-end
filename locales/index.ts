import { fr } from './fr';
import { en } from './en';
import { Language } from '@/store/settingsStore';

export const translations = {
  fr,
  en,
};

export function getTranslation(language: Language) {
  return translations[language];
}
