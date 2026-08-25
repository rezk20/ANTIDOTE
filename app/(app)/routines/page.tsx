import { getRoutines } from "@/lib/dal/routines";
import { RoutinesView } from "@/components/routines/routines-view";

export const metadata = {
  title: "الروتين اليومي | ANTIDOTE",
};

export default async function RoutinesPage() {
  const routines = await getRoutines();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <RoutinesView routines={routines} />
    </div>
  );
}
