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
  Flame,
  RotateCcw,
  BarChart3,
  Settings,
  Scale,
  TrendingUp,
  Bot,
  BookOpen,
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

  const navSections = [
    {
      title: t.nav.command,
      items: [
        { label: t.nav.home, href: "/home", icon: LayoutDashboard },
        { label: t.nav.today, href: "/today", icon: Sun },
        { label: t.nav.tasks, href: "/tasks", icon: CheckSquare },
        { label: t.nav.goals, href: "/goals", icon: Target },
        { label: t.nav.calendar, href: "/calendar", icon: Calendar },
        { label: t.nav.decisions, href: "/decisions", icon: Scale },
        { label: t.nav.agent, href: "/agent", icon: Bot },
        { label: t.nav.guide, href: "/guide", icon: BookOpen },
      ],
    },
    {
      title: t.nav.revenueWork,
      items: [
        { label: t.nav.freelance, href: "/freelance", icon: Briefcase },
        { label: t.nav.clients, href: "/clients", icon: Users },
        { label: t.nav.projects, href: "/projects", icon: FolderKanban },
        { label: t.nav.finances, href: "/finances", icon: Wallet },
        {
          label: t.nav.opportunities,
          href: "/opportunities",
          icon: TrendingUp,
        },
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
        { label: t.nav.habits, href: "/habits", icon: Flame },
        { label: t.nav.routines, href: "/routines", icon: RotateCcw },
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
          "fixed start-0 top-0 bottom-0 z-40 flex w-64 flex-col border-e border-zinc-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-900",
          "lg:static lg:translate-x-0 lg:transform-none lg:ltr:translate-x-0 lg:rtl:translate-x-0",
          isOpen
            ? "translate-x-0 rtl:translate-x-0"
            : "-translate-x-full lg:translate-x-0 rtl:translate-x-full lg:rtl:translate-x-0",
        )}
      >
        {/* Branding Header */}
        <div className="flex h-16 items-center gap-3 border-b border-zinc-100 px-6 dark:border-zinc-800/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-base font-extrabold text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
            L
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              ANTIDOTE
            </div>
            <div className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
              Command Center
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
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
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-zinc-100 font-semibold text-zinc-900 shadow-2xs dark:bg-zinc-800 dark:text-zinc-50"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200",
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
        <div className="border-t border-zinc-100 p-4 text-center dark:border-zinc-800">
          <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            Made with ❤️ by{" "}
            <Link
              href="https://razook.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-900 underline underline-offset-2 dark:text-zinc-50"
            >
              Razook
            </Link>
          </p>
        </div>
      </aside>
    </>
  );
}
