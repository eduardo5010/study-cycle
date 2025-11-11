import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type SupportedLanguage =
  | "pt"
  | "pt-br"
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

// Load English statically as the baseline to avoid showing raw keys on first render
import enStatic from "../translations/en.json";

// Import all translation files
const translations: Record<
  SupportedLanguage,
  () => Promise<{ default: Translations }>
> = {
  pt: () => import("../translations/pt.json"),
  "pt-br": () => import("../translations/pt-br.json"),
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
  "pt-br": "Português (Brasil)",
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
  const [currentTranslations, setCurrentTranslations] =
    useState<Translations>(enStatic);
  const [englishTranslations, setEnglishTranslations] =
    useState<Translations>(enStatic);

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
    ) as SupportedLanguage | null;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
      return;
    }

    // No saved language: try browser locale detection and map to supported languages
    const detectFromBrowser = (): SupportedLanguage | undefined => {
      if (typeof navigator === "undefined") return undefined;
      const raw = (
        navigator.language ||
        (navigator.languages && navigator.languages[0]) ||
        ""
      ).toLowerCase();
      if (!raw) return undefined;
      // Map common locales to supported languages
      if (raw.startsWith("pt-br") || raw === "pt-br") return "pt-br";
      if (raw.startsWith("pt")) return "pt";
      if (raw.startsWith("en")) return "en";
      if (raw.startsWith("es")) return "es";
      if (raw.startsWith("fr")) return "fr";
      if (raw.startsWith("de")) return "de";
      if (raw.startsWith("it")) return "it";
      if (raw.startsWith("ru")) return "ru";
      if (raw.startsWith("zh")) return "zh";
      if (raw.startsWith("ja")) return "ja";
      if (raw.startsWith("ko")) return "ko";
      if (raw.startsWith("ar")) return "ar";
      if (raw.startsWith("hi")) return "hi";
      if (raw.startsWith("tr")) return "tr";
      if (raw.startsWith("pl")) return "pl";
      if (raw.startsWith("nl")) return "nl";
      if (raw.startsWith("sv")) return "sv";
      if (raw.startsWith("da")) return "da";
      if (raw.startsWith("no")) return "no";
      if (raw.startsWith("fi")) return "fi";
      if (raw.startsWith("cs")) return "cs";
      return undefined;
    };

    const browserLang = detectFromBrowser();
    if (browserLang && translations[browserLang]) {
      setLanguageState(browserLang);
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
