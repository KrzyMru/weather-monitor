import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en, pl } from './locales';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { ...en },
            pl: { ...pl }
        },
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        }
    })
    .then(() => {
        document.documentElement.setAttribute('lang', i18n.language);
    });

i18n.on('languageChanged', (lng) => {document.documentElement.setAttribute('lang', lng);});