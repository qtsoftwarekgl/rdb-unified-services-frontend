import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import enJSON from './locales/en.json';
import frJSON from './locales/fr.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    fr: { ...frJSON },
  },
  lng: 'en',
});
