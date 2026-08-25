"use client";

import { useLocale } from "@/components/providers/locale-provider";
import {
  Inbox,
  Briefcase,
  Users,
  Bot,
  Box,
  Heart,
  DollarSign,
  GraduationCap,
  Activity,
  Workflow,
  Scale,
  FileCode,
  Archive,
  Layers,
} from "lucide-react";
import type { FolderCount } from "@/lib/dal/notes";
import type { TranslationSchema } from "@/lib/i18n/translations";

export const FOLDER_ICONS: Record<string, React.ReactNode> = {
  all: <Layers className="h-4 w-4 text-zinc-500" />,
  inbox: <Inbox className="h-4 w-4 text-blue-500" />,
  "business-strategy": <Briefcase className="h-4 w-4 text-indigo-500" />,
  "freelance-clients": <Users className="h-4 w-4 text-sky-500" />,
  "discord-bots": <Bot className="h-4 w-4 text-purple-500" />,
  "products-saas": <Box className="h-4 w-4 text-amber-500" />,
  "marriage-home": <Heart className="h-4 w-4 text-rose-500" />,
  "finances-investments": <DollarSign className="h-4 w-4 text-emerald-500" />,
  "learning-growth": <GraduationCap className="h-4 w-4 text-teal-500" />,
  "habits-health": <Activity className="h-4 w-4 text-orange-500" />,
  "systems-workflows": <Workflow className="h-4 w-4 text-cyan-500" />,
  "decisions-log": <Scale className="h-4 w-4 text-violet-500" />,
  templates: <FileCode className="h-4 w-4 text-fuchsia-500" />,
  archive: <Archive className="h-4 w-4 text-zinc-400" />,
};

export function getFolderLabel(folderKey: string, t: TranslationSchema): string {
  const folderLabelMap: Record<string, string> = {
    all: t.notesPage.allFolders,
    inbox: t.notesPage.folders.inbox,
    "business-strategy": t.notesPage.folders.businessStrategy,
    "freelance-clients": t.notesPage.folders.freelanceClients,
    "discord-bots": t.notesPage.folders.discordBots,
    "products-saas": t.notesPage.folders.productsSaas,
    "marriage-home": t.notesPage.folders.marriageHome,
    "finances-investments": t.notesPage.folders.financesInvestments,
    "learning-growth": t.notesPage.folders.learningGrowth,
    "habits-health": t.notesPage.folders.habitsHealth,
    "systems-workflows": t.notesPage.folders.systemsWorkflows,
    "decisions-log": t.notesPage.folders.decisionsLog,
    templates: t.notesPage.folders.templates,
    archive: t.notesPage.folders.archive,
  };
  return folderLabelMap[folderKey] || folderKey;
}

export function FolderSidebar({
  folderCounts,
  selectedFolder,
  onSelectFolder,
  totalActiveCount,
}: {
  folderCounts: FolderCount[];
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
  totalActiveCount: number;
}) {
  const { t } = useLocale();

  const countMap = folderCounts.reduce<Record<string, number>>((acc, item) => {
    acc[item.folder] = item.count;
    return acc;
  }, {});

  const foldersList = [
    "all",
    "inbox",
    "business-strategy",
    "freelance-clients",
    "discord-bots",
    "products-saas",
    "marriage-home",
    "finances-investments",
    "learning-growth",
    "habits-health",
    "systems-workflows",
    "decisions-log",
    "templates",
    "archive",
  ];

  return (
    <div className="p-3 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-1">
      <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
        {t.notesPage.folder}
      </div>

      <div className="space-y-0.5">
        {foldersList.map((folderKey) => {
          const isSelected = selectedFolder === folderKey;
          const icon = FOLDER_ICONS[folderKey] || <Box className="h-4 w-4" />;
          const label = getFolderLabel(folderKey, t);
          const count =
            folderKey === "all" ? totalActiveCount : countMap[folderKey] || 0;

          return (
            <button
              key={folderKey}
              onClick={() => onSelectFolder(folderKey)}
              className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 truncate">
                <span className={isSelected ? "brightness-200" : ""}>
                  {icon}
                </span>
                <span className="truncate">{label}</span>
              </div>

              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-zinc-800 dark:bg-zinc-200 text-zinc-200 dark:text-zinc-800"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
