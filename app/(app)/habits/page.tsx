import { getHabitsWithLogs } from "@/lib/dal/habits";
import { HabitsView } from "@/components/habits/habits-view";

export const metadata = {
  title: "العادات والاستمرارية | ANTIDOTE",
};

export default async function HabitsPage() {
  const todayDate = new Date().toISOString().slice(0, 10);
  
  // 7 days window (last 6 days + today)
  const weekDates: string[] = [];
  const base = new Date(todayDate);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    weekDates.push(d.toISOString().slice(0, 10));
  }

  const habits = await getHabitsWithLogs({ weekDates, todayDate });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <HabitsView
        habits={habits}
        weekDates={weekDates}
        todayDate={todayDate}
      />
    </div>
  );
}
