"use client";

import { Menu, Sparkles, LogOut } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useLocale } from "@/components/providers/locale-provider";
import { logout } from "@/lib/actions/auth";
import type { ProfileRow } from "@/lib/supabase/types";

export function Topbar({
  profile,
  onToggleSidebar,
}: {
  profile: ProfileRow | null;
  onToggleSidebar: () => void;
}) {
  const { t } = useLocale();
  const displayName = profile?.display_name ?? "Ahmed";

  function triggerQuickCapture() {
    window.dispatchEvent(new CustomEvent("open-quick-capture"));
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur">
      {/* Left items: Mobile toggle & Timezone */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -mx-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {profile?.timezone ?? "Africa/Cairo"}
          </span>
          <span className="hidden sm:inline-block text-xs text-zinc-300 dark:text-zinc-700">
            •
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            {profile?.currency ?? "EGP"}
          </span>
        </div>
      </div>

      {/* Right items: Search, Language toggle, Capture trigger, theme toggle, profile & logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
          title="Search & Commands (Ctrl+K)"
        >
          <span className="hidden md:inline font-medium">{t.commandPalette.placeholder.split("...")[0]}...</span>
          <span className="md:hidden font-medium">بحث</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
            Ctrl+K
          </kbd>
        </button>

        {/* Language Toggle */}
        <LanguageToggle />

        {/* Quick Capture Button */}
        <button
          onClick={triggerQuickCapture}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer shadow-2xs"
          title="Quick Capture (Press B)"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span className="hidden sm:inline">{t.nav.capture}</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 font-mono text-[9px] text-zinc-500 dark:text-zinc-400">
            B
          </kbd>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

        {/* Profile info */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold shadow-xs">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title={t.nav.logout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
