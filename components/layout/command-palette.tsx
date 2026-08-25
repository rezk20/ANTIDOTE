"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useLocale } from "@/components/providers/locale-provider";
import { logout } from "@/lib/actions/auth";
import {
  Search,
  X,
  Sparkles,
  Sun,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  CheckSquare,
  Target,
  Scale,
  TrendingUp,
  Bot,
  Heart,
  Users2,
  Briefcase,
  Users,
  FolderKanban,
  Wallet,
  Inbox,
  FileText,
  Flame,
  Clock,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  group: "navigation" | "actions";
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale, isRtl } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keydown handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // 1. Open on Ctrl+K / Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // 2. Close on Escape
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      // 3. Single key shortcuts when not typing
      if (!isInput && !e.metaKey && !e.ctrlKey && !e.altKey && !isOpen) {
        const key = e.key.toLowerCase();
        if (key === "t") {
          e.preventDefault();
          router.push("/today");
        } else if (key === "d") {
          e.preventDefault();
          router.push("/decisions");
        } else if (key === "o") {
          e.preventDefault();
          router.push("/opportunities");
        } else if (key === "g") {
          e.preventDefault();
          router.push("/goals");
        } else if (key === "?") {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent("open-shortcuts-modal"));
        }
      }
    }

    function handleCustomOpen() {
      setSearch("");
      setSelectedIndex(0);
      setIsOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen, router]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const items: PaletteItem[] = useMemo(() => {
    const navigate = (href: string) => {
      setIsOpen(false);
      router.push(href);
    };

    return [
      // Navigation
      {
        id: "nav-today",
        title: t.nav.today,
        subtitle: isRtl ? "خطة اليوم والتنفيذ" : "Daily plan & execution",
        icon: Sun,
        group: "navigation",
        shortcut: "T",
        action: () => navigate("/today"),
      },
      {
        id: "nav-home",
        title: t.nav.home,
        subtitle: isRtl ? "لوحة القيادة الرئيسية" : "Executive dashboard",
        icon: LayoutDashboard,
        group: "navigation",
        action: () => navigate("/home"),
      },
      {
        id: "nav-decisions",
        title: t.nav.decisions,
        subtitle: isRtl ? "غرفة ميزان القرارات (§34)" : "Decision Desk & reversibility",
        icon: Scale,
        group: "navigation",
        shortcut: "D",
        action: () => navigate("/decisions"),
      },
      {
        id: "nav-opportunities",
        title: t.nav.opportunities,
        subtitle: isRtl ? "محرك ترتيب الفرص (§50)" : "Opportunity prioritization engine",
        icon: TrendingUp,
        group: "navigation",
        shortcut: "O",
        action: () => navigate("/opportunities"),
      },
      {
        id: "nav-agent",
        title: t.nav.agent,
        subtitle: isRtl ? "جسر الوكيل الذكي Hermes" : "Hermes AI Agent integration & API",
        icon: Bot,
        group: "navigation",
        action: () => navigate("/agent"),
      },
      {
        id: "nav-tasks",
        title: t.nav.tasks,
        subtitle: isRtl ? "قائمة المهام والأولويات" : "Task prioritization & backlog",
        icon: CheckSquare,
        group: "navigation",
        action: () => navigate("/tasks"),
      },
      {
        id: "nav-goals",
        title: t.nav.goals,
        subtitle: isRtl ? "شجرة الأهداف الاستراتيجية" : "Strategic goals hierarchy",
        icon: Target,
        group: "navigation",
        shortcut: "G",
        action: () => navigate("/goals"),
      },
      {
        id: "nav-marriage",
        title: t.nav.marriage,
        subtitle: isRtl ? "هدف الزواج والـ 250 ألف" : "Marriage fund 250k tracker",
        icon: Heart,
        group: "navigation",
        action: () => navigate("/marriage"),
      },
      {
        id: "nav-relationship",
        title: t.nav.relationship,
        subtitle: isRtl ? "سجل العلاقة والأفكار" : "Relationship ideas & check-ins",
        icon: Users2,
        group: "navigation",
        action: () => navigate("/relationship"),
      },
      {
        id: "nav-freelance",
        title: t.nav.freelance,
        subtitle: isRtl ? "مسار الفريلانس والعملاء" : "Freelance acquisition pipeline",
        icon: Briefcase,
        group: "navigation",
        action: () => navigate("/freelance"),
      },
      {
        id: "nav-clients",
        title: t.nav.clients,
        subtitle: isRtl ? "دليل العملاء" : "Clients CRM",
        icon: Users,
        group: "navigation",
        action: () => navigate("/clients"),
      },
      {
        id: "nav-projects",
        title: t.nav.projects,
        subtitle: isRtl ? "مركز إدارة المشاريع" : "Active projects hub",
        icon: FolderKanban,
        group: "navigation",
        action: () => navigate("/projects"),
      },
      {
        id: "nav-finances",
        title: t.nav.finances,
        subtitle: isRtl ? "المالية والمحافظ والحسابات" : "Cashflow, buckets & transactions",
        icon: Wallet,
        group: "navigation",
        action: () => navigate("/finances"),
      },
      {
        id: "nav-braindump",
        title: t.nav.brainDump,
        subtitle: isRtl ? "صندوق تفريغ الأفكار" : "Brain dump inbox triage",
        icon: Inbox,
        group: "navigation",
        action: () => navigate("/brain-dump"),
      },
      {
        id: "nav-notes",
        title: t.nav.notes,
        subtitle: isRtl ? "الملاحظات والمعرفة" : "Markdown knowledge base",
        icon: FileText,
        group: "navigation",
        action: () => navigate("/notes"),
      },
      {
        id: "nav-habits",
        title: t.nav.habits,
        subtitle: isRtl ? "العادات وسلاسل الاستمرارية" : "Habit tracking & streaks",
        icon: Flame,
        group: "navigation",
        action: () => navigate("/habits"),
      },
      {
        id: "nav-routines",
        title: t.nav.routines,
        subtitle: isRtl ? "الروتين اليومي" : "Daily routines stack",
        icon: Clock,
        group: "navigation",
        action: () => navigate("/routines"),
      },
      {
        id: "nav-calendar",
        title: t.nav.calendar,
        subtitle: isRtl ? "التقويم والكتل الزمنية" : "Rhythm & time blocking calendar",
        icon: Calendar,
        group: "navigation",
        action: () => navigate("/calendar"),
      },
      {
        id: "nav-analytics",
        title: t.nav.analytics,
        subtitle: isRtl ? "التحليلات والرؤى الاستراتيجية" : "System intelligence & analytics",
        icon: BarChart3,
        group: "navigation",
        action: () => navigate("/analytics"),
      },
      {
        id: "nav-settings",
        title: t.nav.settings,
        subtitle: isRtl ? "إعدادات الحساب والمظهر" : "User profile & targets",
        icon: Settings,
        group: "navigation",
        action: () => navigate("/settings"),
      },

      // Actions
      {
        id: "act-capture",
        title: t.commandPalette.quickCapture,
        subtitle: t.commandPalette.quickCaptureDesc,
        icon: Sparkles,
        group: "actions",
        shortcut: "B",
        action: () => {
          setIsOpen(false);
          window.dispatchEvent(new CustomEvent("open-quick-capture"));
        },
      },
      {
        id: "act-theme",
        title: t.commandPalette.toggleTheme,
        subtitle: t.commandPalette.toggleThemeDesc,
        icon: theme === "dark" ? Sun : Moon,
        group: "actions",
        action: () => {
          setTheme(theme === "dark" ? "light" : "dark");
          setIsOpen(false);
        },
      },
      {
        id: "act-lang",
        title: t.commandPalette.toggleLanguage,
        subtitle: t.commandPalette.toggleLanguageDesc,
        icon: Globe,
        group: "actions",
        action: () => {
          setLocale(locale === "ar" ? "en" : "ar");
          setIsOpen(false);
        },
      },
      {
        id: "act-shortcuts",
        title: t.commandPalette.shortcutsHelp,
        subtitle: t.commandPalette.shortcutsHelpDesc,
        icon: HelpCircle,
        group: "actions",
        shortcut: "?",
        action: () => {
          setIsOpen(false);
          window.dispatchEvent(new CustomEvent("open-shortcuts-modal"));
        },
      },
      {
        id: "act-logout",
        title: t.commandPalette.signOut,
        subtitle: t.commandPalette.signOutDesc,
        icon: LogOut,
        group: "actions",
        action: async () => {
          setIsOpen(false);
          await logout();
        },
      },
    ];
  }, [t, isRtl, router, theme, setTheme, locale, setLocale]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q),
    );
  }, [items, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[80vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.commandPalette.placeholder}
            className="flex-1 bg-transparent text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px] font-bold text-zinc-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400 font-medium">
              {t.commandPalette.noResults}
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected
                          ? "bg-white/10 dark:bg-zinc-900/10 text-white dark:text-zinc-900"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate">{item.title}</div>
                      {item.subtitle && (
                        <div
                          className={`text-[11px] truncate ${
                            isSelected
                              ? "text-white/70 dark:text-zinc-700"
                              : "text-zinc-400 dark:text-zinc-500"
                          }`}
                        >
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.shortcut && (
                    <kbd
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shrink-0 ml-2 ${
                        isSelected
                          ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {item.shortcut}
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>•</span>
            <span>↵ Select</span>
            <span>•</span>
            <span>ESC Close</span>
          </div>
          <span className="font-bold">ANTIDOTE OS</span>
        </div>
      </div>
    </div>
  );
}
