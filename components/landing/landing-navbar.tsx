"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

export function LandingNavbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { isRtl } = useLocale();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            L
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              ANTIDOTE
            </span>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">
              LIFE OS v2.0
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <a href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            {isRtl ? "المميزات الاستراتيجية" : "Strategic Engines"}
          </a>
          <a href="#hermes" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1">
            <span>Hermes AI</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 font-extrabold">
              v1 API
            </span>
          </a>
          <a href="#manifesto" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            {isRtl ? "قواعد النظام (§Rules)" : "Philosophy"}
          </a>
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-2.5">
          <LanguageToggle />
          <ThemeToggle />

          <Link
            href={isAuthenticated ? "/home" : "/login"}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-extrabold text-xs hover:bg-zinc-800 dark:hover:bg-white transition-all shadow-md shadow-zinc-900/10 cursor-pointer"
          >
            {isAuthenticated ? (
              <>
                <span>{isRtl ? "لوحة التحكم" : "Go to Dashboard"}</span>
                <ArrowIcon className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>{isRtl ? "دخول النظام" : "Launch App"}</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
