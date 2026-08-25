export interface CapacityAdvice {
  capacity: "light" | "normal" | "high";
  maxCoreTasks: number;
  messageAr: string;
  messageEn: string;
}

export function evaluateCapacityAdvice(params: {
  energy?: number | null;
  sleepHours?: number | null;
}): CapacityAdvice {
  const { energy, sleepHours } = params;

  if ((energy != null && energy <= 2) || (sleepHours != null && sleepHours < 5.5)) {
    return {
      capacity: "light",
      maxCoreTasks: 1,
      messageAr: "مستوى الطاقة أو ساعات النوم منخفضة اليوم — يُنصح بالتركيز على مهمة حاسمة واحدة فقط وتخفيف الضغط.",
      messageEn: "Low energy or sleep detected — recommend focusing on a single critical task and protecting energy.",
    };
  }

  if ((energy != null && energy >= 4) && (sleepHours == null || sleepHours >= 6.5)) {
    return {
      capacity: "high",
      maxCoreTasks: 3,
      messageAr: "مستوى الطاقة ممتاز وجاهزية عالية — يوم مثالي لإنجاز جلسات عمل عميق ومهام كبرى!",
      messageEn: "High energy level — great day for deep work sessions and high-priority deliverables!",
    };
  }

  return {
    capacity: "normal",
    maxCoreTasks: 2,
    messageAr: "مستوى طاقة متوازن — حافظ على وتيرة عمل ثابتة مع فترات راحة منتظمة.",
    messageEn: "Balanced energy — maintain steady momentum with regular recovery intervals.",
  };
}
