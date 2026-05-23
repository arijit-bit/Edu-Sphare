"use client";

import * as React from "react";
import {
  DATE_LOCALES,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  translateText,
} from "@/lib/i18n";

const LanguageContext = React.createContext(undefined);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = React.useState(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    return localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en";
  });

  React.useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = React.useCallback((nextLanguage) => {
    setLanguageState(nextLanguage);
  }, []);

  const t = React.useCallback(
    (text, replacements) => translateText(language, text, replacements),
    [language]
  );

  const value = React.useMemo(
    () => ({
      language,
      setLanguage,
      t,
      options: LANGUAGE_OPTIONS,
      dateLocale: DATE_LOCALES[language] || DATE_LOCALES.en,
    }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
