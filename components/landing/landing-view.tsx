"use client";

import { LandingNavbar } from "./landing-navbar";
import { LandingHero } from "./landing-hero";
import { LandingBento } from "./landing-bento";
import { LandingAgentShowcase } from "./landing-agent-showcase";
import { LandingManifesto } from "./landing-manifesto";
import { LandingCtaFooter } from "./landing-cta-footer";

export function LandingView({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-indigo-500 selection:text-white transition-colors">
      <LandingNavbar isAuthenticated={isAuthenticated} />
      <main>
        <LandingHero isAuthenticated={isAuthenticated} />
        <LandingBento />
        <LandingAgentShowcase />
        <LandingManifesto />
        <LandingCtaFooter isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
}
