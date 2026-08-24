export type Locale = "en" | "ar";

export interface TranslationSchema {
  nav: {
    command: string;
    revenueWork: string;
    knowledgeGrowth: string;
    lifeMission: string;
    today: string;
    tasks: string;
    goals: string;
    freelance: string;
    clients: string;
    projects: string;
    finances: string;
    brainDump: string;
    notes: string;
    reviews: string;
    marriage: string;
    relationship: string;
    calendar: string;
    analytics: string;
    settings: string;
    logout: string;
    capture: string;
  };
  common: {
    save: string;
    saving: string;
    cancel: string;
    close: string;
    create: string;
    edit: string;
    delete: string;
    filter: string;
    search: string;
    active: string;
    all: string;
    backlog: string;
    planned: string;
    inProgress: string;
    done: string;
    completed: string;
    doToday: string;
    tomorrow: string;
    confirmDelete: string;
    safeDeleteNotice: string;
    actions: string;
    status: string;
    ready: string;
    viewDetails: string;
    details: string;
    noNotes: string;
    copy: string;
    copied: string;
  };
  tasks: {
    title: string;
    subtitle: string;
    actionItems: string;
    newTask: string;
    editTask: string;
    taskTitle: string;
    taskTitlePlaceholder: string;
    classification: string;
    revenueType: string;
    productType: string;
    clientType: string;
    priorityTier: string;
    critical: string;
    high: string;
    medium: string;
    low: string;
    impactWeights: string;
    revenueImpact: string;
    strategicImpact: string;
    urgency: string;
    effort: string;
    scheduledDate: string;
    deadline: string;
    topThree: string;
    markTopThree: string;
    linkedGoal: string;
    linkedProject: string;
    recurringRule: string;
    notes: string;
    staleTitle: string;
    staleDesc: string;
    noTasksTitle: string;
    noTasksDesc: string;
    taskDetails: string;
    scoreBreakdown: string;
  };
  goals: {
    title: string;
    subtitle: string;
    newGoal: string;
    editGoal: string;
    goalTitle: string;
    goalTitlePlaceholder: string;
    level: string;
    parentGoal: string;
    targetValue: string;
    unit: string;
    description: string;
    addChild: string;
    noGoalsTitle: string;
    noGoalsDesc: string;
    goalDetails: string;
  };
  leads: {
    title: string;
    subtitle: string;
    newLead: string;
    editLead: string;
    leadTitle: string;
    leadTitlePlaceholder: string;
    source: string;
    url: string;
    stage: string;
    expectedValue: string;
    probability: string;
    proposalAmount: string;
    proposalNotes: string;
    followUpDate: string;
    lostReason: string;
    notes: string;
    pipelineValue: string;
    weightedValue: string;
    salesTargets: string;
    weeklyProposals: string;
    dailyOutreach: string;
    followUpQueue: string;
    noFollowUps: string;
    logTouch: string;
    convertToClient: string;
    recordPayment: string;
    moveStage: string;
    timeline: string;
    noLeadsTitle: string;
    noLeadsDesc: string;
    leadDetails: string;
  };
  clients: {
    title: string;
    subtitle: string;
    newClient: string;
    editClient: string;
    clientName: string;
    company: string;
    contact: string;
    source: string;
    paymentStatus: string;
    nextAction: string;
    followUpDate: string;
    notes: string;
    linkedProjects: string;
    noClientsTitle: string;
    noClientsDesc: string;
    clientDetails: string;
    contacts: string;
    addContact: string;
    channel: string;
    channelValue: string;
    scheduledActions: string;
    addAction: string;
    actionText: string;
    actionDate: string;
    noProjectsLinked: string;
  };
  projects: {
    title: string;
    subtitle: string;
    newProject: string;
    editProject: string;
    projectName: string;
    projectKind: string;
    budget: string;
    deadline: string;
    startedOn: string;
    client: string;
    brief: string;
    requirements: string;
    noProjectsTitle: string;
    noProjectsDesc: string;
    projectDetails: string;
    linkedTasks: string;
  };
  finances: {
    title: string;
    subtitle: string;
    overviewTab: string;
    transactionsTab: string;
    walletsTab: string;
    marriageTab: string;
    totalIncome: string;
    totalExpenses: string;
    netSavings: string;
    savingsRate: string;
    wallets: string;
    newWallet: string;
    editWallet: string;
    walletName: string;
    walletKind: string;
    startingBalance: string;
    targetAmount: string;
    currentBalance: string;
    netChange: string;
    transactions: string;
    newTransaction: string;
    editTransaction: string;
    amount: string;
    transactionKind: string;
    income: string;
    expense: string;
    category: string;
    date: string;
    source: string;
    note: string;
    wallet: string;
    selectWallet: string;
    noWallet: string;
    linkedProject: string;
    linkedLead: string;
    isRecurring: string;
    month: string;
    allCategories: string;
    allKinds: string;
    noTransactionsTitle: string;
    noTransactionsDesc: string;
    noWalletsTitle: string;
    noWalletsDesc: string;
    transactionDetails: string;
    walletDetails: string;
    incomeTargets: string;
    minIncome: string;
    comfortIncome: string;
    stretchIncome: string;
    marriageGoal: string;
    marriageProgress: string;
    targetGap: string;
    requiredMonthly: string;
    requiredWeekly: string;
    requiredDaily: string;
    monthsRemaining: string;
    goalCompleted: string;
  };
  marriageExpenses: {
    title: string;
    subtitle: string;
    newExpense: string;
    editExpense: string;
    item: string;
    category: string;
    estimatedCost: string;
    actualCost: string;
    paidAmount: string;
    remaining: string;
    deadline: string;
    priority: string;
    status: string;
    notes: string;
    totalBudget: string;
    totalPaid: string;
    recordPayment: string;
    paymentAmount: string;
    noExpensesTitle: string;
    noExpensesDesc: string;
    expenseDetails: string;
  };
  capture: {
    title: string;
    placeholder: string;
    hint: string;
    submit: string;
    inboxTitle: string;
    inboxSubtitle: string;
    noDumpsTitle: string;
    noDumpsDesc: string;
  };
  settings: {
    title: string;
    subtitle: string;
    tabs: {
      personal: string;
      marriage: string;
      work: string;
      privacy: string;
    };
    displayName: string;
    timezone: string;
    currency: string;
    weeklyOffDay: string;
    workHoursPerDay: string;
    preferredStartTime: string;
    marriageTargetAmount: string;
    marriageTargetMonths: string;
    marriageFallbackMonths: string;
    housingStrategy: string;
    primaryStream: string;
    secondaryStream: string;
    proposalsPerWeek: string;
    outreachPerDay: string;
    sharedDay: string;
    defaultBudget: string;
    aiEnabled: string;
    aiPrivacy: string;
    savedSuccess: string;
  };
  auth: {
    welcome: string;
    subtitle: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
  };
}

export const TRANSLATIONS: Record<Locale, TranslationSchema> = {
  en: {
    nav: {
      command: "Command Center",
      revenueWork: "Revenue & Work",
      knowledgeGrowth: "Knowledge & Growth",
      lifeMission: "Life & Mission",
      today: "Today's Plan",
      tasks: "Tasks & Priorities",
      goals: "Goals Hierarchy",
      freelance: "Freelance Pipeline",
      clients: "Clients Directory",
      projects: "Projects Hub",
      finances: "Finances & Wallets",
      brainDump: "Brain Dump Inbox",
      notes: "Knowledge Notes",
      reviews: "Weekly Reviews",
      marriage: "Marriage Mission",
      relationship: "Relationship",
      calendar: "Rhythm & Calendar",
      analytics: "System Analytics",
      settings: "Settings",
      logout: "Sign Out",
      capture: "Quick Capture",
    },
    common: {
      save: "Save Changes",
      saving: "Saving...",
      cancel: "Cancel",
      close: "Close",
      create: "Create",
      edit: "Edit",
      delete: "Delete",
      filter: "Filter",
      search: "Search...",
      active: "Active",
      all: "All",
      backlog: "Backlog",
      planned: "Planned",
      inProgress: "In Progress",
      done: "Completed",
      completed: "Completed",
      doToday: "Do Today",
      tomorrow: "Tomorrow",
      confirmDelete: "Are you sure you want to delete this?",
      safeDeleteNotice: "Linked items will remain safe.",
      actions: "Actions",
      status: "Status",
      ready: "Operational",
      viewDetails: "View Full Details",
      details: "Details & Notes",
      noNotes: "No additional notes or description provided.",
      copy: "Copy",
      copied: "Copied!",
    },
    tasks: {
      title: "Task Engine & Priorities",
      subtitle: "Daily execution command: Multi-factor priority scoring, Build vs Revenue work tracking, and stale task guards.",
      actionItems: "Action Items",
      newTask: "New Task",
      editTask: "Edit Task",
      taskTitle: "Task Title",
      taskTitlePlaceholder: "e.g. Send proposal to client / Build Next.js feature",
      classification: "Classification (Build vs. Revenue)",
      revenueType: "💰 Revenue (Direct Income)",
      productType: "🔨 Product (Build Asset)",
      clientType: "👥 Client Delivery",
      priorityTier: "Priority Tier",
      critical: "CRITICAL",
      high: "HIGH",
      medium: "MEDIUM",
      low: "LOW",
      impactWeights: "Priority Algorithm Weights (0 - 5)",
      revenueImpact: "Revenue Impact (3x)",
      strategicImpact: "Strategic Impact (2x)",
      urgency: "Urgency (2x)",
      effort: "Effort (-1x)",
      scheduledDate: "Scheduled Date",
      deadline: "Deadline",
      topThree: "Top 3 Focus",
      markTopThree: "Mark as Top 3 Priority Focus",
      linkedGoal: "Linked Goal",
      linkedProject: "Linked Project",
      recurringRule: "Recurring Rule",
      notes: "Notes & Subtasks",
      staleTitle: "Stale Tasks Awaiting Resolution",
      staleDesc: "These active tasks have not been touched for over 3 days. Decide whether to do them today, reschedule, or clear them out.",
      noTasksTitle: "No Tasks Found",
      noTasksDesc: "Clear your head by adding a new revenue or build task.",
      taskDetails: "Task Intelligence Dossier",
      scoreBreakdown: "Priority Algorithm Score Breakdown",
    },
    goals: {
      title: "Goals & Transformation Hierarchy",
      subtitle: "Connect long-term vision to 10-year targets, annual objectives, quarterly milestones, and weekly action items.",
      newGoal: "New Top-Level Goal",
      editGoal: "Edit Goal",
      goalTitle: "Goal Title",
      goalTitlePlaceholder: "e.g. Marriage Financial Readiness / Build Freelance Engine",
      level: "Hierarchy Level",
      parentGoal: "Parent Goal (Optional)",
      targetValue: "Target Value (Optional)",
      unit: "Unit",
      description: "Description & Strategy",
      addChild: "Add Child",
      noGoalsTitle: "No Goals Found",
      noGoalsDesc: "Start by defining a top-level vision or annual milestone to ground your daily actions.",
      goalDetails: "Goal Strategy & Milestone Details",
    },
    leads: {
      title: "Revenue Pipeline & Freelance Engine",
      subtitle: "Full lifecycle discovery → outreach → proposal → negotiation → won → delivery → payment.",
      newLead: "New Opportunity / Lead",
      editLead: "Edit Opportunity",
      leadTitle: "Opportunity / Client Name",
      leadTitlePlaceholder: "e.g. Custom MERN Web App / Discord Moderation Bot",
      source: "Lead Source",
      url: "Reference URL / Listing",
      stage: "Pipeline Stage",
      expectedValue: "Expected Value",
      probability: "Win Probability (0 - 1.0)",
      proposalAmount: "Proposal Amount",
      proposalNotes: "Proposal Terms & Scope",
      followUpDate: "Next Follow-Up Date",
      lostReason: "Reason for Loss",
      notes: "Client Context & Discovery Notes",
      pipelineValue: "Total Active Pipeline",
      weightedValue: "Weighted Pipeline Value",
      salesTargets: "Daily & Weekly Sales Targets",
      weeklyProposals: "Weekly Proposals Sent",
      dailyOutreach: "Daily Outreach Touches",
      followUpQueue: "Follow-Up Action Queue",
      noFollowUps: "No pending follow-ups right now. Keep momentum going!",
      logTouch: "Log Touch / Call",
      convertToClient: "Convert to Client",
      recordPayment: "Record Payment Received",
      moveStage: "Move Stage",
      timeline: "Activity Log & History",
      noLeadsTitle: "Pipeline is Open",
      noLeadsDesc: "Capture new freelance leads, clients, or bot project opportunities to start closing.",
      leadDetails: "Opportunity & Discovery Dossier",
    },
    clients: {
      title: "Clients Directory & CRM",
      subtitle: "Manage relationships, active contracts, outstanding balances, and repeat client retention.",
      newClient: "New Client",
      editClient: "Edit Client",
      clientName: "Client / Business Name",
      company: "Company / Brand",
      contact: "Primary Contact Info",
      source: "Acquisition Channel",
      paymentStatus: "Payment Status",
      nextAction: "Next Scheduled Action",
      followUpDate: "Follow-Up Date",
      notes: "Client Relationship Notes",
      linkedProjects: "Active & Past Projects",
      noClientsTitle: "No Clients Recorded",
      noClientsDesc: "Convert won leads into clients or create a new client record directly.",
      clientDetails: "Client Relationship Profile",
      contacts: "Contact Channels",
      addContact: "Add Contact Method",
      channel: "Channel",
      channelValue: "Handle / Phone / Link",
      scheduledActions: "Scheduled Follow-up Tasks",
      addAction: "Add Action Item",
      actionText: "Action Description",
      actionDate: "Target Date",
      noProjectsLinked: "No projects linked to this client yet.",
    },
    projects: {
      title: "Projects Hub & Execution",
      subtitle: "Track delivery milestones, linked tasks, client specifications, and delivery deadlines.",
      newProject: "New Project",
      editProject: "Edit Project",
      projectName: "Project Name",
      projectKind: "Project Type",
      budget: "Project Budget",
      deadline: "Delivery Deadline",
      startedOn: "Start Date",
      client: "Associated Client",
      brief: "Project Brief & Objectives",
      requirements: "Technical Scope & Deliverables",
      noProjectsTitle: "No Projects Active",
      noProjectsDesc: "Create a new project pipeline or convert a won freelance lead.",
      projectDetails: "Project Architecture & Scope",
      linkedTasks: "Associated Execution Tasks",
    },
    finances: {
      title: "Financial Engine & Wallets",
      subtitle: "Track income streams, expenses, computed savings buckets, and marriage runway.",
      overviewTab: "Overview & Analytics",
      transactionsTab: "Transactions Ledger",
      walletsTab: "Savings Buckets",
      marriageTab: "Marriage Mission Fund",
      totalIncome: "Total Income",
      totalExpenses: "Total Expenses",
      netSavings: "Net Savings",
      savingsRate: "Savings Rate",
      wallets: "Savings Buckets & Wallets",
      newWallet: "New Bucket",
      editWallet: "Edit Bucket",
      walletName: "Bucket Name",
      walletKind: "Bucket Kind",
      startingBalance: "Starting Balance",
      targetAmount: "Target Amount",
      currentBalance: "Current Balance",
      netChange: "Net Change",
      transactions: "Transactions Ledger",
      newTransaction: "New Transaction",
      editTransaction: "Edit Transaction",
      amount: "Amount",
      transactionKind: "Transaction Type",
      income: "Income (+)",
      expense: "Expense (-)",
      category: "Category",
      date: "Date",
      source: "Source / Payer / Method",
      note: "Notes / Description",
      wallet: "Savings Bucket",
      selectWallet: "Select bucket...",
      noWallet: "General Cash (No Bucket)",
      linkedProject: "Linked Project",
      linkedLead: "Linked Deal / Lead",
      isRecurring: "Recurring Monthly",
      month: "Month",
      allCategories: "All Categories",
      allKinds: "All Types",
      noTransactionsTitle: "No Transactions Found",
      noTransactionsDesc: "Log your income and expenses to track cashflow and savings.",
      noWalletsTitle: "No Buckets Created",
      noWalletsDesc: "Create savings buckets for Marriage, Emergency, Business, and Personal reserves.",
      transactionDetails: "Transaction Dossier",
      walletDetails: "Bucket Dossier & Cashflow",
      incomeTargets: "Monthly Income Milestones",
      minIncome: "Minimum Survival",
      comfortIncome: "Comfort Living",
      stretchIncome: "Stretch Target",
      marriageGoal: "Marriage Runway (250,000 EGP)",
      marriageProgress: "Marriage Fund Progress",
      targetGap: "Remaining to Target",
      requiredMonthly: "Required Monthly Savings",
      requiredWeekly: "Required Weekly Savings",
      requiredDaily: "Required Daily Savings",
      monthsRemaining: "Months Remaining",
      goalCompleted: "Target Fully Achieved! 🎉",
    },
    marriageExpenses: {
      title: "Wedding Checklist & Budget Planner",
      subtitle: "Plan and track costs for furniture, finishing, appliances, hall, and jewelry.",
      newExpense: "New Expense Item",
      editExpense: "Edit Item",
      item: "Item Name",
      category: "Category",
      estimatedCost: "Estimated Cost",
      actualCost: "Actual Cost",
      paidAmount: "Paid Amount",
      remaining: "Remaining to Pay",
      deadline: "Target Deadline",
      priority: "Priority",
      status: "Status",
      notes: "Specifications & Notes",
      totalBudget: "Total Wedding Budget",
      totalPaid: "Total Paid So Far",
      recordPayment: "Record Payment",
      paymentAmount: "Payment Amount",
      noExpensesTitle: "No Wedding Items Logged",
      noExpensesDesc: "Add items for furniture, finishing, rent deposit, hall, and jewelry.",
      expenseDetails: "Wedding Expense Item Dossier",
    },
    capture: {
      title: "Quick Capture",
      placeholder: "What's on your mind? Capture an idea, task, or thought instantly...",
      hint: "Press ⌘B or B anytime to capture without leaving your flow.",
      submit: "Send to Brain Dump",
      inboxTitle: "Brain Dump Inbox",
      inboxSubtitle: "Day-one scratchpad for capturing thoughts, tasks, and raw ideas before categorizing.",
      noDumpsTitle: "Inbox is Clean",
      noDumpsDesc: "Press B or use the quick capture bar to offload ideas and tasks immediately.",
    },
    settings: {
      title: "Settings & System Configuration",
      subtitle: "Tune your identity, working schedule, marriage readiness milestones, and revenue targets.",
      tabs: {
        personal: "Personal & Schedule",
        marriage: "Marriage & Savings",
        work: "Income & Revenue Targets",
        privacy: "Preferences & Privacy",
      },
      displayName: "Display Name",
      timezone: "Timezone",
      currency: "Currency Code",
      weeklyOffDay: "Weekly Protected Off Day",
      workHoursPerDay: "Work Hours / Day",
      preferredStartTime: "Preferred Start Time",
      marriageTargetAmount: "Marriage Target Amount",
      marriageTargetMonths: "Target Timeline (Months)",
      marriageFallbackMonths: "Fallback Timeline (Months)",
      housingStrategy: "Housing Strategy",
      primaryStream: "Primary Work Stream",
      secondaryStream: "Secondary Stream",
      proposalsPerWeek: "Weekly Proposals Target",
      outreachPerDay: "Daily Outreach Touches Target",
      sharedDay: "Shared Relationship Day",
      defaultBudget: "Default Outing Budget",
      aiEnabled: "Enable AI Layer Features (Phase 14)",
      aiPrivacy: "Allow AI access to Relationship notes (Default: Disabled for Privacy)",
      savedSuccess: "Settings saved successfully.",
    },
    auth: {
      welcome: "Welcome back",
      subtitle: "Sign in to your command center",
      email: "Email address",
      password: "Password",
      signIn: "Sign in",
      signingIn: "Signing in…",
    },
  },
  ar: {
    nav: {
      command: "غرفة القيادة (Command Center)",
      revenueWork: "العمل والإيرادات (Revenue & Work)",
      knowledgeGrowth: "المعرفة والنمو (Knowledge & Growth)",
      lifeMission: "الحياة والرسالة (Life & Mission)",
      today: "خطة اليوم (Today's Plan)",
      tasks: "المهام والأولويات (Tasks)",
      goals: "شجرة الأهداف (Goals Hierarchy)",
      freelance: "مسار الفريلانس (Freelance)",
      clients: "سجل العملاء (Clients)",
      projects: "المشاريع (Projects)",
      finances: "المالية والمحافظ (Finances)",
      brainDump: "صندوق الأفكار (Brain Dump)",
      notes: "الملاحظات والمعرفة (Notes)",
      reviews: "المراجعة الأسبوعية (Reviews)",
      marriage: "خطة الزواج (Marriage Mission)",
      relationship: "العلاقة (Relationship)",
      calendar: "التقويم والروتين (Calendar)",
      analytics: "التحليلات والإحصائيات (Analytics)",
      settings: "الإعدادات (Settings)",
      logout: "تسجيل الخروج",
      capture: "تسجيل فكرة سريعة (Quick Capture)",
    },
    common: {
      save: "حفظ التغييرات",
      saving: "جاري الحفظ...",
      cancel: "إلغاء",
      close: "إغلاق",
      create: "إنشاء",
      edit: "تعديل",
      delete: "حذف",
      filter: "فلترة",
      search: "بحث...",
      active: "نشطة",
      all: "الكل",
      backlog: "قائمة الانتظار (Backlog)",
      planned: "مجدولة",
      inProgress: "قيد التنفيذ",
      done: "مكتملة",
      completed: "مكتملة",
      doToday: "تنفيذ اليوم",
      tomorrow: "غداً",
      confirmDelete: "هل أنت متأكد من الحذف؟",
      safeDeleteNotice: "العناصر المرتبطة ستبقى بأمان.",
      actions: "الإجراءات",
      status: "الحالة",
      ready: "جاهز ويعمل",
      viewDetails: "عرض التفاصيل الكاملة",
      details: "التفاصيل والملاحظات",
      noNotes: "لا توجد ملاحظات أو تفاصيل إضافية مسجلة.",
      copy: "نسخ",
      copied: "تم النسخ!",
    },
    tasks: {
      title: "محرك المهام والأولويات (Tasks Engine)",
      subtitle: "إدارة التنفيذ اليومي: حساب الأولويات الذكي، فصل مهام الـ Revenue عن الـ Build، وحماية المهام الراكدة.",
      actionItems: "عناصر العمل",
      newTask: "مهمة جديدة",
      editTask: "تعديل المهمة",
      taskTitle: "عنوان المهمة",
      taskTitlePlaceholder: "مثال: إرسال Proposal لعميل / بناء ميزة في Next.js",
      classification: "التصنيف (Build vs. Revenue)",
      revenueType: "💰 عائد مباشر (Revenue)",
      productType: "🔨 بناء وتطوير (Product Build)",
      clientType: "👥 تسليم لعميل (Client Delivery)",
      priorityTier: "مستوى الأولوية",
      critical: "حرجة (Critical)",
      high: "عالية (High)",
      medium: "متوسطة (Medium)",
      low: "منخفضة (Low)",
      impactWeights: "أوزان خوارزمية الأولويات (0 - 5)",
      revenueImpact: "الأثر المالي (3x)",
      strategicImpact: "الأثر الاستراتيجي (2x)",
      urgency: "مدى الإلحاح (2x)",
      effort: "الجهد المبذول (-1x)",
      scheduledDate: "تاريخ التنفيذ المجدول",
      deadline: "الموعد النهائي (Deadline)",
      topThree: "أهم 3 مهام (Top 3 Focus)",
      markTopThree: "تحديد ضمن أهم 3 أولويات لليوم",
      linkedGoal: "الهدف المرتبط (Goal)",
      linkedProject: "المشروع المرتبط (Project)",
      recurringRule: "قاعدة التكرار (Recurring)",
      notes: "الملاحظات والخطوات الفرعية",
      staleTitle: "مهام راكدة بانتظار القرار (Stale Tasks)",
      staleDesc: "هذه المهام لم يتم تعديلها منذ أكثر من 3 أيام. قرر تنفيذها اليوم أو إعادة جدولتها أو حذفها.",
      noTasksTitle: "لا توجد مهام مطابقة",
      noTasksDesc: "أضف مهمة جديدة للتركيز على الـ Revenue أو بناء النظام.",
      taskDetails: "ملف المهمة وحساب الأولوية",
      scoreBreakdown: "تفصيل درجات خوارزمية الأولوية",
    },
    goals: {
      title: "شجرة الأهداف والتحول (Goals Hierarchy)",
      subtitle: "ربط الرؤية الكبرى (Vision) بالأهداف السنوية والربع سنوية والمهام الأسبوعية.",
      newGoal: "هدف رئيسي جديد",
      editGoal: "تعديل الهدف",
      goalTitle: "عنوان الهدف",
      goalTitlePlaceholder: "مثال: الاستعداد المالي للزواج / بناء محرك الفريلانس",
      level: "مستوى الهدف (Hierarchy Level)",
      parentGoal: "الهدف الأب (Parent Goal)",
      targetValue: "القيمة المستهدفة (Target)",
      unit: "الوحدة",
      description: "الوصف والاستراتيجية",
      addChild: "إضافة هدف فرعي",
      noGoalsTitle: "لا توجد أهداف",
      noGoalsDesc: "ابدأ بتحديد هدف سنوي أو رؤية رئيسية لتربط بها مهامك اليومية.",
      goalDetails: "تفاصيل واستراتيجية الهدف",
    },
    leads: {
      title: "محرك الفريلانس وإيرادات الصفقات (Revenue Pipeline)",
      subtitle: "دورة المبيعات الكاملة: استكشاف الفرص → تواصل (Outreach) → عروض (Proposals) → تفاوض → إغلاق وتسليم وتأكيد الدفع.",
      newLead: "فرصة جديدة (New Lead)",
      editLead: "تعديل بيانات الفرصة",
      leadTitle: "اسم الفرصة / العميل",
      leadTitlePlaceholder: "مثال: تطبيق ويب MERN / بوت ديسكورد لإدارة السيرفرات",
      source: "مصدر الفرصة (Source)",
      url: "رابط الإعلان / المنصة",
      stage: "المرحلة في المسار (Stage)",
      expectedValue: "القيمة المتوقعة",
      probability: "احتمالية الإغلاق (0 - 1.0)",
      proposalAmount: "قيمة العرض المالي (Proposal)",
      proposalNotes: "تفاصيل وشروط العرض",
      followUpDate: "تاريخ المتابعة القادم (Follow-Up)",
      lostReason: "سبب عدم الإغلاق (إن وجد)",
      notes: "ملاحظات الاستكشاف وتفاصيل العميل",
      pipelineValue: "إجمالي قيمة الفرص النشطة",
      weightedValue: "القيمة الموزونة المتوقعة (Weighted Value)",
      salesTargets: "مستهدفات التواصل والمبيعات",
      weeklyProposals: "الـ Proposals المرسلة هذا الأسبوع",
      dailyOutreach: "تواصل اليوم (Outreach / Calls)",
      followUpQueue: "طابور المتابعة العاجل (Follow-Up Queue)",
      noFollowUps: "لا توجد متابعات معلقة حالياً. استمر في التحرك!",
      logTouch: "تسجيل تواصل / مكالمة",
      convertToClient: "تحويل إلى عميل (Convert to Client)",
      recordPayment: "تسجيل دفعة مستلمة",
      moveStage: "نقل المرحلة",
      timeline: "سجل الأنشطة والمتابعات (Activity Log)",
      noLeadsTitle: "لا توجد فرص نشطة حالياً",
      noLeadsDesc: "أضف فرصة عمل جديدة أو عميل محتمل لبدء المتابعة وإغلاق الصفقات.",
      leadDetails: "ملف تفاصيل الفرصة والتفاوض",
    },
    clients: {
      title: "دليل وسجل العملاء (Clients CRM)",
      subtitle: "إدارة علاقات العملاء، العقود الحالية، المبالغ المتبقية، والحفاظ على ولاء العملاء وتكرار الصفقات.",
      newClient: "عميل جديد (New Client)",
      editClient: "تعديل بيانات العميل",
      clientName: "اسم العميل / الشركة",
      company: "الشركة / البراند",
      contact: "بيانات التواصل الأساسية",
      source: "قناة الاستقطاب",
      paymentStatus: "حالة الدفع (Payment Status)",
      nextAction: "الخطوة القادمة",
      followUpDate: "تاريخ المتابعة",
      notes: "ملاحظات وسياق التعامل مع العميل",
      linkedProjects: "المشاريع النشطة والسابقة",
      noClientsTitle: "لا يوجد عملاء مسجلون",
      noClientsDesc: "حول الصفقات الرابحة إلى عملاء أو أضف عميلاً جديداً مباشرة.",
      clientDetails: "ملف بيانات وسياق العميل",
      contacts: "قنوات التواصل",
      addContact: "إضافة وسيلة تواصل",
      channel: "الوسيلة",
      channelValue: "الرقم / الحساب / الرابط",
      scheduledActions: "مهمات وخطوات المتابعة المجدولة",
      addAction: "إضافة خطوة متابعة",
      actionText: "وصف الإجراء المطلوب",
      actionDate: "تاريخ الاستحقاق",
      noProjectsLinked: "لا توجد مشاريع مرتبطة بهذا العميل حالياً.",
    },
    projects: {
      title: "مركز إدارة المشاريع والتسليم (Projects Hub)",
      subtitle: "متابعة مراحل التنفيذ البرمجي، المواعيد النهائية، متطلبات العملاء والمهام المرتبطة.",
      newProject: "مشروع جديد (New Project)",
      editProject: "تعديل المشروع",
      projectName: "اسم المشروع",
      projectKind: "نوع المشروع (Kind)",
      budget: "ميزانية المشروع",
      deadline: "موعد التسليم النهائي",
      startedOn: "تاريخ البدء",
      client: "العميل المرتبط",
      brief: "نبذة عن المشروع وأهدافه",
      requirements: "المتطلبات التقنية والمخرجات",
      noProjectsTitle: "لا توجد مشاريع نشطة",
      noProjectsDesc: "ابدأ مشروعاً جديداً أو حول فرصة فريلانس رابحة إلى مشروع تنفيذي.",
      projectDetails: "المواصفات والمتطلبات التقنية للمشروع",
      linkedTasks: "المهام التنفيذية المرتبطة",
    },
    finances: {
      title: "محرك المالية والمحافظ (Financial Engine)",
      subtitle: "تتبع مسارات الدخل، المصروفات، حساب أرصدة محافظ الادخار، ومسار الاستعداد المالي للزواج.",
      overviewTab: "نظرة عامة والتحليلات",
      transactionsTab: "سجل المعاملات المالية",
      walletsTab: "محافظ الادخار (Buckets)",
      marriageTab: "مستهدف الزواج (Marriage Fund)",
      totalIncome: "إجمالي الدخل",
      totalExpenses: "إجمالي المصروفات",
      netSavings: "صافي الادخار",
      savingsRate: "معدل الادخار (Savings Rate)",
      wallets: "محافظ الادخار والسيولة (Buckets)",
      newWallet: "محفظة جديدة (New Bucket)",
      editWallet: "تعديل المحفظة",
      walletName: "اسم المحفظة",
      walletKind: "نوع المحفظة",
      startingBalance: "الرصيد الابتدائي",
      targetAmount: "المبلغ المستهدف",
      currentBalance: "الرصيد الفعلي الحالي",
      netChange: "صافي الحركة المالية",
      transactions: "سجل المعاملات",
      newTransaction: "معاملة جديدة (New Transaction)",
      editTransaction: "تعديل المعاملة",
      amount: "المبلغ (EGP)",
      transactionKind: "نوع المعاملة",
      income: "دخل وارد (+)",
      expense: "مصروف خارج (-)",
      category: "التصنيف (Category)",
      date: "التاريخ",
      source: "المصدر / جهة الدفع",
      note: "ملاحظات وتفاصيل",
      wallet: "المحفظة المرتبطة (Bucket)",
      selectWallet: "اختر المحفظة...",
      noWallet: "سيولة عامة (بدون محفظة)",
      linkedProject: "المشروع المرتبط",
      linkedLead: "الصفقة المرتبطة",
      isRecurring: "مصروف / دخل شهري متكرر",
      month: "الشهر",
      allCategories: "كافة التصنيفات",
      allKinds: "كافة الأنواع (دخل/مصروف)",
      noTransactionsTitle: "لا توجد معاملات مسجلة",
      noTransactionsDesc: "سجل حركات الدخل والمصروفات لتتبع تدفقاتك المالية بدقة.",
      noWalletsTitle: "لا توجد محافظ ادخار",
      noWalletsDesc: "أنشئ محافظ ادخار للزواج والطوارئ والبيزنس والاحتياطيات الشخصية.",
      transactionDetails: "ملف تفاصيل المعاملة المالية",
      walletDetails: "ملف المحفظة والتدفق المالي",
      incomeTargets: "مستهدفات الدخل الشهري (Income Targets)",
      minIncome: "الحد الأدنى للأمان (15k)",
      comfortIncome: "المستوى المريح (30k)",
      stretchIncome: "المستهدف الطموح (50k)",
      marriageGoal: "مسار هدف الزواج (250,000 ج.م)",
      marriageProgress: "نسبة إنجاز هدف الزواج",
      targetGap: "المتبقي للوصول للمستهدف",
      requiredMonthly: "معدل الادخار الشهري المطلوب",
      requiredWeekly: "معدل الادخار الأسبوعي المطلوب",
      requiredDaily: "معدل الادخار اليومي المطلوب",
      monthsRemaining: "الشهور المتبقية للموعد",
      goalCompleted: "تم تحقيق المستهدف بنجاح! 🎉",
    },
    marriageExpenses: {
      title: "مخطط بنود وتكاليف الزواج (Wedding Planner)",
      subtitle: "تخطيط وتتبع تكاليف الأثاث، التشطيب، القاعة، الأجهزة، والذهب.",
      newExpense: "إضافة بند جديد",
      editExpense: "تعديل البند",
      item: "اسم البند / الغرض",
      category: "التصنيف",
      estimatedCost: "التكلفة التقديرية",
      actualCost: "التكلفة الفعلية",
      paidAmount: "المبلغ المدفوع",
      remaining: "المتبقي للسداد",
      deadline: "تاريخ الاستحقاق المستهدف",
      priority: "الأولوية",
      status: "الحالة",
      notes: "المواصفات والملاحظات",
      totalBudget: "إجمالي الميزانية التقديرية",
      totalPaid: "إجمالي المدفوع حتى الآن",
      recordPayment: "تسجيل دفعة",
      paymentAmount: "قيمة الدفعة (EGP)",
      noExpensesTitle: "لم تتم إضافة بنود بعد",
      noExpensesDesc: "أضف بنود الأثاث والتشطيب والشقة والذهب لتتبع التكاليف.",
      expenseDetails: "ملف تفاصيل بند الزواج",
    },
    capture: {
      title: "تسجيل سريع (Quick Capture)",
      placeholder: "ما الذي يدور في ذهنك؟ سجل فكرة أو مهمة أو معلومة فوراً...",
      hint: "اضغط حرف B في أي وقت للكتابة السريعة دون مغادرة صفحتك الحالية.",
      submit: "إرسال إلى Brain Dump",
      inboxTitle: "صندوق الأفكار (Brain Dump Inbox)",
      inboxSubtitle: "مساحة التفريغ الفوري لكتابة الأفكار والمهام الخام قبل تصنيفها.",
      noDumpsTitle: "الصندوق فارغ",
      noDumpsDesc: "اضغط B في أي وقت لتفريغ أفكارك ومهامك فور ظهورها.",
    },
    settings: {
      title: "الإعدادات وضبط النظام (Settings)",
      subtitle: "تخصيص الهوية ومواعيد العمل وأهداف الزواج ومستهدفات الدخل.",
      tabs: {
        personal: "البيانات وجدول العمل",
        marriage: "أهداف الزواج والادخار",
        work: "مستهدفات الدخل والـ Sales",
        privacy: "التفضيلات والخصوصية",
      },
      displayName: "الاسم",
      timezone: "المنطقة الزمنية (Timezone)",
      currency: "رمز العملة",
      weeklyOffDay: "يوم الإجازة الأسبوعي المحمي",
      workHoursPerDay: "ساعات العمل اليومية",
      preferredStartTime: "وقت بدء العمل المفضل",
      marriageTargetAmount: "المبلغ المستهدف للزواج",
      marriageTargetMonths: "المدة الزمنية المستهدفة (شهور)",
      marriageFallbackMonths: "المدة البديلة (شهور)",
      housingStrategy: "استراتيجية السكن",
      primaryStream: "مسار العمل الأساسي",
      secondaryStream: "المسار الثانوي",
      proposalsPerWeek: "مستهدف الـ Proposals الأسبوعي",
      outreachPerDay: "مستهدف التواصل اليومي (Outreach)",
      sharedDay: "يوم العلاقة والأسرة المشترك",
      defaultBudget: "ميزانية الخروج الافتراضية",
      aiEnabled: "تفعيل ميزات الذكاء الاصطناعي (Phase 14)",
      aiPrivacy: "السماح للـ AI بالوصول لملاحظات العلاقات (معطل افتراضياً للخصوصية)",
      savedSuccess: "تم حفظ الإعدادات بنجاح.",
    },
    auth: {
      welcome: "مرحباً بك",
      subtitle: "تسجيل الدخول إلى غرفة القيادة الخاصة بك",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      signIn: "تسجيل الدخول",
      signingIn: "جاري الدخول…",
    },
  },
};
