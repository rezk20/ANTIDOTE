"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/lib/actions/auth";
import { useLocale } from "@/components/providers/locale-provider";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { LoginState } from "@/lib/schemas/auth";

function SubmitButton({
  text,
  loadingText,
}: {
  text: string;
  loadingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full cursor-pointer rounded-xl bg-zinc-900 px-4 py-3 text-sm font-bold text-white shadow-md transition-all duration-150 hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin text-current"
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
  const [oauthError, setOauthError] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        {/* Top controls: Language & Theme */}
        <div className="mb-6 flex items-center justify-between px-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {/* Header Branding */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-2xl font-extrabold text-white shadow-lg shadow-zinc-900/10 dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-none">
            L
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.auth.welcome}
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {t.auth.subtitle}
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <form action={formAction} className="space-y-5">
            {/* Server Error Message */}
            {(state?.message || oauthError) && (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300"
              >
                {state?.message || oauthError}
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
                placeholder="name@example.com"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-transparent focus:ring-2 focus:ring-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-zinc-400"
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
                className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-transparent focus:ring-2 focus:ring-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-zinc-400"
              />
              {state?.errors?.password && (
                <p className="text-xs text-rose-600 dark:text-rose-400">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <SubmitButton
                text={t.auth.signIn}
                loadingText={t.auth.signingIn}
              />
            </div>
          </form>

          {/* Social Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 font-bold tracking-wider text-zinc-400 dark:bg-zinc-900">
                {isRtl ? "أو المتابعة باستخدام" : "Or continue with"}
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={async () => {
              setOauthError(null);
              const { signInWithGoogle } = await import("@/lib/actions/auth");
              const res = await signInWithGoogle(window.location.origin);
              if (res.url) {
                window.location.href = res.url;
              } else if (res.error) {
                setOauthError(
                  isRtl
                    ? `خطأ في تسجيل الدخول بـ Google: ${res.error} (يرجى تفعيل Google Provider في لوحة تحكم Supabase)`
                    : `Google Sign-in Error: ${res.error} (Please enable Google Provider in Supabase Dashboard)`,
                );
              }
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-bold text-zinc-800 shadow-xs transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>
              {isRtl
                ? "تسجيل الدخول بحساب Google"
                : "Sign in with Google Account"}
            </span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-6 text-center text-[11px] font-medium text-zinc-400 dark:text-zinc-600">
          {isRtl
            ? "نظام قيادة شخصي مشفر وآمن بالكامل • RLS Enforced"
            : "Private single-owner system • RLS Protected"}
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <LoginCard />;
}
