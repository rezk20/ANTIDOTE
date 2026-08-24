"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/lib/actions/auth";
import { useLocale } from "@/components/providers/locale-provider";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { LoginState } from "@/lib/schemas/auth";

function SubmitButton({ text, loadingText }: { text: string; loadingText: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </span>
      ) : (
        text
      )}
    </button>
  );
}

export function LoginCard() {
  const { t, isRtl } = useLocale();
  const [state, formAction] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        {/* Top controls: Language & Theme */}
        <div className="flex items-center justify-between mb-6 px-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-extrabold text-2xl mb-3 shadow-lg shadow-zinc-900/10 dark:shadow-none">
            L
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.auth.welcome}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t.auth.subtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-7 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
          <form action={formAction} className="space-y-5">
            {/* Server Error Message */}
            {state?.message && (
              <div
                role="alert"
                className="p-3.5 rounded-xl text-sm bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
              >
                {state.message}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-zinc-700 dark:text-zinc-300"
              >
                {t.auth.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue="rezkgmal25@gmail.com"
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent transition-all"
              />
              {state?.errors?.email && (
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-zinc-700 dark:text-zinc-300"
              >
                {t.auth.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 focus:border-transparent transition-all"
              />
              {state?.errors?.password && (
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <SubmitButton text={t.auth.signIn} loadingText={t.auth.signingIn} />
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600 mt-6 font-medium">
          {isRtl ? "نظام قيادة شخصي مشفر وآمن بالكامل • RLS Enforced" : "Private single-owner system • RLS Protected"}
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <LoginCard />;
}
