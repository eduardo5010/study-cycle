import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type SupportedLanguage =
  | "pt"
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "ru"
  | "zh"
  | "ja"
  | "ko"
  | "ar"
  | "hi"
  | "tr"
  | "pl"
  | "nl"
  | "sv"
  | "da"
  | "no"
  | "fi"
  | "cs";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation keys interface
// Translations can be nested objects. We'll keep them as any and
// resolve nested keys (dot notation) at runtime. We also load
// English translations for fallback when a key is missing.
type Translations = any;

// Import all translation files
const translations: Record<
  SupportedLanguage,
  () => Promise<{ default: Translations }>
> = {
  pt: () => import("../translations/pt.json"),
  en: () => import("../translations/en.json"),
  es: () => import("../translations/es.json"),
  fr: () => import("../translations/fr.json"),
  de: () => import("../translations/de.json"),
  it: () => import("../translations/it.json"),
  ru: () => import("../translations/ru.json"),
  zh: () => import("../translations/zh.json"),
  ja: () => import("../translations/ja.json"),
  ko: () => import("../translations/ko.json"),
  ar: () => import("../translations/ar.json"),
  hi: () => import("../translations/hi.json"),
  tr: () => import("../translations/tr.json"),
  pl: () => import("../translations/pl.json"),
  nl: () => import("../translations/nl.json"),
  sv: () => import("../translations/sv.json"),
  da: () => import("../translations/da.json"),
  no: () => import("../translations/no.json"),
  fi: () => import("../translations/fi.json"),
  cs: () => import("../translations/cs.json"),
};

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  ru: "Русский",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية",
  hi: "हिन्दी",
  tr: "Türkçe",
  pl: "Polski",
  nl: "Nederlands",
  sv: "Svenska",
  da: "Dansk",
  no: "Norsk",
  fi: "Suomi",
  cs: "Čeština",
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>("pt");
  const [currentTranslations, setCurrentTranslations] = useState<Translations>(
    {}
  );
  const [englishTranslations, setEnglishTranslations] = useState<Translations>(
    {}
  );

  // Helper to resolve nested keys like 'landing.nav.courses'
  const getNested = (key: string, obj: Translations): string | undefined => {
    if (!obj) return undefined;
    const parts = key.split(".");
    let cur: any = obj;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in cur) {
        cur = cur[p];
      } else {
        return undefined;
      }
    }
    return typeof cur === "string" ? cur : undefined;
  };

  // Load translations for the current language and also ensure English is loaded for fallback.
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const [langModule, enModule] = await Promise.all([
          translations[language](),
          translations.en(),
        ]);
        setCurrentTranslations(langModule.default);
        setEnglishTranslations(enModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Try to at least load English as fallback
        try {
          const enModule = await translations.en();
          setCurrentTranslations(enModule.default);
          setEnglishTranslations(enModule.default);
        } catch (fallbackError) {
          console.error(
            "Failed to load fallback English translations:",
            fallbackError
          );
        }
      }
    };

    loadTranslations();
  }, [language]);

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "studycycle-language"
    ) as SupportedLanguage;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: SupportedLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem("studycycle-language", newLanguage);
  };

  const t = (key: string): string => {
    // Try current language first (supports nested), then fallback to English, finally return the key itself.
    const fromCurrent = getNested(key, currentTranslations);
    if (fromCurrent) return fromCurrent;
    const fromEn = getNested(key, englishTranslations);
    if (fromEn) return fromEn;
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
