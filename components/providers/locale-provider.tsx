"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TRANSLATIONS, type Locale, type TranslationSchema } from "@/lib/i18n/translations";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationSchema;
  isRtl: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("life_os_locale") as Locale | null;
      if (saved === "en" || saved === "ar") return saved;
    }
    return "ar";
  });

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("life_os_locale", newLocale);
    }
  }

  const currentTranslations = TRANSLATIONS[locale] || TRANSLATIONS.ar;
  const isRtl = locale === "ar";

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        t: currentTranslations,
        isRtl,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    return {
      locale: "ar" as Locale,
      setLocale: () => {},
      t: TRANSLATIONS.ar,
      isRtl: true,
    };
  }
  return context;
}
