"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 gap-1.5 px-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
      onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
      aria-label="Toggle language"
      title={locale === "ar" ? "Switch to English" : "التحويل للغة العربية"}
    >
      <Languages className="h-4 w-4" />
      <span>{locale === "ar" ? "English" : "العربية"}</span>
    </Button>
  );
}
