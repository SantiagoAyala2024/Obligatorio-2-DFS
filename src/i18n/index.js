import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es/translation.json"
import en from "./locales/en/translation.json"

const idiomaActual = localStorage.getItem("idioma") || "es";

i18next
    .use(initReactI18next)
    .init({
        resources: {
            es: {
                translation: es
            },
            en:{
                translation: en
            }
        },
        lng: idiomaActual,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

i18next.on('languageChanged', (lng) => {
    localStorage.setItem("idioma", lng);
});

export default i18next;