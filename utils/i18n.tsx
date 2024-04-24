import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

const deviceLanguage = getLocales()[0].languageCode;

import en from '../locales/en.json';
import lt from '../locales/lt.json';

const resources = {
  en: {
    translation: en,
  },
  lt: {
    translation: lt,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
