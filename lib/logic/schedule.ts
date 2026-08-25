import type { TaskRow, ProjectRow, MarriageExpenseRow, RoutineRow } from "@/lib/supabase/types";
import type { RoutineItem } from "@/lib/schemas/routines";

export type CalendarViewMode = "day" | "week" | "month" | "year";

export interface ScheduleCollision {
  id: string;
  type: "friday_protection" | "deadline_clash" | "overload";
  date: string;
  title: string;
  descriptionAr: string;
  descriptionEn: string;
  severity: "critical" | "warning";
  relatedItems: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  kind: "task" | "project_deadline" | "marriage_payment" | "time_entry" | "routine";
  status?: string;
  priority?: string;
  amount?: number;
  durationMin?: number;
}

export function detectScheduleCollisions(params: {
  tasks: TaskRow[];
  projects: ProjectRow[];
  marriageExpenses: MarriageExpenseRow[];
  protectedOffDay?: string; // default "friday"
}): ScheduleCollision[] {
  const { tasks, projects, marriageExpenses, protectedOffDay = "friday" } = params;
  const collisions: ScheduleCollision[] = [];

  // Map dates to events
  const dateMap: Record<
    string,
    {
      tasks: TaskRow[];
      projects: ProjectRow[];
      marriageExpenses: MarriageExpenseRow[];
    }
  > = {};

  const ensureDate = (d: string) => {
    if (!dateMap[d]) {
      dateMap[d] = { tasks: [], projects: [], marriageExpenses: [] };
    }
  };

  for (const t of tasks) {
    const targetDate = t.scheduled_date || t.deadline;
    if (targetDate && t.status !== "done" && t.status !== "dropped") {
      ensureDate(targetDate);
      dateMap[targetDate].tasks.push(t);
    }
  }

  for (const p of projects) {
    if (p.deadline && p.status === "active") {
      ensureDate(p.deadline);
      dateMap[p.deadline].projects.push(p);
    }
  }

  for (const m of marriageExpenses) {
    if (m.deadline && m.status !== "paid" && m.status !== "dropped") {
      ensureDate(m.deadline);
      dateMap[m.deadline].marriageExpenses.push(m);
    }
  }

  // Evaluate collisions for each date
  for (const [dateStr, bucket] of Object.entries(dateMap)) {
    const d = new Date(dateStr);
    const dayOfWeek = d.getDay(); // 5 is Friday
    const isProtectedFriday = protectedOffDay === "friday" && dayOfWeek === 5;

    // 1. Friday Protection Check (§27, §81)
    if (isProtectedFriday && (bucket.tasks.length > 0 || bucket.projects.length > 0)) {
      const items = [
        ...bucket.tasks.map((t) => t.title),
        ...bucket.projects.map((p) => `تسليم مشروع: ${p.name}`),
      ];

      collisions.push({
        id: `col_friday_${dateStr}`,
        type: "friday_protection",
        date: dateStr,
        title: "تعارض مع يوم الإجازة والعلاقة المحمي (Protected Friday)",
        descriptionAr: `تم جدولة مهام أو تسليمات عمل في يوم الجمعة المحمي المخصص للأسرة والراحة.`,
        descriptionEn: `Work or project delivery scheduled on the protected Friday reserved for relationship and rest.`,
        severity: "critical",
        relatedItems: items,
      });
    }

    // 2. Multiple Major Deadlines Clash
    const criticalTasks = bucket.tasks.filter(
      (t) => t.priority === "critical" || t.priority === "high",
    );
    const totalDeliverables = criticalTasks.length + bucket.projects.length;

    if (totalDeliverables >= 3) {
      collisions.push({
        id: `col_clash_${dateStr}`,
        type: "deadline_clash",
        date: dateStr,
        title: "ضغط مواعيد تسليم متعددة في نفس اليوم",
        descriptionAr: `يوجد ${totalDeliverables} تسليمات ومهام حاسمة في نفس التاريخ (${dateStr})، مما يهدد بجودة التنفيذ.`,
        descriptionEn: `Multiple major deliverables (${totalDeliverables}) fall on the same date (${dateStr}), creating high execution pressure.`,
        severity: "warning",
        relatedItems: [
          ...bucket.projects.map((p) => `مشروع: ${p.name}`),
          ...criticalTasks.map((t) => `مهمة: ${t.title}`),
        ],
      });
    }

    // 3. Overloaded day (> 360 min / 6 hours)
    const totalMin = bucket.tasks.reduce((acc, t) => acc + (t.duration_min || 45), 0);
    if (totalMin > 360) {
      collisions.push({
        id: `col_overload_${dateStr}`,
        type: "overload",
        date: dateStr,
        title: "ساعات عمل مخططة تفوق السعة اليومية الصحية",
        descriptionAr: `إجمالي تقدير المهام لليوم يصل إلى ${Math.round(totalMin / 60)} ساعة عمل، وهو ما يتجاوز الحد اليومي المستدام.`,
        descriptionEn: `Total planned tasks reach ${Math.round(totalMin / 60)} hours, exceeding sustainable daily capacity.`,
        severity: "warning",
        relatedItems: bucket.tasks.map((t) => `${t.title} (${t.duration_min || 45} د)`),
      });
    }
  }

  return collisions;
}

export interface DayTimeBlock {
  id: string;
  timeSlot: string;
  title: string;
  subtitle?: string;
  kind:
    | "routine"
    | "task"
    | "project_deadline"
    | "marriage_payment"
    | "open_slot"
    | "protected_rest"
    | "focus_session";
  durationMin: number;
  isCompleted?: boolean;
}

export function generateDayTimeBlocks(params: {
  routines: RoutineRow[];
  tasks: TaskRow[];
  projects?: ProjectRow[];
  marriageExpenses?: MarriageExpenseRow[];
  dateStr: string;
}): DayTimeBlock[] {
  const { routines, tasks, projects = [], marriageExpenses = [], dateStr } = params;
  const blocks: DayTimeBlock[] = [];

  const d = new Date(dateStr);
  const isFriday = d.getDay() === 5;

  if (isFriday) {
    // Protected Friday Rhythm (§27, §81)
    blocks.push({
      id: "rt_friday_morning",
      timeSlot: "08:00 - 10:00",
      title: "صباح الجمعة الهادئ والاستعداد للصلاة",
      subtitle: "روتين استرخاء، إفطار، وقراءة سورة الكهف والصلاة",
      kind: "routine",
      durationMin: 120,
    });

    blocks.push({
      id: "rt_friday_family",
      timeSlot: "13:00 - 20:00",
      title: "يوم الأسرة والعلاقة والراحة المحمي ☕🌿",
      subtitle: "خروج، وقت نوعي مشترك، شحن الطاقة وتصفية الذهن بعيداً عن ضغط العمل",
      kind: "protected_rest",
      durationMin: 420,
    });

    blocks.push({
      id: "rt_friday_night",
      timeSlot: "22:00 - 23:30",
      title: "ختام الأسبوع والتهيئة لنوم هانئ",
      subtitle: "استرخاء بدون شاشات وتجهيز بداية الأسبوع الجديد",
      kind: "routine",
      durationMin: 90,
    });

    // If there were any scheduled tasks on Friday, show them with conflict badge
    if (tasks.length > 0) {
      for (const t of tasks) {
        blocks.push({
          id: `tk_fri_${t.id}`,
          timeSlot: "تعارض محمي",
          title: `[مهمة في يوم محمي]: ${t.title}`,
          subtitle: "يُنصح بإعادة جدولتها إلى يوم عمل",
          kind: "task",
          durationMin: t.duration_min || 60,
          isCompleted: t.status === "done",
        });
      }
    }

    return blocks;
  }

  // Regular Day Rhythm

  // 1. Morning routine (07:00)
  const morning = routines.find((r) => r.time_of_day === "morning");
  if (morning) {
    const items: RoutineItem[] = Array.isArray(morning.items)
      ? (morning.items as unknown as RoutineItem[])
      : [];
    const mins = items.reduce((acc, it) => acc + (it.duration_min || 10), 0);
    blocks.push({
      id: "rt_morning",
      timeSlot: "07:00 - 08:30",
      title: morning.name,
      subtitle: `${items.length} خطوات صباحية`,
      kind: "routine",
      durationMin: mins || 60,
    });
  }

  // 2. Deliverables & Deadlines
  for (const p of projects) {
    blocks.push({
      id: `prj_${p.id}`,
      timeSlot: "موعد تسليم",
      title: `تسليم مشروع: ${p.name}`,
      subtitle: p.budget ? `الميزانية: ${p.budget.toLocaleString()} ج.م` : undefined,
      kind: "project_deadline",
      durationMin: 60,
    });
  }

  for (const m of marriageExpenses) {
    const remaining = Math.max(0, (m.actual_cost || m.estimated_cost) - m.paid_amount);
    blocks.push({
      id: `marr_${m.id}`,
      timeSlot: "دفعة مستحقة",
      title: `قسط زواج: ${m.item}`,
      subtitle: `المتبقي للسداد: ${remaining.toLocaleString()} ج.م`,
      kind: "marriage_payment",
      durationMin: 30,
    });
  }

  // 3. Workday tasks (09:00 - 17:00)
  if (tasks.length > 0) {
    let currentHour = 9;
    for (const t of tasks) {
      const dur = t.duration_min || 60;
      const startStr = `${String(currentHour).padStart(2, "0")}:00`;
      currentHour += Math.ceil(dur / 60);
      const endStr = `${String(currentHour).padStart(2, "0")}:00`;

      blocks.push({
        id: `tk_${t.id}`,
        timeSlot: `${startStr} - ${endStr}`,
        title: t.title,
        subtitle: t.task_type ? `نوع المهمة: ${t.task_type}` : undefined,
        kind: "task",
        durationMin: dur,
        isCompleted: t.status === "done",
      });
    }
  } else {
    // Open Slot
    blocks.push({
      id: "open_work_slot",
      timeSlot: "09:00 - 17:00",
      title: "ساعات عمل مرنة ومفتوحة",
      subtitle: "لا توجد مهام محددة مجدولة لهذا اليوم (فترة حرة للعمل العميق أو مهام الـ Backlog).",
      kind: "open_slot",
      durationMin: 480,
    });
  }

  // 4. Evening routine (19:00)
  const evening = routines.find((r) => r.time_of_day === "evening");
  if (evening) {
    const items: RoutineItem[] = Array.isArray(evening.items)
      ? (evening.items as unknown as RoutineItem[])
      : [];
    const mins = items.reduce((acc, it) => acc + (it.duration_min || 10), 0);
    blocks.push({
      id: "rt_evening",
      timeSlot: "19:00 - 20:00",
      title: evening.name,
      subtitle: `${items.length} خطوات إغلاق ومساء`,
      kind: "routine",
      durationMin: mins || 60,
    });
  }

  // 5. Night routine (22:30)
  const night = routines.find((r) => r.time_of_day === "night");
  if (night) {
    const items: RoutineItem[] = Array.isArray(night.items)
      ? (night.items as unknown as RoutineItem[])
      : [];
    const mins = items.reduce((acc, it) => acc + (it.duration_min || 10), 0);
    blocks.push({
      id: "rt_night",
      timeSlot: "22:30 - 23:30",
      title: night.name,
      subtitle: "التهيئة للنوم وإيقاف الشاشات",
      kind: "routine",
      durationMin: mins || 45,
    });
  }

  return blocks;
}
