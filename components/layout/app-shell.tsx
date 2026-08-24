"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { QuickCaptureModal } from "@/components/capture/quick-capture-modal";
import type { ProfileRow } from "@/lib/supabase/types";

export function AppShell({
  profile,
  children,
}: {
  profile: ProfileRow | null;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          profile={profile}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Quick Capture Modal */}
      <QuickCaptureModal />
    </div>
  );
}
