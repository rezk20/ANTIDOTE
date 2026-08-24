import { BarChart3 } from "lucide-react";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  return (
    <PhasePlaceholder
      title="Analytics & Forecast Scenarios"
      description="Funnel conversions from lead_events, effective hourly rates, productivity audits, and 3-scenario forecasts."
      phase="13"
      icon={<BarChart3 className="h-6 w-6 text-emerald-500" />}
      scheduledText="Advanced Analytics and 3-scenario forecasting will be delivered in Phase 13."
    />
  );
}
