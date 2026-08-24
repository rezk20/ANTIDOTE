"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createDump } from "@/lib/actions/brain-dump";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/locale-provider";
import { Sparkles } from "lucide-react";
import type { BrainDumpState } from "@/lib/schemas/brain-dump";

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="sm"
      variant="primary"
      isLoading={pending}
      className="shrink-0 rounded-xl"
    >
      {text}
    </Button>
  );
}

export function QuickCaptureBox({
  onSuccess,
  placeholder,
  autoFocus = false,
}: {
  onSuccess?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const { t, isRtl } = useLocale();
  const [state, formAction] = useActionState<BrainDumpState, FormData>(
    createDump,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [state?.ok, onSuccess]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        <span>{t.capture.title}</span>
      </div>

      <Textarea
        ref={textareaRef}
        name="content"
        autoFocus={autoFocus}
        placeholder={placeholder ?? t.capture.placeholder}
        rows={3}
        className="border-0 p-0 focus:ring-0 shadow-none bg-transparent resize-none text-sm placeholder:text-zinc-400"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
      />

      {state?.errors?.content && (
        <p className="text-xs text-rose-500 mt-1">{state.errors.content[0]}</p>
      )}

      {state?.message && !state.ok && (
        <p className="text-xs text-rose-500 mt-1">{state.message}</p>
      )}

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
          {isRtl ? "اضغط" : "Press"} <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px]">Ctrl+Enter</kbd> {isRtl ? "للحفظ السريع" : "to save"}
        </span>
        <SubmitButton text={t.capture.submit} />
      </div>
    </form>
  );
}
