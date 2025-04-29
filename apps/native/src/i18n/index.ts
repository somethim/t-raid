import translationAl from "@/assets/translations/al.json";
import translationEn from "@/assets/translations/en.json";
import { storage } from "@/storage";
import { type Language, LANGUAGES } from "@traid/provider/schemas/enums";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: { translation: translationEn },
  al: { translation: translationAl },
} satisfies {
  [K in Language]: { translation: typeof translationEn };
};

const initI18n = async () => {
  let savedLanguage = storage.getString("language");

  if (!savedLanguage) {
    const systemLanguage = getLocales()?.[0]?.languageCode ?? "en";

    if (LANGUAGES.includes(systemLanguage as Language)) {
      savedLanguage = systemLanguage;
    }
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
