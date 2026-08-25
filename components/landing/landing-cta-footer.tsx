"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Terminal } from "lucide-react";

export function LandingCtaFooter({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { isRtl } = useLocale();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950/80 relative overflow-hidden">
      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950 text-white relative overflow-hidden shadow-2xl border border-zinc-800 text-center space-y-6">
          {/* Subtle glow */}
          <div className="absolute top-0 right-1/4 w-[350px] h-[200px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-black backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>{isRtl ? "حان وقت الترتيب والانطلاق" : "Take Command Today"}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
            {isRtl
              ? "جاهز لامتلاك عقل ونظام قيادة حقيقي لحياتك؟"
              : "Ready to Execute with Absolute Clarity?"}
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 font-medium max-w-xl mx-auto">
            {isRtl
              ? "انضم الآن إلى ANTIDOTE، وابدأ في تنظيم مهامك، ومستهدفاتك المالية، وخططك الاستراتيجية في مكان واحد مشفر وآمن."
              : "Join ANTIDOTE now. Take control of your daily rhythm, financial targets, and strategic execution in one secure place."}
          </p>

          <div className="pt-2">
            <Link
              href={isAuthenticated ? "/home" : "/login"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-zinc-950 font-black text-sm hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 cursor-pointer"
            >
              <span>{isAuthenticated ? (isRtl ? "دخول لوحة التحكم" : "Open Your Dashboard") : (isRtl ? "ابدأ الاستخدام مجاناً" : "Launch Your OS Now")}</span>
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-black text-xs">
            L
          </div>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">ANTIDOTE (LIFE OS)</span>
          <span>•</span>
          <span>© 2026 High Agency Systems</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Multi-Tenant & RLS Protected</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
            <Terminal className="h-3.5 w-3.5" />
            <span>Hermes AI Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
