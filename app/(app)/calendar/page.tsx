import { getCalendarData } from "@/lib/dal/calendar";
import { CalendarView } from "@/components/calendar/calendar-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "التقويم والجدول الزمني المحمي | ANTIDOTE",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const data = await getCalendarData(date);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <CalendarView data={data} />
    </div>
  );
}
