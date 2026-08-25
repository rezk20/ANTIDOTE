"use client";

import { useState, useTransition } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  HERMES_MASTER_SYSTEM_PROMPT,
  HERMES_TOOL_DEFINITIONS,
} from "@/lib/schemas/agent";
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
  Code,
  FileText,
  Wrench,
  Terminal,
  ShieldCheck,
  Sparkles,
  Play,
  Send,
} from "lucide-react";

interface AgentViewProps {
  initialApiKey: string;
}

export function AgentView({ initialApiKey }: AgentViewProps) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<
    "credentials" | "prompt" | "tools" | "playground"
  >("credentials");

  // API Key State
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedTools, setCopiedTools] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isRotating, startRotating] = useTransition();

  // Playground State
  const [selectedAction, setSelectedAction] =
    useState<string>("capture_thought");
  const [playgroundPayloadText, setPlaygroundPayloadText] = useState<string>(
    JSON.stringify(
      {
        action: "capture_thought",
        text: "New priority note via Hermes agent.",
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

  const endpointUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/agent/hermes`
      : "/api/agent/hermes";

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleRotateKey = () => {
    if (!window.confirm(t.agentPage.rotateConfirm)) return;
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
    let sample: Record<string, unknown> = { action: actionName };

    switch (actionName) {
      case "capture_thought":
        sample = {
          action: "capture_thought",
          text: "Follow up with client regarding proposal",
          source: "hermes_chat",
        };
        break;
      case "create_task":
        sample = {
          action: "create_task",
          title: "Review architecture design",
          priority: "P1",
          estimated_minutes: 45,
        };
        break;
      case "log_time_entry":
        sample = {
          action: "log_time_entry",
          duration_min: 60,
          kind: "deep_work",
          focus_rating: 5,
          note: "API optimization sprint",
        };
        break;
      case "log_lead":
        sample = {
          action: "log_lead",
          title: "Enterprise Automation Client",
          expected_value: 20000,
          stage: "lead",
        };
        break;
      case "add_note":
        sample = {
          action: "add_note",
          title: "Agent Strategy Notes",
          content: "Hermes system integration notes...",
          folder: "tech",
          tags: ["ai", "hermes"],
        };
        break;
      case "create_decision":
        sample = {
          action: "create_decision",
          title: "Adopt new automated pipeline",
          upside: "2x efficiency",
          downside: "Setup time",
          reversible: true,
          risk: "medium",
        };
        break;
      case "save_debrief":
        sample = {
          action: "save_debrief",
          date: new Date().toISOString().split("T")[0],
          energy_rating: 5,
          accomplishments: "Completed agent endpoint.",
          tomorrow_focus: "Polish UI",
        };
        break;
    }

    setPlaygroundPayloadText(JSON.stringify(sample, null, 2));
  };

  const handleTestContextFetch = async () => {
    setIsFetchingContext(true);
    setContextData(null);
    try {
      const res = await fetch("/api/agent/hermes", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const json = await res.json();
      setContextData(JSON.stringify(json, null, 2));
    } catch (err) {
      setContextData(
        JSON.stringify({ error: (err as Error).message }, null, 2),
      );
    } finally {
      setIsFetchingContext(false);
    }
  };

  const handleExecutePlayground = () => {
    startExecuting(async () => {
      try {
        const parsed = JSON.parse(playgroundPayloadText);
        const res = await runAgentPlaygroundAction(parsed);
        setPlaygroundResponse(JSON.stringify(res, null, 2));
      } catch (err) {
        setPlaygroundResponse(
          JSON.stringify(
            {
              error:
                "Invalid JSON or execution error: " + (err as Error).message,
            },
            null,
            2,
          ),
        );
      }
    });
  };

  const curlSnippet = `curl -X GET "${endpointUrl}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"`;

  const curlPostSnippet = `curl -X POST "${endpointUrl}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ action: "capture_thought", text: "New priority item" })}'`;

  const jsFetchSnippet = `const response = await fetch("${endpointUrl}", {
  method: "GET",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
  }
});
const context = await response.json();
console.log("LIFE OS Context:", context);`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-2xl bg-indigo-500/10 p-2.5 text-indigo-600 dark:text-indigo-400">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="flex items-center gap-2.5 text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
                <span>{t.agentPage.title}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  <span>{t.agentPage.statusSecured}</span>
                </span>
              </h1>
              <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                {t.agentPage.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-200 pb-2 text-xs font-bold dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("credentials")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 transition-all ${
            activeTab === "credentials"
              ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Key className="h-3.5 w-3.5" />
          <span>{t.agentPage.tabs.credentials}</span>
        </button>

        <button
          onClick={() => setActiveTab("prompt")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 transition-all ${
            activeTab === "prompt"
              ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>{t.agentPage.tabs.prompt}</span>
        </button>

        <button
          onClick={() => setActiveTab("tools")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 transition-all ${
            activeTab === "tools"
              ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>{t.agentPage.tabs.tools}</span>
        </button>

        <button
          onClick={() => setActiveTab("playground")}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 transition-all ${
            activeTab === "playground"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>{t.agentPage.tabs.playground}</span>
        </button>
      </div>

      {/* TAB 1: CREDENTIALS & CONNECTION */}
      {activeTab === "credentials" && (
        <div className="space-y-6">
          {/* Endpoint & Key Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Endpoint URL Card */}
            <div className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <Code className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                    {t.agentPage.endpointUrl}
                  </h3>
                </div>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-extrabold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  GET / POST
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={endpointUrl}
                  className="h-10 rounded-xl bg-zinc-50 font-mono text-xs dark:bg-zinc-800"
                />
                <Button
                  onClick={() => handleCopy(endpointUrl, setCopiedUrl)}
                  className="h-10 cursor-pointer rounded-xl bg-zinc-900 px-3.5 text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {copiedUrl ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {t.agentPage.statusProtected}
              </p>
            </div>

            {/* API Key Card */}
            <div className="space-y-3 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                    <Key className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                    {t.agentPage.apiKey}
                  </h3>
                </div>
                <Button
                  onClick={handleRotateKey}
                  disabled={isRotating}
                  variant="outline"
                  className="h-7 cursor-pointer gap-1 rounded-lg border-zinc-200 text-[10px] font-bold dark:border-zinc-700"
                >
                  <RotateCw
                    className={`h-3 w-3 ${isRotating ? "animate-spin" : ""}`}
                  />
                  <span>{t.agentPage.rotateKey}</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  className="h-10 rounded-xl bg-zinc-50 font-mono text-xs dark:bg-zinc-800"
                />
                <Button
                  onClick={() => setShowKey(!showKey)}
                  variant="outline"
                  className="h-10 cursor-pointer rounded-xl border-zinc-200 px-3 dark:border-zinc-700"
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={() => handleCopy(apiKey, setCopiedKey)}
                  className="h-10 cursor-pointer rounded-xl bg-zinc-900 px-3.5 text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {copiedKey ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Bearer Token Header:{" "}
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[10px] dark:bg-zinc-800">
                  Authorization: Bearer lsk_...
                </code>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-800/60 dark:bg-indigo-950/30">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <p className="text-xs leading-relaxed text-indigo-900 dark:text-indigo-200">
              {t.agentPage.authNotice}
            </p>
          </div>

          {/* Code Snippets Card */}
          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="flex items-center gap-2 text-xs font-black text-zinc-900 dark:text-zinc-100">
              <Code className="h-4 w-4 text-zinc-500" />
              <span>{t.agentPage.codeExamples}</span>
            </h3>

            <div className="space-y-3" dir="ltr">
              <div>
                <Label className="mb-1 block text-[11px] font-bold text-zinc-500">
                  cURL (GET Context)
                </Label>
                <pre className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-200">
                  {curlSnippet}
                </pre>
              </div>

              <div>
                <Label className="mb-1 block text-[11px] font-bold text-zinc-500">
                  cURL (POST Execute Action)
                </Label>
                <pre className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-200">
                  {curlPostSnippet}
                </pre>
              </div>

              <div>
                <Label className="mb-1 block text-[11px] font-bold text-zinc-500">
                  Node.js / JavaScript Fetch
                </Label>
                <pre className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-200">
                  {jsFetchSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER SYSTEM PROMPT */}
      {activeTab === "prompt" && (
        <div className="space-y-4">
          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {t.agentPage.promptTitle}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t.agentPage.promptSubtitle}
                </p>
              </div>

              <Button
                onClick={() =>
                  handleCopy(HERMES_MASTER_SYSTEM_PROMPT, setCopiedPrompt)
                }
                className="shrink-0 cursor-pointer gap-2 rounded-xl bg-zinc-900 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                {copiedPrompt ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{t.agentPage.copyPrompt}</span>
              </Button>
            </div>

            <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{t.agentPage.promptUsageNotice}</span>
            </div>

            <pre
              dir="ltr"
              className="max-h-[500px] overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-200"
            >
              {HERMES_MASTER_SYSTEM_PROMPT}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: TOOL CALLING SPECS */}
      {activeTab === "tools" && (
        <div className="space-y-4">
          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {t.agentPage.toolsTitle}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t.agentPage.toolsSubtitle}
                </p>
              </div>

              <Button
                onClick={() =>
                  handleCopy(
                    JSON.stringify(HERMES_TOOL_DEFINITIONS, null, 2),
                    setCopiedTools,
                  )
                }
                className="shrink-0 cursor-pointer gap-2 rounded-xl bg-zinc-900 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                {copiedTools ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span>{t.agentPage.copyTools}</span>
              </Button>
            </div>

            <pre
              dir="ltr"
              className="max-h-[550px] overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-xs leading-relaxed text-emerald-400"
            >
              {JSON.stringify(HERMES_TOOL_DEFINITIONS, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE TEST PLAYGROUND */}
      {activeTab === "playground" && (
        <div className="space-y-6">
          <div className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {t.agentPage.playgroundTitle}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t.agentPage.playgroundSubtitle}
              </p>
            </div>

            {/* Quick Context Inspector */}
            <div
              dir="ltr"
              className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  1. Live Context Retrieval (GET /api/agent/hermes)
                </span>
                <Button
                  onClick={handleTestContextFetch}
                  disabled={isFetchingContext}
                  size="sm"
                  className="cursor-pointer gap-2 rounded-xl bg-zinc-900 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>
                    {isFetchingContext
                      ? t.agentPage.loadingContext
                      : t.agentPage.testContextBtn}
                  </span>
                </Button>
              </div>

              {contextData && (
                <pre className="max-h-72 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-[11px] text-sky-300">
                  {contextData}
                </pre>
              )}
            </div>

            {/* Action Simulator */}
            <div className="space-y-4 pt-2">
              <span className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                2. Action Execution Simulator (POST /api/agent/hermes)
              </span>

              <div className="flex flex-wrap gap-2">
                {[
                  "capture_thought",
                  "create_task",
                  "log_time_entry",
                  "log_lead",
                  "add_note",
                  "create_decision",
                  "save_debrief",
                ].map((act) => (
                  <button
                    key={act}
                    onClick={() => handleActionChange(act)}
                    className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedAction === act
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-500">
                  JSON Action Payload
                </Label>
                <Textarea
                  value={playgroundPayloadText}
                  onChange={(e) => setPlaygroundPayloadText(e.target.value)}
                  rows={6}
                  className="rounded-2xl bg-zinc-50 font-mono text-xs dark:bg-zinc-800/80"
                />
              </div>

              <Button
                onClick={handleExecutePlayground}
                disabled={isExecuting}
                className="cursor-pointer gap-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700"
              >
                <Send className="h-4 w-4" />
                <span>
                  {isExecuting
                    ? t.agentPage.executing
                    : t.agentPage.executeAction}
                </span>
              </Button>

              {playgroundResponse && (
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold text-zinc-500">
                    {t.agentPage.responseTitle}
                  </Label>
                  <pre className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-emerald-400">
                    {playgroundResponse}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
