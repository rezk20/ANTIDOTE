import { Wallet } from "lucide-react";
import { PhasePlaceholder } from "@/components/ui/phase-placeholder";

export const dynamic = "force-dynamic";

export default function FinancesPage() {
  return (
    <PhasePlaceholder
      title="Financial Engine & Wallets"
      description="Income and expense transactions, marriage savings calculation (250k gap), computed bucket balances, and monthly targets."
      phase="5"
      icon={<Wallet className="h-6 w-6 text-emerald-500" />}
      scheduledText="The Financial Engine and wallet math will be delivered in Phase 5."
    />
  );
}
