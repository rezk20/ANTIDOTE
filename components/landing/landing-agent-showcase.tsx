"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { Bot, Terminal, ShieldCheck, Zap, Key, Code2 } from "lucide-react";

export function LandingAgentShowcase() {
  const { isRtl } = useLocale();

  return (
    <section id="hermes" className="py-24 border-t border-zinc-200/80 dark:border-zinc-800/80 relative overflow-hidden bg-zinc-900 dark:bg-zinc-950 text-white">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Info */}
          <div className="lg:w-1/2 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-500/30">
              <Bot className="h-3.5 w-3.5" />
              <span>{isRtl ? "جسر الوكيل الذكي الخارجي" : "Autonomous AI Copilot Engine"}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {isRtl ? (
                <>
                  شريك تنفيذي ذكي متصل مباشرة بنظام حياتك عبر{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Hermes API
                  </span>
                </>
              ) : (
                <>
                  Connect Any Autonomous Agent Directly to Your OS via{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Hermes API
                  </span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed">
              {isRtl
                ? "نقطة اتصال برمجية مؤمّنة بالكامل (Protected Endpoint) تسمح لوكلاء الـ AI مثل Hermes أو OpenClaw بقراءة سياق يومك الحي، التقاط الأفكار، تسجيل جلسات التركيز، وتوثيق صفقات الفريلانس بأمان تام."
                : "A protected Bearer API endpoint allowing AI agents (Hermes, OpenClaw, Cursor) to inspect your live context, capture thoughts, log deep work, and close pipeline leads on your behalf with strict tenant isolation."}
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-200">
                <Key className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{isRtl ? "مفاتيح مشفرة Bearer Token" : "Encrypted Bearer API Key"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-200">
                <Code2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>{isRtl ? "مخطط OpenAI Tool Calling" : "OpenAI Tool Calling Specs"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{isRtl ? "عزل تام لكل مستخدم" : "Strict Multi-Tenant Isolation"}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-200">
                <Zap className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>{isRtl ? "8 عمليات هيكلية مدعومة" : "8 Atomic Actions Supported"}</span>
              </div>
            </div>
          </div>

          {/* Right Terminal Window */}
          <div className="lg:w-1/2 w-full">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-xs shadow-2xl shadow-indigo-950/30 space-y-3 text-left">
              {/* Terminal topbar */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-[11px] text-zinc-400 font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-1 text-zinc-400">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span>hermes-agent-daemon</span>
                </div>
                <span className="text-emerald-400 font-bold">HTTP 200 OK</span>
              </div>

              {/* Code Snippet */}
              <div className="space-y-2 text-[11px] leading-relaxed text-zinc-300 overflow-x-auto py-2">
                <div className="text-zinc-500"># 1. Fetch live contextual state</div>
                <div className="text-cyan-300">
                  GET /api/agent/hermes
                </div>
                <div className="text-zinc-400">
                  Authorization: Bearer lsk_78a19f...
                </div>

                <div className="pt-2 text-zinc-500"># 2. Real-time context response returned:</div>
                <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 text-emerald-400 text-[11px]">
                  {`{
  "system": "LIFE OS (ANTIDOTE)",
  "today": { "activeTasks": 4, "deepWorkTarget": 270 },
  "marriageMission": { "progressPercent": 74 },
  "freelancePipeline": { "activeDeals": 5 }
}`}
                </div>

                <div className="pt-2 text-zinc-500"># 3. Agent executes instant atomic capture:</div>
                <div className="text-indigo-400">
                  {`POST /api/agent/hermes -> { "action": "capture_thought", "text": "Deploying API fix" }`}
                </div>
                <div className="text-emerald-400 font-bold">
                  ✓ Action executed & saved to user inbox.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
