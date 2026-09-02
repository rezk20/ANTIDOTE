"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

export function LandingNavbar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const { isRtl } = useLocale();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-zinc-200/80 bg-white/70 backdrop-blur-md transition-all dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt="Antidote Logo"
            width={32}
            height={32}
            className="transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              ANTIDOTE
            </span>
            <span className="text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500">
              LIFE OS
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-6 text-xs font-bold text-zinc-600 md:flex dark:text-zinc-400">
          <a
            href="#features"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {isRtl ? "المميزات الاستراتيجية" : "Strategic Engines"}
          </a>
          <a
            href="#hermes"
            className="flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <span>Hermes AI</span>
            <span className="py-0.2 rounded-full bg-indigo-100 px-1.5 text-[9px] font-extrabold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
              v1 API
            </span>
          </a>
          <a
            href="#manifesto"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            {isRtl ? "قواعد النظام (§Rules)" : "Philosophy"}
          </a>
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-2.5">
          <LanguageToggle />
          <ThemeToggle />

          <Link
            href={isAuthenticated ? "/home" : "/login"}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-zinc-900/10 transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
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
