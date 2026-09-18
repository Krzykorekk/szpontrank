import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import pl from './locales/pl.json'
import en from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pl: { translation: pl },
      en: { translation: en },
    },
    fallbackLng: 'en',
    supportedLngs: ['pl', 'en'],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      // Najpierw sprawdz czy user juz kiedys recznie wybral jezyk (zapisane w
      // localStorage), dopiero potem jezyk przegladarki/telefonu.
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'szpontrank_jezyk',
      caches: ['localStorage'],
    },
  })

export default i18n
