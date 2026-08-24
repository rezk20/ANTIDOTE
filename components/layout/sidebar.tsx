"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sun,
  Calendar,
  CheckSquare,
  Target,
  Briefcase,
  Users,
  FolderKanban,
  Wallet,
  Sparkles,
  FileText,
  Clock,
  Heart,
  Users2,
  BarChart3,
  Settings,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLocale } from "@/components/providers/locale-provider";

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLocale();

  function triggerQuickCapture() {
    window.dispatchEvent(new CustomEvent("open-quick-capture"));
    onClose?.();
  }

  const navSections = [
    {
      title: t.nav.command,
      items: [
        { label: t.nav.today, href: "/home", icon: LayoutDashboard },
        { label: t.nav.today, href: "/today", icon: Sun },
        { label: t.nav.tasks, href: "/tasks", icon: CheckSquare },
        { label: t.nav.goals, href: "/goals", icon: Target },
        { label: t.nav.calendar, href: "/calendar", icon: Calendar },
      ],
    },
    {
      title: t.nav.revenueWork,
      items: [
        { label: t.nav.freelance, href: "/freelance", icon: Briefcase },
        { label: t.nav.clients, href: "/clients", icon: Users },
        { label: t.nav.projects, href: "/projects", icon: FolderKanban },
        { label: t.nav.finances, href: "/finances", icon: Wallet },
      ],
    },
    {
      title: t.nav.knowledgeGrowth,
      items: [
        { label: t.nav.brainDump, href: "/brain-dump", icon: Sparkles },
        { label: t.nav.notes, href: "/notes", icon: FileText },
        { label: t.nav.reviews, href: "/reviews", icon: Clock },
      ],
    },
    {
      title: t.nav.lifeMission,
      items: [
        { label: t.nav.marriage, href: "/marriage", icon: Heart },
        { label: t.nav.relationship, href: "/relationship", icon: Users2 },
        { label: t.nav.analytics, href: "/analytics", icon: BarChart3 },
        { label: t.nav.settings, href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 start-0 z-40 flex flex-col w-64 border-e border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-transform duration-200",
          "lg:static lg:translate-x-0 lg:rtl:translate-x-0 lg:ltr:translate-x-0 lg:transform-none",
          isOpen
            ? "translate-x-0 rtl:translate-x-0"
            : "-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0",
        )}
      >
        {/* Branding Header */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-extrabold flex items-center justify-center text-base shadow-sm">
            L
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">
              LIFE OS
            </div>
            <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
              Command Center
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={triggerQuickCapture}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t.nav.capture}</span>
            <kbd className="ms-auto px-1.5 py-0.5 rounded bg-zinc-800 dark:bg-zinc-200 text-zinc-300 dark:text-zinc-700 text-[10px] font-mono">
              B
            </kbd>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {section.title}
              </p>
              <div className="space-y-0.5 pt-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/home" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                        isActive
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold shadow-2xs"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-400 dark:text-zinc-500",
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
            LIFE OS v0.1 • Phase 3 Ready
          </p>
        </div>
      </aside>
    </>
  );
}
