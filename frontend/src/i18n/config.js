import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importamos los archivos JSON de traducción
import es from "./locales/es.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next)
  .init({
    fallbackLng: "es", // Si falla la detección, usa español
    debug: false,

    resources: {
      es: { translation: es },
      en: { translation: en },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
