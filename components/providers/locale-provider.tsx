"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  TRANSLATIONS,
  type Locale,
  type TranslationSchema,
} from "@/lib/i18n/translations";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationSchema;
  isRtl: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({
  children,
  initialLocale = "ar",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("life_os_locale", newLocale);
      document.cookie = `life_os_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

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
