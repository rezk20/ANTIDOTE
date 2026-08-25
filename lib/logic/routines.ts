import type { RoutineItem } from "@/lib/schemas/routines";

export interface RoutineTemplateSeed {
  name: string;
  time_of_day: "morning" | "workday" | "evening" | "night";
  sort_order: number;
  items: RoutineItem[];
}

export const DEFAULT_ROUTINES_SEED: RoutineTemplateSeed[] = [
  {
    name: "روتين الصباح وبداية اليوم (Morning)",
    time_of_day: "morning",
    sort_order: 1,
    items: [
      { id: "m1", title: "الاستيقاظ بدون تأجيل المنبه", duration_min: 5, is_active: true },
      { id: "m2", title: "شرب كوب ماء كبير وترطيب الجسم", duration_min: 5, is_active: true },
      { id: "m3", title: "العناية الشخصية والوضوء والصلاة / وقت الصفاء", duration_min: 20, is_active: true },
      { id: "m4", title: "إفطار خفيف ومشروب الطاقة المفضل", duration_min: 15, is_active: true },
      { id: "m5", title: "مراجعة خطة اليوم وتحديد جلسة التركيز الأولى", duration_min: 10, is_active: true },
    ],
  },
  {
    name: "روتين يوم وساعات العمل (Workday)",
    time_of_day: "workday",
    sort_order: 2,
    items: [
      { id: "w1", title: "جلسة العمل العميق الأولى (Primary Work)", duration_min: 90, is_active: true },
      { id: "w2", title: "استراحة قصيرة وفصل العينين عن الشاشة", duration_min: 15, is_active: true },
      { id: "w3", title: "إجراء مبيعات أو تواصل مع العملاء (Sales Action)", duration_min: 30, is_active: true },
      { id: "w4", title: "جلسة عمل فرعية وتسليم المتطلبات", duration_min: 60, is_active: true },
    ],
  },
  {
    name: "روتين المساء والإغلاق (Evening)",
    time_of_day: "evening",
    sort_order: 3,
    items: [
      { id: "e1", title: "طقس إغلاق اليوم ومراجعة المنجز (Shutdown Ritual)", duration_min: 15, is_active: true },
      { id: "e2", title: "وقت عائلي ومع شريكة الحياة (Relationship Time)", duration_min: 45, is_active: true },
      { id: "e3", title: "قراءة خفيفة أو بودكاست ملهم", duration_min: 20, is_active: true },
      { id: "e4", title: "ترتيب مساحة العمل وتجهيز مهام الغد", duration_min: 10, is_active: true },
    ],
  },
  {
    name: "روتين الاستعداد للنوم (Night)",
    time_of_day: "night",
    sort_order: 4,
    items: [
      { id: "n1", title: "إيقاف الشاشات وتفعيل الوضع الليلي", duration_min: 15, is_active: true },
      { id: "n2", title: "العناية الشخصية المسائية والتهيئة للنوم", duration_min: 15, is_active: true },
      { id: "n3", title: "أذكار النوم وصفاء الذهن", duration_min: 10, is_active: true },
    ],
  },
];
