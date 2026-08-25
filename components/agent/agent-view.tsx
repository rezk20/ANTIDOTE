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
  const [selectedAction, setSelectedAction] = useState<string>("capture_thought");
  const [playgroundPayloadText, setPlaygroundPayloadText] = useState<string>(
    JSON.stringify({ action: "capture_thought", text: "New priority note via Hermes agent." }, null, 2),
  );
  const [playgroundResponse, setPlaygroundResponse] = useState<string | null>(null);
  const [isExecuting, startExecuting] = useTransition();
  const [contextData, setContextData] = useState<string | null>(null);
  const [isFetchingContext, setIsFetchingContext] = useState(false);

  const endpointUrl = typeof window !== "undefined"
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
      if (res.ok && res.data && typeof res.data === "object" && "apiKey" in res.data) {
        setApiKey((res.data as { apiKey: string }).apiKey);
      }
    });
  };

  const handleActionChange = (actionName: string) => {
    setSelectedAction(actionName);
    let sample: Record<string, unknown> = { action: actionName };

    switch (actionName) {
      case "capture_thought":
        sample = { action: "capture_thought", text: "Follow up with client regarding proposal", source: "hermes_chat" };
        break;
      case "create_task":
        sample = { action: "create_task", title: "Review architecture design", priority: "P1", estimated_minutes: 45 };
        break;
      case "log_time_entry":
        sample = { action: "log_time_entry", duration_min: 60, kind: "deep_work", focus_rating: 5, note: "API optimization sprint" };
        break;
      case "log_lead":
        sample = { action: "log_lead", title: "Enterprise Automation Client", expected_value: 20000, stage: "lead" };
        break;
      case "add_note":
        sample = { action: "add_note", title: "Agent Strategy Notes", content: "Hermes system integration notes...", folder: "tech", tags: ["ai", "hermes"] };
        break;
      case "create_decision":
        sample = { action: "create_decision", title: "Adopt new automated pipeline", upside: "2x efficiency", downside: "Setup time", reversible: true, risk: "medium" };
        break;
      case "save_debrief":
        sample = { action: "save_debrief", date: new Date().toISOString().split("T")[0], energy_rating: 5, accomplishments: "Completed agent endpoint.", tomorrow_focus: "Polish UI" };
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
      setContextData(JSON.stringify({ error: (err as Error).message }, null, 2));
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
        setPlaygroundResponse(JSON.stringify({ error: "Invalid JSON or execution error: " + (err as Error).message }, null, 2));
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
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100 flex items-center gap-2.5">
                <span>{t.agentPage.title}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <ShieldCheck className="h-3 w-3" />
                  <span>{t.agentPage.statusSecured}</span>
                </span>
              </h1>
              <p className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400 mt-0.5">
                {t.agentPage.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab("credentials")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "credentials"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Key className="h-3.5 w-3.5" />
          <span>{t.agentPage.tabs.credentials}</span>
        </button>

        <button
          onClick={() => setActiveTab("prompt")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "prompt"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>{t.agentPage.tabs.prompt}</span>
        </button>

        <button
          onClick={() => setActiveTab("tools")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "tools"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          }`}
        >
          <Wrench className="h-3.5 w-3.5" />
          <span>{t.agentPage.tabs.tools}</span>
        </button>

        <button
          onClick={() => setActiveTab("playground")}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "playground"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Endpoint URL Card */}
            <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    <Code className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                    {t.agentPage.endpointUrl}
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  GET / POST
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={endpointUrl}
                  className="h-10 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 rounded-xl"
                />
                <Button
                  onClick={() => handleCopy(endpointUrl, setCopiedUrl)}
                  className="h-10 px-3.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
                >
                  {copiedUrl ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {t.agentPage.statusProtected}
              </p>
            </div>

            {/* API Key Card */}
            <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
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
                  className="h-7 text-[10px] font-bold rounded-lg gap-1 border-zinc-200 dark:border-zinc-700 cursor-pointer"
                >
                  <RotateCw className={`h-3 w-3 ${isRotating ? "animate-spin" : ""}`} />
                  <span>{t.agentPage.rotateKey}</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  className="h-10 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 rounded-xl"
                />
                <Button
                  onClick={() => setShowKey(!showKey)}
                  variant="outline"
                  className="h-10 px-3 rounded-xl border-zinc-200 dark:border-zinc-700 cursor-pointer"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => handleCopy(apiKey, setCopiedKey)}
                  className="h-10 px-3.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
                >
                  {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Bearer Token Header: <code className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">Authorization: Bearer lsk_...</code>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
              {t.agentPage.authNotice}
            </p>
          </div>

          {/* Code Snippets Card */}
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Code className="h-4 w-4 text-zinc-500" />
              <span>{t.agentPage.codeExamples}</span>
            </h3>

            <div className="space-y-3">
              <div>
                <Label className="text-[11px] font-bold text-zinc-500 mb-1 block">
                  cURL (GET Context)
                </Label>
                <pre className="p-4 rounded-2xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800">
                  {curlSnippet}
                </pre>
              </div>

              <div>
                <Label className="text-[11px] font-bold text-zinc-500 mb-1 block">
                  cURL (POST Execute Action)
                </Label>
                <pre className="p-4 rounded-2xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800">
                  {curlPostSnippet}
                </pre>
              </div>

              <div>
                <Label className="text-[11px] font-bold text-zinc-500 mb-1 block">
                  Node.js / JavaScript Fetch
                </Label>
                <pre className="p-4 rounded-2xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto border border-zinc-800">
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
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {t.agentPage.promptTitle}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t.agentPage.promptSubtitle}
                </p>
              </div>

              <Button
                onClick={() => handleCopy(HERMES_MASTER_SYSTEM_PROMPT, setCopiedPrompt)}
                className="gap-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer text-xs font-bold shrink-0"
              >
                {copiedPrompt ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{t.agentPage.copyPrompt}</span>
              </Button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{t.agentPage.promptUsageNotice}</span>
            </div>

            <pre className="p-5 rounded-2xl bg-zinc-950 text-zinc-200 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-zinc-800 max-h-[500px]">
              {HERMES_MASTER_SYSTEM_PROMPT}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: TOOL CALLING SPECS */}
      {activeTab === "tools" && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                className="gap-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer text-xs font-bold shrink-0"
              >
                {copiedTools ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{t.agentPage.copyTools}</span>
              </Button>
            </div>

            <pre className="p-5 rounded-2xl bg-zinc-950 text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto border border-zinc-800 max-h-[550px]">
              {JSON.stringify(HERMES_TOOL_DEFINITIONS, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE TEST PLAYGROUND */}
      {activeTab === "playground" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5">
            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                {t.agentPage.playgroundTitle}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {t.agentPage.playgroundSubtitle}
              </p>
            </div>

            {/* Quick Context Inspector */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  1. Live Context Retrieval (GET /api/agent/hermes)
                </span>
                <Button
                  onClick={handleTestContextFetch}
                  disabled={isFetchingContext}
                  size="sm"
                  className="rounded-xl gap-2 text-xs font-bold cursor-pointer bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>{isFetchingContext ? t.agentPage.loadingContext : t.agentPage.testContextBtn}</span>
                </Button>
              </div>

              {contextData && (
                <pre className="p-4 rounded-xl bg-zinc-950 text-sky-300 font-mono text-[11px] overflow-x-auto max-h-72 border border-zinc-800">
                  {contextData}
                </pre>
              )}
            </div>

            {/* Action Simulator */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedAction === act
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
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
                  className="font-mono text-xs rounded-2xl bg-zinc-50 dark:bg-zinc-800/80"
                />
              </div>

              <Button
                onClick={handleExecutePlayground}
                disabled={isExecuting}
                className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>{isExecuting ? t.agentPage.executing : t.agentPage.executeAction}</span>
              </Button>

              {playgroundResponse && (
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-bold text-zinc-500">
                    {t.agentPage.responseTitle}
                  </Label>
                  <pre className="p-4 rounded-2xl bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-zinc-800">
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
