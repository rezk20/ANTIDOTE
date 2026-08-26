"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HERMES_MASTER_SYSTEM_PROMPT } from "@/lib/schemas/agent";
import { AgentReportViewer } from "./agent-report-viewer";
import {
  regenerateAgentApiKeyAction,
  runAgentPlaygroundAction,
} from "@/lib/actions/agent";
import {
  Bot,
  Key,
  Copy,
  Check,
  RotateCw,
  Eye,
  EyeOff,
  FileText,
  Clock,
  Sparkles,
  Play,
  Send,
  Terminal,
} from "lucide-react";

interface AgentReportItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags: string[];
}

interface AgentViewProps {
  initialApiKey: string;
  initialReports?: AgentReportItem[];
}

export function AgentView({
  initialApiKey,
  initialReports = [],
}: AgentViewProps) {
  const { isRtl } = useLocale();
  const [activeTab, setActiveTab] = useState<
    "credentials" | "prompt" | "reports" | "playground"
  >("credentials");

  // API Key State
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCronScript, setCopiedCronScript] = useState(false);
  const [isRotating, startRotating] = useTransition();

  // Reports
  const [reports] = useState<AgentReportItem[]>(initialReports);

  // Playground State
  const [selectedAction, setSelectedAction] =
    useState<string>("orchestrate_day");
  const [playgroundPayloadText, setPlaygroundPayloadText] = useState<string>(
    JSON.stringify(
      {
        action: "orchestrate_day",
        target_date: new Date().toISOString().slice(0, 10),
        available_hours: 8,
        energy: 4,
        focus_question_answer:
          "نشر Demo لمشروع الـ SaaS وإرسال 5 مقترحات Upwork.",
        executive_briefing:
          "تمت معايرة خطة الصباح بنجاح مع تحديد 3 أولويات قصوى.",
      },
      null,
      2,
    ),
  );
  const [playgroundResponse, setPlaygroundResponse] = useState<string | null>(
    null,
  );
  const [isExecuting, startExecuting] = useTransition();
  const [contextData, setContextData] = useState<string | null>(null);
  const [isFetchingContext, setIsFetchingContext] = useState(false);

  const endpointUrl = "https://smart-antidote.vercel.app/api/agent/hermes";
  // typeof window !== "undefined"
  //   ? `${window.location.origin}/api/agent/hermes`
  //   : "http://localhost:3000/api/agent/hermes";

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleRotateKey = () => {
    if (
      !window.confirm(
        "هل أنت متأكد من رغبتك في تدوير المفتاح السري؟ ستحتاج لتحديثه في كل برامج الأتمتة الخارجية.",
      )
    )
      return;
    startRotating(async () => {
      const res = await regenerateAgentApiKeyAction();
      if (
        res.ok &&
        res.data &&
        typeof res.data === "object" &&
        "apiKey" in res.data
      ) {
        setApiKey((res.data as { apiKey: string }).apiKey);
      }
    });
  };

  const handleActionChange = (actionName: string) => {
    setSelectedAction(actionName);
    const todayStr = new Date().toISOString().slice(0, 10);
    let sample: Record<string, unknown> = { action: actionName };

    switch (actionName) {
      case "orchestrate_day":
        sample = {
          action: "orchestrate_day",
          target_date: todayStr,
          available_hours: 8,
          energy: 4,
          focus_question_answer:
            "نشر Live Demo لمشروع SaaS Dashboard وإرسال 5 مقترحات Upwork.",
          brain_dump_suggestions: [
            "فكرة خدمة مصغرة: أتمتة ديسكورد بوت + لوحة تحكم ويب.",
          ],
          executive_briefing:
            "تم تجهيز خطة اليوم: 4 ساعات Deep Work و 2 ساعة مبيعات ومتابعات.",
        };
        break;
      case "set_day_plan":
        sample = {
          action: "set_day_plan",
          plan_date: todayStr,
          available_hours: 8,
          energy: 4,
          focus_question_answer: "إنجاز أهم 3 مهام استراتيجية لتوليد الدخل.",
          notes: "تمت المعايرة بواسطة Hermes AI.",
        };
        break;
      case "add_brain_dump":
        sample = {
          action: "add_brain_dump",
          content:
            "فكرة مشروع: نظام إدارة صالونات وحجوزات بـ Next.js و Postgres.",
          category: "business",
        };
        break;
      case "create_task":
        sample = {
          action: "create_task",
          title: "إرسال 5 مقترحات Upwork لعملاء Next.js",
          priority: "P1",
          task_type: "revenue",
          scheduled_date: todayStr,
          estimated_minutes: 60,
          is_top_three: true,
        };
        break;
      case "log_report":
        sample = {
          action: "log_report",
          title: `تقرير التخطيط اليومي - ${todayStr}`,
          summary: "تمت مراجعة خطة اليوم وتوزيع 8 ساعات عمل مركزة.",
          changes_made: ["تحديد الأولويات الـ 3", "ترحيل المهام الإدارية"],
          strategic_recommendations: ["التركيز في كتل بومودورو 90 دقيقة."],
        };
        break;
      case "capture_thought":
        sample = {
          action: "capture_thought",
          text: "متابعة العميل المحتمل بخصوص المقترح الفني",
          source: "hermes_chat",
        };
        break;
      default:
        sample = { action: actionName };
    }

    setPlaygroundPayloadText(JSON.stringify(sample, null, 2));
  };

  const handleFetchLiveContext = async () => {
    setIsFetchingContext(true);
    setContextData(null);
    try {
      const res = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setContextData(JSON.stringify(data, null, 2));
    } catch (err) {
      setContextData(
        JSON.stringify({ error: (err as Error).message }, null, 2),
      );
    } finally {
      setIsFetchingContext(false);
    }
  };

  const handleRunAction = () => {
    setPlaygroundResponse(null);
    startExecuting(async () => {
      try {
        const parsed = JSON.parse(playgroundPayloadText);
        const res = await runAgentPlaygroundAction(parsed);
        setPlaygroundResponse(JSON.stringify(res, null, 2));
      } catch (err) {
        setPlaygroundResponse(
          JSON.stringify(
            { error: "Invalid JSON format", details: (err as Error).message },
            null,
            2,
          ),
        );
      }
    });
  };

  const sampleCronScript = `// Example 12:00 AM Midnight Cron Orchestrator (Node.js / GitHub Actions / Serverless)
async function runMidnightOrchestration() {
  const API_KEY = "${apiKey}";
  const ENDPOINT = "${endpointUrl}";

  // 1. Fetch Live Context
  const contextRes = await fetch(ENDPOINT, {
    headers: { "Authorization": \`Bearer \${API_KEY}\` }
  });
  const { context } = await contextRes.json();
  console.log("Live context loaded for:", context.user.displayName);

  // 2. Compute Tomorrow's Plan (or feed context to LLM)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const targetDate = tomorrow.toISOString().slice(0, 10);

  // 3. Send Autonomous Orchestration Payload
  const orchestrateRes = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${API_KEY}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "orchestrate_day",
      target_date: targetDate,
      available_hours: 8,
      energy: 4,
      focus_question_answer: "إنهاء ونشر الـ Live Demo وإرسال 5 مقترحات Upwork.",
      brain_dump_suggestions: [
        "فكرة أتمتة جديدة لمجتمعات الألعاب والشركات."
      ],
      executive_briefing: "تم تجهيز خطة اليوم بالكامل مع تحديد أهم 3 مهام وتخصيص 4 ساعات Deep Work."
    })
  });

  const result = await orchestrateRes.json();
  console.log("✅ Morning plan orchestrated successfully:", result);
}

runMidnightOrchestration().catch(console.error);`;

  return (
    <div className="animate-in fade-in space-y-8 duration-150">
      {/* 1. Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-600 dark:text-purple-400">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                {isRtl
                  ? "الوكيل الذكي (Hermes Copilot & Orchestrator)"
                  : "Hermes AI Orchestrator"}
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">
              {isRtl
                ? "واجهة برمجية آمنة (REST API) للـ AI لتخطيط يومك تلقائياً كل منتصف ليل وتنظيم أهدافك وأفكارك."
                : "Secure REST API for autonomous daily morning orchestration, deep work planning, and task optimization."}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="scrollbar-none flex items-center gap-1 overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-100 p-1 text-xs font-bold dark:border-zinc-700 dark:bg-zinc-800">
          <button
            onClick={() => setActiveTab("credentials")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
              activeTab === "credentials"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <Key className="h-3.5 w-3.5 text-purple-500" />
            <span>المفتاح ونقاط الاتصال</span>
          </button>

          <button
            onClick={() => setActiveTab("prompt")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
              activeTab === "prompt"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>البرومبت وجدولة الـ Midnight Cron</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
              activeTab === "reports"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-purple-500" />
            <span>تقارير وعمليات الـ AI ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("playground")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 whitespace-nowrap transition-all ${
              activeTab === "playground"
                ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <Play className="h-3.5 w-3.5 text-purple-500" />
            <span>مختبر التجربة (Playground)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Credentials & Endpoints */}
      {activeTab === "credentials" && (
        <div className="space-y-6">
          {/* API Key Card */}
          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-purple-500/10 p-2 text-purple-600">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                    مفتاح التوثيق السري (Agent API Key)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    استخدم هذا التوكن في رأس الطلب{" "}
                    <code className="font-mono text-purple-600">
                      Authorization: Bearer &lt;TOKEN&gt;
                    </code>{" "}
                    للوصول لبياناتك.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRotateKey}
                disabled={isRotating}
                className="cursor-pointer gap-1.5 rounded-xl border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40"
              >
                <RotateCw
                  className={`h-3.5 w-3.5 ${isRotating ? "animate-spin" : ""}`}
                />
                <span>تدوير المفتاح (Rotate)</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="rounded-2xl bg-zinc-50 pr-10 font-mono text-xs dark:bg-zinc-800/80"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer text-zinc-400 hover:text-zinc-700"
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button
                onClick={() => handleCopy(apiKey, setCopiedKey)}
                className="shrink-0 cursor-pointer gap-1.5 rounded-2xl bg-purple-600 text-xs font-bold text-white shadow-xs hover:bg-purple-700"
              >
                {copiedKey ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedKey ? "تم النسخ!" : "نسخ المفتاح"}</span>
              </Button>
            </div>
          </div>

          {/* Endpoint Reference */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* GET Context */}
            <div className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 font-mono text-xs font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  GET
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  قراءة سياق النظام الحي
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                يرجع كافة أهدافك، المهام المعلقة، صفقات الفريلانس، ميزانية
                الزواج، وخطة اليوم.
              </p>
              <div className="rounded-xl bg-zinc-50 p-2.5 font-mono text-[11px] break-all text-zinc-700 select-all dark:bg-zinc-800 dark:text-zinc-300">
                {endpointUrl}
              </div>
            </div>

            {/* POST Action */}
            <div className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-mono text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  POST
                </span>
                <span className="text-xs font-bold text-zinc-400">
                  تنفيذ عمليات التخطيط والأتمتة
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                يدعم جدولة خطة الصباح (
                <code className="font-bold text-purple-600">
                  orchestrate_day
                </code>
                )، إنشاء المهام، وتسجيل التقارير.
              </p>
              <div className="rounded-xl bg-zinc-50 p-2.5 font-mono text-[11px] break-all text-zinc-700 select-all dark:bg-zinc-800 dark:text-zinc-300">
                {endpointUrl}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Master System Prompt & 12:00 AM Cron Guide */}
      {activeTab === "prompt" && (
        <div className="space-y-6">
          {/* Master Prompt Card */}
          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span>
                    البرومبت الشامل للـ AI (Hermes Master System Prompt)
                  </span>
                </h3>
                <p className="text-xs text-zinc-500">
                  انسخ هذا البرومبت بالكامل وأعطه للـ AI (ChatGPT / Claude /
                  Custom Agent) مع المفتاح السري ليدير حياتك بذكاء.
                </p>
              </div>

              <Button
                onClick={() =>
                  handleCopy(HERMES_MASTER_SYSTEM_PROMPT, setCopiedPrompt)
                }
                className="shrink-0 cursor-pointer gap-1.5 rounded-xl bg-purple-600 text-xs font-bold text-white shadow-xs hover:bg-purple-700"
              >
                {copiedPrompt ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>
                  {copiedPrompt ? "تم النسخ!" : "نسخ البرومبت الشامل"}
                </span>
              </Button>
            </div>

            <pre
              dir="ltr"
              className="max-h-[380px] overflow-y-auto rounded-2xl bg-zinc-950 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-200 select-all"
            >
              {HERMES_MASTER_SYSTEM_PROMPT}
            </pre>
          </div>

          {/* 12:00 AM Cron Automation Script Card */}
          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>
                    سكريبت الجدولة اليومية لمنتصف الليل (12:00 AM Midnight Cron
                    Script)
                  </span>
                </h3>
                <p className="text-xs text-zinc-500">
                  يمكنك تشغيل هذا الكود يومياً الساعة 12 بليل عبر GitHub Actions
                  أو Cron-job.org أو n8n أو سيرفرك الخاص.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  handleCopy(sampleCronScript, setCopiedCronScript)
                }
                className="shrink-0 cursor-pointer gap-1.5 rounded-xl text-xs font-bold"
              >
                {copiedCronScript ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>
                  {copiedCronScript ? "تم نسخ السكريبت!" : "نسخ كود الجدولة"}
                </span>
              </Button>
            </div>

            <pre
              dir="ltr"
              className="max-h-[300px] overflow-y-auto rounded-2xl bg-zinc-950 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-emerald-400 select-all"
            >
              {sampleCronScript}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: Reports & Audit Timeline */}
      {activeTab === "reports" && (
        <AgentReportViewer reports={reports} />
      )}

      {/* TAB 4: Playground */}
      {activeTab === "playground" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Request Builder */}
            <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xs font-black text-zinc-900 dark:text-zinc-100">
                  <Play className="h-4 w-4 text-purple-500" />
                  <span>توليد وتجربة الـ Payloads</span>
                </h3>

                <select
                  value={selectedAction}
                  onChange={(e) => handleActionChange(e.target.value)}
                  className="rounded-xl border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs font-bold dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <option value="orchestrate_day">
                    orchestrate_day (جدولة شاملة لمنتصف الليل)
                  </option>
                  <option value="set_day_plan">
                    set_day_plan (معايرة خطة الصباح)
                  </option>
                  <option value="create_task">create_task (إنشاء مهمة)</option>
                  <option value="add_brain_dump">
                    add_brain_dump (إضافة فكرة واقتراح)
                  </option>
                  <option value="log_report">
                    log_report (تسجيل تقرير تنفيذي)
                  </option>
                  <option value="capture_thought">
                    capture_thought (تسجيل فكرة سريعة)
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-500">
                  JSON Payload
                </Label>
                <Textarea
                  value={playgroundPayloadText}
                  onChange={(e) => setPlaygroundPayloadText(e.target.value)}
                  rows={12}
                  className="rounded-2xl bg-zinc-50 font-mono text-xs dark:bg-zinc-800"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFetchLiveContext}
                  disabled={isFetchingContext}
                  className="cursor-pointer gap-1.5 rounded-xl text-xs font-bold"
                >
                  <RotateCw
                    className={`h-3.5 w-3.5 ${isFetchingContext ? "animate-spin" : ""}`}
                  />
                  <span>قراءة السياق الحي (GET)</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleRunAction}
                  disabled={isExecuting}
                  className="cursor-pointer gap-1.5 rounded-xl bg-purple-600 text-xs font-bold text-white shadow-xs hover:bg-purple-700"
                >
                  <Send
                    className={`h-3.5 w-3.5 ${isExecuting ? "animate-bounce" : ""}`}
                  />
                  <span>
                    {isExecuting ? "جارِ التنفيذ..." : "إرسال وتطبيق (POST)"}
                  </span>
                </Button>
              </div>
            </div>

            {/* Response Viewer */}
            <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="flex items-center gap-2 text-xs font-black text-zinc-900 dark:text-zinc-100">
                <Terminal className="h-4 w-4 text-emerald-500" />
                <span>استجابة السيرفر (Execution Response)</span>
              </h3>

              {contextData && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400">
                    Live Context Payload:
                  </span>
                  <pre className="max-h-[160px] overflow-y-auto rounded-2xl bg-zinc-950 p-3.5 font-mono text-[11px] whitespace-pre-wrap text-emerald-400 select-all">
                    {contextData}
                  </pre>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-400">
                  Action Result Output:
                </span>
                <pre className="max-h-[300px] min-h-[180px] overflow-y-auto rounded-2xl bg-zinc-950 p-3.5 font-mono text-[11px] whitespace-pre-wrap text-purple-300 select-all">
                  {playgroundResponse ||
                    "// اضغط على 'إرسال وتطبيق' لتنفيذ العملية ورؤية النتيجة فوراً."}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
