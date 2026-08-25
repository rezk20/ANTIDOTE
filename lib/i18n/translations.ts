export type Locale = "en" | "ar";

export interface TranslationSchema {
  nav: {
    home: string;
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
    habits: string;
    routines: string;
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
  todayPlan: {
    title: string;
    subtitle: string;
    energyLevel: string;
    energyLow: string;
    energyHigh: string;
    availableHours: string;
    capacityGuard: string;
    capacityOverload: string;
    capacityOptimal: string;
    hoursUnit: string;
    fridayRule: string;
    fridayRuleDesc: string;
    focusQuestion: string;
    focusQuestionPlaceholder: string;
    topThreeTitle: string;
    topThreeSubtitle: string;
    topThreeEmpty: string;
    actionTriad: string;
    actionTriadSubtitle: string;
    moneyAction: string;
    moneyActionDesc: string;
    personalAction: string;
    personalActionDesc: string;
    relationshipAction: string;
    relationshipActionDesc: string;
    selectTask: string;
    noTaskAssigned: string;
    scheduledTasks: string;
    overdueTasks: string;
    todayTasks: string;
    completeTask: string;
    incompleteTask: string;
    shutdownDay: string;
    shutdownTitle: string;
    shutdownSubtitle: string;
    shutdownConfirm: string;
    dayClosed: string;
    dayClosedDesc: string;
    reopenDay: string;
    reopeningDay: string;
    tasksCompletedToday: string;
    rolloverTasks: string;
    tomorrowFocus: string;
    tomorrowFocusPlaceholder: string;
    shutdownNotes: string;
    shutdownNotesPlaceholder: string;
    generatePlan: string;
    planSaved: string;
  };
  dashboard: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    commandSubtitle: string;
    vitalFocus: string;
    topThreeCardTitle: string;
    topThreeCardSubtitle: string;
    moneyCardTitle: string;
    moneyCardSubtitle: string;
    revenueCardTitle: string;
    revenueCardSubtitle: string;
    followupCardTitle: string;
    followupCardSubtitle: string;
    quickDumpCardTitle: string;
    quickDumpCardSubtitle: string;
    quickDumpPlaceholder: string;
    quickDumpSubmit: string;
    quickDumpSuccess: string;
    noRevenueTask: string;
    noFollowups: string;
    noTopThree: string;
    allDoneCelebration: string;
    shutdownCountdown: string;
    viewTodayPlan: string;
    viewFinances: string;
    viewTasks: string;
    viewPipeline: string;
    marriageTarget: string;
    monthlyTarget: string;
    hoursRemaining: string;
    contactClient: string;
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
  notesPage: {
    title: string;
    subtitle: string;
    newNote: string;
    editNote: string;
    noteTitle: string;
    noteTitlePlaceholder: string;
    folder: string;
    selectFolder: string;
    allFolders: string;
    tags: string;
    tagsPlaceholder: string;
    content: string;
    contentPlaceholder: string;
    pinnedNotes: string;
    allNotes: string;
    archivedNotes: string;
    pinNote: string;
    unpinNote: string;
    archiveNote: string;
    unarchiveNote: string;
    deleteNote: string;
    previewTab: string;
    editTab: string;
    readingTime: string;
    wordCount: string;
    noNotesTitle: string;
    noNotesDesc: string;
    noteDetails: string;
    previousPage: string;
    nextPage: string;
    pageOf: string;
    showingNotes: string;
    folders: {
      inbox: string;
      businessStrategy: string;
      freelanceClients: string;
      discordBots: string;
      productsSaas: string;
      marriageHome: string;
      financesInvestments: string;
      learningGrowth: string;
      habitsHealth: string;
      systemsWorkflows: string;
      decisionsLog: string;
      templates: string;
      archive: string;
    };
  };
  conversions: {
    convertTitle: string;
    convertSubtitle: string;
    convertToTask: string;
    convertToNote: string;
    convertToGoal: string;
    convertToLead: string;
    taskTitle: string;
    taskArea: string;
    taskPriority: string;
    noteTitle: string;
    noteFolder: string;
    goalTitle: string;
    goalCategory: string;
    goalTimeframe: string;
    leadTitle: string;
    leadStage: string;
    leadValue: string;
    convertedBadge: string;
    convertSuccess: string;
    convertedTo: string;
    tabs: {
      inbox: string;
      converted: string;
      all: string;
    };
  };
  reviewsPage: {
    title: string;
    subtitle: string;
    weeklyTab: string;
    dailyTab: string;
    startWeeklyReview: string;
    editReview: string;
    resumeWeeklyReview: string;
    reviewHistory: string;
    noReviewsTitle: string;
    noReviewsDesc: string;
    dailyReflectionsTitle: string;
    noDailyReflections: string;
    weekOf: string;
    overallBalance: string;
    reviewDossier: string;
    step1Title: string;
    step1Subtitle: string;
    step2Title: string;
    step2Subtitle: string;
    step3Title: string;
    step3Subtitle: string;
    step4Title: string;
    step4Subtitle: string;
    nextStep: string;
    prevStep: string;
    completeReview: string;
    saveDraft: string;
    savingReview: string;
    reviewSavedSuccess: string;
    autoMetrics: {
      incomeThisWeek: string;
      expensesThisWeek: string;
      netSavings: string;
      tasksDone: string;
      highPriorityTasks: string;
      proposalsSent: string;
      daysPlanned: string;
    };
    dimensions: {
      revenue: string;
      revenueDesc: string;
      career: string;
      careerDesc: string;
      financial: string;
      financialDesc: string;
      relationship: string;
      relationshipDesc: string;
      execution: string;
      executionDesc: string;
      routine: string;
      routineDesc: string;
    };
    questions: {
      q_wins: string;
      q_wins_ph: string;
      q_misses: string;
      q_misses_ph: string;
      q_revenue_reflection: string;
      q_revenue_reflection_ph: string;
      q_time_drain: string;
      q_time_drain_ph: string;
      q_client_health: string;
      q_client_health_ph: string;
      q_learning_growth: string;
      q_learning_growth_ph: string;
      q_relationship_check: string;
      q_relationship_check_ph: string;
      q_habits_energy: string;
      q_habits_energy_ph: string;
      q_start: string;
      q_start_ph: string;
      q_stop: string;
      q_stop_ph: string;
      q_continue: string;
      q_continue_ph: string;
      q_next_top_three: string;
      q_next_top_three_ph: string;
      q_system_tweak: string;
      q_system_tweak_ph: string;
    };
    convertTopThree: string;
    topThreeConvertedSuccess: string;
  };
  marriagePage: {
    title: string;
    subtitle: string;
    targetAmount: string;
    savedSoFar: string;
    remainingGap: string;
    monthlyNeeded: string;
    weeklyNeeded: string;
    dailyNeeded: string;
    monthsRemaining: string;
    readinessScore: string;
    readinessTitle: string;
    readinessSubtitle: string;
    antiChaosTitle: string;
    expensesTitle: string;
    expensesSubtitle: string;
    newExpense: string;
    editExpense: string;
    recordPayment: string;
    paymentAmount: string;
    expenseItem: string;
    category: string;
    estimated: string;
    actual: string;
    paid: string;
    remaining: string;
    deadline: string;
    priority: string;
    status: string;
    categories: {
      furniture: string;
      finishing: string;
      rentDeposit: string;
      hall: string;
      clothing: string;
      photography: string;
      transport: string;
      appliances: string;
      jewelry: string;
      misc: string;
    };
    statuses: {
      planned: string;
      inProgress: string;
      paid: string;
      dropped: string;
    };
    saveSuccess: string;
    paymentSuccess: string;
    deleteConfirm: string;
  };
  relationshipPage: {
    title: string;
    subtitle: string;
    tabs: {
      ideas: string;
      wishlist: string;
      checkin: string;
    };
    budgetBannerTitle: string;
    ideasTitle: string;
    ideasSubtitle: string;
    newIdea: string;
    editIdea: string;
    randomIdea: string;
    randomIdeaPicked: string;
    wishlistTitle: string;
    wishlistSubtitle: string;
    newWishlistItem: string;
    bought: string;
    pending: string;
    checkinTitle: string;
    checkinSubtitle: string;
    checkinHistory: string;
    saveCheckin: string;
    checkinSavedSuccess: string;
    privacyBadge: string;
    privacyNotice: string;
    questions: {
      q_appreciation: string;
      q_appreciation_ph: string;
      q_connection: string;
      q_connection_ph: string;
      q_stressors: string;
      q_stressors_ph: string;
      q_marriage_talk: string;
      q_marriage_talk_ph: string;
      q_next_shared_time: string;
      q_next_shared_time_ph: string;
    };
    budgetTiers: {
      free: string;
      low: string;
      medium: string;
      high: string;
    };
    categories: {
      date: string;
      homeActivity: string;
      conversation: string;
      trip: string;
      surprise: string;
    };
    wishlistCategories: {
      gift: string;
      home: string;
      experience: string;
      other: string;
    };
  };
  habitsPage: {
    title: string;
    subtitle: string;
    todayHabits: string;
    allHabits: string;
    weeklyProgress: string;
    newHabit: string;
    editHabit: string;
    habitName: string;
    description: string;
    category: string;
    targetPerWeek: string;
    restartTodayTitle: string;
    restartTodayDesc: string;
    restartButton: string;
    streakDays: string;
    completedDays: string;
    categories: {
      healthRoutine: string;
      deepWork: string;
      revenue: string;
      learning: string;
      relationship: string;
      finance: string;
      personal: string;
    };
    saveSuccess: string;
    deleteConfirm: string;
  };
  routinesPage: {
    title: string;
    subtitle: string;
    tabs: {
      morning: string;
      workday: string;
      evening: string;
      night: string;
    };
    routineItems: string;
    newItem: string;
    itemTitle: string;
    durationMin: string;
    totalDuration: string;
    resetDefaults: string;
    resetConfirm: string;
    saveSuccess: string;
    resetSuccess: string;
  };
  dailyLog: {
    title: string;
    subtitle: string;
    sleepAt: string;
    wokeAt: string;
    hoursSlept: string;
    energy: string;
    focus: string;
    morningLog: string;
    nightLog: string;
    capacityNotice: string;
    energyRatings: {
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    };
    saveLog: string;
    savedSuccess: string;
  };
  timeTracking: {
    timerTitle: string;
    selectTask: string;
    kind: string;
    start: string;
    pause: string;
    resume: string;
    stop: string;
    focusPrompt: string;
    focusRating: string;
    sessionSaved: string;
    weeklyTotal: string;
    deepWork: string;
    revenue: string;
    learning: string;
    relationship: string;
    kinds: {
      deepWork: string;
      delivery: string;
      sales: string;
      learning: string;
      product: string;
      admin: string;
      relationship: string;
      rest: string;
    };
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
      home: "Home Page",
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
      habits: "Habits & Streaks",
      routines: "Daily Routines",
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
      subtitle:
        "Daily execution command: Multi-factor priority scoring, Build vs Revenue work tracking, and stale task guards.",
      actionItems: "Action Items",
      newTask: "New Task",
      editTask: "Edit Task",
      taskTitle: "Task Title",
      taskTitlePlaceholder:
        "e.g. Send proposal to client / Build Next.js feature",
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
      staleDesc:
        "These active tasks have not been touched for over 3 days. Decide whether to do them today, reschedule, or clear them out.",
      noTasksTitle: "No Tasks Found",
      noTasksDesc: "Clear your head by adding a new revenue or build task.",
      taskDetails: "Task Intelligence Dossier",
      scoreBreakdown: "Priority Algorithm Score Breakdown",
    },
    goals: {
      title: "Goals & Transformation Hierarchy",
      subtitle:
        "Connect long-term vision to 10-year targets, annual objectives, quarterly milestones, and weekly action items.",
      newGoal: "New Top-Level Goal",
      editGoal: "Edit Goal",
      goalTitle: "Goal Title",
      goalTitlePlaceholder:
        "e.g. Marriage Financial Readiness / Build Freelance Engine",
      level: "Hierarchy Level",
      parentGoal: "Parent Goal (Optional)",
      targetValue: "Target Value (Optional)",
      unit: "Unit",
      description: "Description & Strategy",
      addChild: "Add Child",
      noGoalsTitle: "No Goals Found",
      noGoalsDesc:
        "Start by defining a top-level vision or annual milestone to ground your daily actions.",
      goalDetails: "Goal Strategy & Milestone Details",
    },
    leads: {
      title: "Revenue Pipeline & Freelance Engine",
      subtitle:
        "Full lifecycle discovery → outreach → proposal → negotiation → won → delivery → payment.",
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
      noLeadsDesc:
        "Capture new freelance leads, clients, or bot project opportunities to start closing.",
      leadDetails: "Opportunity & Discovery Dossier",
    },
    clients: {
      title: "Clients Directory & CRM",
      subtitle:
        "Manage relationships, active contracts, outstanding balances, and repeat client retention.",
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
      noClientsDesc:
        "Convert won leads into clients or create a new client record directly.",
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
      subtitle:
        "Track delivery milestones, linked tasks, client specifications, and delivery deadlines.",
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
      noProjectsDesc:
        "Create a new project pipeline or convert a won freelance lead.",
      projectDetails: "Project Architecture & Scope",
      linkedTasks: "Associated Execution Tasks",
    },
    finances: {
      title: "Financial Engine & Wallets",
      subtitle:
        "Track income streams, expenses, computed savings buckets, and marriage runway.",
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
      noTransactionsDesc:
        "Log your income and expenses to track cashflow and savings.",
      noWalletsTitle: "No Buckets Created",
      noWalletsDesc:
        "Create savings buckets for Marriage, Emergency, Business, and Personal reserves.",
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
      subtitle:
        "Plan and track costs for furniture, finishing, appliances, hall, and jewelry.",
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
      noExpensesDesc:
        "Add items for furniture, finishing, rent deposit, hall, and jewelry.",
      expenseDetails: "Wedding Expense Item Dossier",
    },
    todayPlan: {
      title: "Today's Mission & Execution",
      subtitle: "Align your daily capacity, execute your Top 3, and protect your revenue and personal priorities.",
      energyLevel: "Energy Level",
      energyLow: "Low Energy (Lighter load advised)",
      energyHigh: "High Energy (Prime execution state)",
      availableHours: "Available Work Hours",
      capacityGuard: "Capacity Guard",
      capacityOverload: "Overloaded! Planned tasks exceed available hours.",
      capacityOptimal: "Optimal load aligned with available capacity.",
      hoursUnit: "hours",
      fridayRule: "Friday Rule Active",
      fridayRuleDesc: "Lighter sprint load applied. Focus on reviews, admin, and weekly closeout.",
      focusQuestion: "The One Thing That Makes Today a Win",
      focusQuestionPlaceholder: "If I only accomplish one major milestone today, it must be...",
      topThreeTitle: "Top 3 Daily Focus",
      topThreeSubtitle: "The three highest-impact tasks to execute before anything else today.",
      topThreeEmpty: "No Top 3 tasks selected yet. Pin critical tasks below.",
      actionTriad: "Daily Action Triad",
      actionTriadSubtitle: "Guaranteed balanced daily progress across money, personal, and relationship.",
      moneyAction: "Revenue / Money Action",
      moneyActionDesc: "A direct income-generating step (proposal, client delivery, or sales outreach).",
      personalAction: "Personal / Health Action",
      personalActionDesc: "A key personal habit, workout, or self-care priority.",
      relationshipAction: "Relationship / Marriage Action",
      relationshipActionDesc: "A meaningful touchpoint, conversation, or wedding planning step.",
      selectTask: "Assign a task...",
      noTaskAssigned: "No task assigned",
      scheduledTasks: "Scheduled for Today",
      overdueTasks: "Overdue & Carryover",
      todayTasks: "Today's Candidate Tasks",
      completeTask: "Mark Complete",
      incompleteTask: "Revert to Incomplete",
      shutdownDay: "Shutdown & Close Day",
      shutdownTitle: "Evening Shutdown & Daily Review",
      shutdownSubtitle: "Close out today's execution cleanly and set up tomorrow's starting point.",
      shutdownConfirm: "Confirm Day Shutdown",
      dayClosed: "Day Successfully Closed",
      dayClosedDesc: "Great work today. Rest up and start fresh tomorrow.",
      reopenDay: "Reopen Today's Plan",
      reopeningDay: "Reopening...",
      tasksCompletedToday: "Tasks Completed Today",
      rolloverTasks: "Rollover Tasks for Tomorrow",
      tomorrowFocus: "Tomorrow's Starting Point",
      tomorrowFocusPlaceholder: "What is the very first task to tackle tomorrow morning?",
      shutdownNotes: "Shutdown Reflection & Notes",
      shutdownNotesPlaceholder: "Any quick thoughts, wins, or lessons from today...",
      generatePlan: "Generate Day Plan",
      planSaved: "Day plan updated successfully.",
    },
    dashboard: {
      greetingMorning: "Good morning",
      greetingAfternoon: "Good afternoon",
      greetingEvening: "Good evening",
      commandSubtitle: "Here is your 5-card daily execution command briefing.",
      vitalFocus: "Today's Vital Focus",
      topThreeCardTitle: "Top 3 Execution Priorities",
      topThreeCardSubtitle: "Complete these three critical tasks to win today.",
      moneyCardTitle: "Marriage Fund & Money",
      moneyCardSubtitle: "Progress toward your 250,000 EGP marriage mission.",
      revenueCardTitle: "Today's Revenue Action",
      revenueCardSubtitle: "Direct cashflow generation milestone.",
      followupCardTitle: "Next Client Follow-Up",
      followupCardSubtitle: "Upcoming pipeline outreach touchpoint.",
      quickDumpCardTitle: "Quick Brain Dump",
      quickDumpCardSubtitle: "Capture raw thoughts instantly without leaving your dashboard.",
      quickDumpPlaceholder: "Type an idea, task, or thought and press Enter...",
      quickDumpSubmit: "Capture",
      quickDumpSuccess: "Captured to Brain Dump inbox!",
      noRevenueTask: "No active revenue action set for today.",
      noFollowups: "All client follow-ups are up to date!",
      noTopThree: "No Top 3 tasks selected for today.",
      allDoneCelebration: "🎉 Outstanding! All Top 3 priorities are completed.",
      shutdownCountdown: "Shutdown target",
      viewTodayPlan: "Open Today's Plan",
      viewFinances: "View Finance Engine",
      viewTasks: "View All Tasks",
      viewPipeline: "View Sales Pipeline",
      marriageTarget: "Marriage Mission",
      monthlyTarget: "Monthly Target",
      hoursRemaining: "hours left",
      contactClient: "Contact Client",
    },
    capture: {
      title: "Quick Capture",
      placeholder:
        "What's on your mind? Capture an idea, task, or thought instantly...",
      hint: "Press ⌘B or B anytime to capture without leaving your flow.",
      submit: "Send to Brain Dump",
      inboxTitle: "Brain Dump Inbox",
      inboxSubtitle:
        "Day-one scratchpad for capturing thoughts, tasks, and raw ideas before categorizing.",
      noDumpsTitle: "Inbox is Clean",
      noDumpsDesc:
        "Press B or use the quick capture bar to offload ideas and tasks immediately.",
    },
    notesPage: {
      title: "Knowledge & Notes Engine",
      subtitle: "Markdown notes, 13 structured folders, tags, and seamless knowledge organization.",
      newNote: "Create Note",
      editNote: "Edit Note",
      noteTitle: "Note Title",
      noteTitlePlaceholder: "e.g., Discord Bot Architecture & Pricing Model",
      folder: "Folder",
      selectFolder: "Select a folder...",
      allFolders: "All Folders",
      tags: "Tags",
      tagsPlaceholder: "Type a tag and press Enter...",
      content: "Markdown Content",
      contentPlaceholder: "Write your note in Markdown. Supports # Headings, - Lists, - [ ] Checklists, ```code, > Quotes...",
      pinnedNotes: "Pinned Notes",
      allNotes: "All Active Notes",
      archivedNotes: "Archived Notes",
      pinNote: "Pin to Top",
      unpinNote: "Unpin Note",
      archiveNote: "Archive Note",
      unarchiveNote: "Restore from Archive",
      deleteNote: "Delete Note",
      previewTab: "Markdown Preview",
      editTab: "Edit Markdown",
      readingTime: "min read",
      wordCount: "words",
      noNotesTitle: "No Notes in this Folder",
      noNotesDesc: "Create a new note or convert an idea from your Brain Dump inbox.",
      noteDetails: "Note Document Dossier",
      previousPage: "Previous",
      nextPage: "Next",
      pageOf: "Page",
      showingNotes: "Showing",
      folders: {
        inbox: "Inbox",
        businessStrategy: "Business & Strategy",
        freelanceClients: "Freelance & Clients",
        discordBots: "Discord Bots & Services",
        productsSaas: "Products & SaaS Lab",
        marriageHome: "Marriage & Home",
        financesInvestments: "Finances & Investments",
        learningGrowth: "Learning & Growth",
        habitsHealth: "Health & Habits",
        systemsWorkflows: "Systems & Workflows",
        decisionsLog: "Decisions Log",
        templates: "Templates & Playbooks",
        archive: "Archive",
      },
    },
    conversions: {
      convertTitle: "Convert Brain Dump",
      convertSubtitle: "Transform this raw capture into an actionable entity.",
      convertToTask: "Convert to Task",
      convertToNote: "Convert to Note",
      convertToGoal: "Convert to Goal",
      convertToLead: "Convert to Client Lead",
      taskTitle: "Task Title",
      taskArea: "Life Area",
      taskPriority: "Priority Tier",
      noteTitle: "Note Title",
      noteFolder: "Target Folder",
      goalTitle: "Goal Title",
      goalCategory: "Goal Category",
      goalTimeframe: "Timeframe",
      leadTitle: "Lead / Opportunity Name",
      leadStage: "Pipeline Stage",
      leadValue: "Estimated Deal Value (EGP)",
      convertedBadge: "Converted",
      convertSuccess: "Successfully converted and archived raw capture.",
      convertedTo: "Converted into",
      tabs: {
        inbox: "Inbox (Unprocessed)",
        converted: "Converted History",
        all: "All Captures",
      },
    },
    reviewsPage: {
      title: "Reviews & Reflection Engine",
      subtitle: "Weekly calibration, multi-dimensional progress scoring, and strategic blueprinting.",
      weeklyTab: "Weekly Review",
      dailyTab: "Daily Reflections",
      startWeeklyReview: "Start Friday Weekly Review",
      editReview: "Edit Weekly Review",
      resumeWeeklyReview: "Resume Review",
      reviewHistory: "Past Reviews Timeline",
      noReviewsTitle: "No Completed Reviews Yet",
      noReviewsDesc: "Complete your first Friday review to calibrate progress and establish historical momentum.",
      dailyReflectionsTitle: "Daily Reflections History",
      noDailyReflections: "No daily shutdown reflections found yet. Complete your daily shutdown in the Today Plan.",
      weekOf: "Week of",
      overallBalance: "Overall Balance",
      reviewDossier: "Review Dossier",
      step1Title: "1. Reality & Metrics",
      step1Subtitle: "Review auto-aggregated financial and execution numbers and weekly wins/misses.",
      step2Title: "2. Dimension Scoring",
      step2Subtitle: "Rate progress across the 6 core pillars of life and business on a 1–5 scale.",
      step3Title: "3. Strategy & Reflection",
      step3Subtitle: "Examine client pipeline, learning insights, relationship harmony, and physical habits.",
      step4Title: "4. Next Week Blueprint",
      step4Subtitle: "Establish START/STOP/CONTINUE adjustments and select your Top 3 Non-Negotiable Priorities.",
      nextStep: "Next Step",
      prevStep: "Previous Step",
      completeReview: "Complete & Finalize Review",
      saveDraft: "Save Draft",
      savingReview: "Saving Review...",
      reviewSavedSuccess: "Weekly Review saved and archived successfully!",
      autoMetrics: {
        incomeThisWeek: "Income This Week",
        expensesThisWeek: "Expenses This Week",
        netSavings: "Net Savings",
        tasksDone: "Tasks Completed",
        highPriorityTasks: "High/Critical Tasks",
        proposalsSent: "Proposals & Deals",
        daysPlanned: "Days Planned",
      },
      dimensions: {
        revenue: "Revenue & Cash",
        revenueDesc: "Income generation, deal closing, and cash flow velocity",
        career: "Career & Delivery",
        careerDesc: "Client satisfaction, code delivery, and technical quality",
        financial: "Financial Discipline",
        financialDesc: "Controlling expenses, bucket savings, and investment consistency",
        relationship: "Relationship & Home",
        relationshipDesc: "Quality time with partner, wedding prep, and shared harmony",
        execution: "Execution & Deep Work",
        executionDesc: "Deep work blocks, non-negotiable tasks completion, and focus",
        routine: "Energy & Habits",
        routineDesc: "Sleep quality, morning/evening routine stability, and health",
      },
      questions: {
        q_wins: "What were your biggest wins and breakthroughs this week?",
        q_wins_ph: "E.g., Closed a new freelance client, hit savings milestone, completed core auth engine...",
        q_misses: "What slipped through the cracks or fell behind schedule?",
        q_misses_ph: "E.g., Delayed sending proposal by 2 days, missed gym twice...",
        q_revenue_reflection: "Reflection on actual revenue vs weekly target:",
        q_revenue_reflection_ph: "How did income perform relative to your EGP goals? What drove the numbers?",
        q_time_drain: "Where was time or energy drained by friction or distractions?",
        q_time_drain_ph: "E.g., Excessive context switching on Discord, unorganized task priorities...",
        q_client_health: "Client Projects & Pipeline Health:",
        q_client_health_ph: "Status of active client deliverables, pending proposals, and testimonials...",
        q_learning_growth: "Strategic Learning & Skills Practiced:",
        q_learning_growth_ph: "What technical or business concept did you master this week?",
        q_relationship_check: "Relationship & Marriage Preparation:",
        q_relationship_check_ph: "Shared moments, emotional support, and marriage checklist progress...",
        q_habits_energy: "Energy, Sleep & Habit Stability:",
        q_habits_energy_ph: "How was your physical energy, shutdown discipline, and sleep rhythm?",
        q_start: "What should you START doing next week?",
        q_start_ph: "E.g., Implement strict 2-hour morning deep work blocks before checking messages...",
        q_stop: "What should you STOP doing immediately?",
        q_stop_ph: "E.g., Stop answering non-urgent client pings after 8 PM...",
        q_continue: "What worked exceptionally well that you should DOUBLE DOWN on?",
        q_continue_ph: "E.g., Daily shutdown ritual created incredible clarity...",
        q_next_top_three: "Top 3 Non-Negotiable Strategic Priorities for Next Week:",
        q_next_top_three_ph: "1. Ship client MVP\n2. Transfer monthly marriage savings\n3. Send 3 new proposals",
        q_system_tweak: "One concrete tweak to your workflow, tools, or schedule:",
        q_system_tweak_ph: "E.g., Block Friday 3 PM specifically for Weekly Review...",
      },
      convertTopThree: "Create Top 3 Priorities as Actionable Tasks for Next Week",
      topThreeConvertedSuccess: "Top 3 priorities created as tasks for next week!",
    },
    marriagePage: {
      title: "Marriage Mission",
      subtitle: "250,000 EGP readiness tracker, itemized expense checklists, deadlines, and holistic readiness dimensions.",
      targetAmount: "Target Fund",
      savedSoFar: "Saved in Marriage Bucket",
      remainingGap: "Remaining to Target",
      monthlyNeeded: "Required Monthly",
      weeklyNeeded: "Required Weekly",
      dailyNeeded: "Required Daily",
      monthsRemaining: "Months Remaining",
      readinessScore: "Holistic Readiness",
      readinessTitle: "7 Dimensions of Marriage Readiness",
      readinessSubtitle: "A complete framework ensuring financial, housing, and relationship harmony without chaos.",
      antiChaosTitle: "Anti-Chaos Principle (§10)",
      expensesTitle: "Itemized Expense Management & Deadlines",
      expensesSubtitle: "Track furniture, appliances, hall, and payment schedules with zero stress.",
      newExpense: "Add Marriage Expense",
      editExpense: "Edit Expense Item",
      recordPayment: "Record Payment",
      paymentAmount: "Payment Amount (EGP)",
      expenseItem: "Item / Expense Name",
      category: "Category",
      estimated: "Estimated (EGP)",
      actual: "Actual (EGP)",
      paid: "Paid So Far (EGP)",
      remaining: "Remaining (EGP)",
      deadline: "Payment Deadline",
      priority: "Priority Tier",
      status: "Payment Status",
      categories: {
        furniture: "Furniture & Decor",
        finishing: "Finishing & Apartment",
        rentDeposit: "Rent Deposit & Insurance",
        hall: "Wedding Hall & Event",
        clothing: "Clothing & Outfits",
        photography: "Photography & Media",
        transport: "Transportation & Car",
        appliances: "Home Appliances",
        jewelry: "Gold & Jewelry",
        misc: "Miscellaneous & Contingency",
      },
      statuses: {
        planned: "Planned",
        inProgress: "In Progress",
        paid: "Fully Paid",
        dropped: "Dropped",
      },
      saveSuccess: "Expense item saved successfully!",
      paymentSuccess: "Payment recorded successfully!",
      deleteConfirm: "Are you sure you want to delete this expense item?",
    },
    relationshipPage: {
      title: "Relationship Engine (Us)",
      subtitle: "Shared ideas library, budget-aware recommendations, shared wishlist, and private weekly check-in.",
      tabs: {
        ideas: "Shared Ideas Library",
        wishlist: "Shared Wishlist",
        checkin: "Weekly Check-In",
      },
      budgetBannerTitle: "Budget-Aware Activity Recommendation",
      ideasTitle: "Shared Activities & Outing Ideas",
      ideasSubtitle: "A curated collection of quality time activities categorized by budget and style.",
      newIdea: "Add Shared Idea",
      editIdea: "Edit Idea",
      randomIdea: "Surprise Me (Random Picker)",
      randomIdeaPicked: "Here is your suggested activity for this week!",
      wishlistTitle: "Shared Wishlist & Gifts",
      wishlistSubtitle: "Special gifts and home items we want to get over time.",
      newWishlistItem: "Add Wishlist Item",
      bought: "Purchased",
      pending: "Pending",
      checkinTitle: "Private Weekly Reflection Check-In",
      checkinSubtitle: "5 reflection questions designed to nurture connection and reduce stress (§81).",
      checkinHistory: "Previous Check-Ins History",
      saveCheckin: "Save Weekly Reflection",
      checkinSavedSuccess: "Weekly relationship reflection saved securely!",
      privacyBadge: "Strict Privacy Enforced",
      privacyNotice: "Relationship data is strictly private and isolated from AI and general analytics (§83).",
      questions: {
        q_appreciation: "What did you deeply appreciate about your partner this week?",
        q_appreciation_ph: "E.g., Her encouragement during the tough deadline, the warm message...",
        q_connection: "How was the quality of our shared time and emotional closeness?",
        q_connection_ph: "E.g., Great walk on Friday, felt deeply connected and relaxed...",
        q_stressors: "What current stressors or pressures can we help each other with?",
        q_stressors_ph: "E.g., Wedding hall search is feeling overwhelming, let's divide the calls...",
        q_marriage_talk: "Do we need a calm conversation about wedding preparations?",
        q_marriage_talk_ph: "E.g., Review the budget for appliances next Saturday morning...",
        q_next_shared_time: "What is our planned shared activity or date for the coming week?",
        q_next_shared_time_ph: "E.g., Friday sunset walk + home dinner together...",
      },
      budgetTiers: {
        free: "Free (0 EGP)",
        low: "Low (< 300 EGP)",
        medium: "Medium (300–800 EGP)",
        high: "High (> 800 EGP)",
      },
      categories: {
        date: "Date & Outing",
        homeActivity: "Home & Cooking",
        conversation: "Deep Conversation",
        trip: "Trip & Travel",
        surprise: "Gift & Surprise",
      },
      wishlistCategories: {
        gift: "Personal Gift",
        home: "Home Item",
        experience: "Shared Experience",
        other: "Other",
      },
    },
    habitsPage: {
      title: "Habits & Consistency",
      subtitle: "Build core life and business habits with the 'Restart Today' anti-guilt philosophy.",
      todayHabits: "Today's Habits Check-off",
      allHabits: "All Active Habits",
      weeklyProgress: "Weekly Consistency",
      newHabit: "Add Habit",
      editHabit: "Edit Habit",
      habitName: "Habit Name",
      description: "Description / Purpose",
      category: "Category",
      targetPerWeek: "Target Days / Week",
      restartTodayTitle: "Restart Today Philosophy (§30)",
      restartTodayDesc: "Missed a day? No broken streaks or guilt. Just restart today with calm clarity.",
      restartButton: "Restart Today",
      streakDays: "Days Streak",
      completedDays: "Days Done",
      categories: {
        healthRoutine: "Health & Routine",
        deepWork: "Deep Work",
        revenue: "Sales & Revenue",
        learning: "Technical Learning",
        relationship: "Relationship & Us",
        finance: "Finance Tracking",
        personal: "Personal Growth",
      },
      saveSuccess: "Habit saved successfully!",
      deleteConfirm: "Are you sure you want to delete this habit?",
    },
    routinesPage: {
      title: "Daily Routines",
      subtitle: "Structured morning, workday, evening, and night anchors to eliminate decision fatigue (§28).",
      tabs: {
        morning: "Morning Anchor",
        workday: "Workday Flow",
        evening: "Evening Shutdown",
        night: "Night Wind-down",
      },
      routineItems: "Routine Checklist Items",
      newItem: "Add Routine Item",
      itemTitle: "Item Name",
      durationMin: "Estimated Duration (min)",
      totalDuration: "Total Routine Duration",
      resetDefaults: "Reset to Default Templates",
      resetConfirm: "Reset this routine to the system default template?",
      saveSuccess: "Routine updated successfully!",
      resetSuccess: "Routines reset to default templates successfully!",
    },
    dailyLog: {
      title: "Sleep & Energy Logger",
      subtitle: "Track physical energy and sleep rhythm to dynamically adapt daily planning capacity (§29).",
      sleepAt: "Bedtime",
      wokeAt: "Wake Time",
      hoursSlept: "Hours Slept",
      energy: "Energy Level (1–5)",
      focus: "Mental Focus (1–5)",
      morningLog: "Morning Wake & Energy Check",
      nightLog: "Night Log & Reflection",
      capacityNotice: "Adaptive Day Capacity",
      energyRatings: {
        1: "1 - Exhausted (Light mode advised)",
        2: "2 - Low energy",
        3: "3 - Moderate & steady",
        4: "4 - High energy & focused",
        5: "5 - Peak flow state!",
      },
      saveLog: "Save Daily Energy Log",
      savedSuccess: "Sleep & Energy log saved!",
    },
    timeTracking: {
      timerTitle: "Deep Work Task Timer",
      selectTask: "Select Task to Focus On",
      kind: "Session Type",
      start: "Start Focus Session",
      pause: "Pause",
      resume: "Resume",
      stop: "Finish & Log Session",
      focusPrompt: "How was your focus during this session?",
      focusRating: "Focus Quality (1–5)",
      sessionSaved: "Time session logged successfully!",
      weeklyTotal: "Total Focused Hours This Week",
      deepWork: "Deep Work",
      revenue: "Sales & Delivery",
      learning: "Learning",
      relationship: "Relationship",
      kinds: {
        deepWork: "Deep Work",
        delivery: "Client Delivery",
        sales: "Sales & Outreach",
        learning: "Technical Learning",
        product: "Product Lab",
        admin: "Admin & Operations",
        relationship: "Relationship & Us",
        rest: "Rest & Recovery",
      },
    },
    settings: {
      title: "Settings & System Configuration",
      subtitle:
        "Tune your identity, working schedule, marriage readiness milestones, and revenue targets.",
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
      aiPrivacy:
        "Allow AI access to Relationship notes (Default: Disabled for Privacy)",
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
      home: "الصفحة الرئيسية",
      command: "غرفة القيادة",
      revenueWork: "العمل والإيرادات",
      knowledgeGrowth: "المعرفة والنمو",
      lifeMission: "الحياة والرسالة",
      today: "خطة اليوم",
      tasks: "المهام والأولويات",
      goals: "شجرة الأهداف",
      freelance: "مسار الفريلانس",
      clients: "سجل العملاء",
      projects: "المشاريع",
      finances: "المالية والمحافظ",
      brainDump: "صندوق الأفكار",
      notes: "الملاحظات والمعرفة",
      reviews: "المراجعة الأسبوعية",
      marriage: "خطة الزواج",
      relationship: "العلاقة",
      habits: "العادات والاستمرارية",
      routines: "الروتين اليومي",
      calendar: "التقويم والروتين",
      analytics: "التحليلات والإحصائيات",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      capture: "تسجيل فكرة سريعة",
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
      backlog: "قائمة الانتظار",
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
      subtitle:
        "إدارة التنفيذ اليومي: حساب الأولويات الذكي، فصل مهام الـ Revenue عن الـ Build، وحماية المهام الراكدة.",
      actionItems: "عناصر العمل",
      newTask: "مهمة جديدة",
      editTask: "تعديل المهمة",
      taskTitle: "عنوان المهمة",
      taskTitlePlaceholder: "مثال: إرسال Proposal لعميل / بناء ميزة في Next.js",
      classification: "التصنيف",
      revenueType: "💰 عائد مباشر",
      productType: "🔨 بناء وتطوير",
      clientType: "👥 تسليم لعميل",
      priorityTier: "مستوى الأولوية",
      critical: "حرجة",
      high: "عالية",
      medium: "متوسطة",
      low: "منخفضة",
      impactWeights: "أوزان خوارزمية الأولويات (0 - 5)",
      revenueImpact: "الأثر المالي (3x)",
      strategicImpact: "الأثر الاستراتيجي (2x)",
      urgency: "مدى الإلحاح (2x)",
      effort: "الجهد المبذول (-1x)",
      scheduledDate: "تاريخ التنفيذ المجدول",
      deadline: "الموعد النهائي",
      topThree: "أهم 3 مهام ",
      markTopThree: "تحديد ضمن أهم 3 أولويات لليوم",
      linkedGoal: "الهدف المرتبط",
      linkedProject: "المشروع المرتبط",
      recurringRule: "قاعدة التكرار ",
      notes: "الملاحظات والخطوات الفرعية",
      staleTitle: "مهام راكدة بانتظار القرار ",
      staleDesc:
        "هذه المهام لم يتم تعديلها منذ أكثر من 3 أيام. قرر تنفيذها اليوم أو إعادة جدولتها أو حذفها.",
      noTasksTitle: "لا توجد مهام مطابقة",
      noTasksDesc: "أضف مهمة جديدة للتركيز على الـ Revenue أو بناء النظام.",
      taskDetails: "ملف المهمة وحساب الأولوية",
      scoreBreakdown: "تفصيل درجات خوارزمية الأولوية",
    },
    goals: {
      title: "شجرة الأهداف والتحول",
      subtitle:
        "ربط الرؤية الكبرى (Vision) بالأهداف السنوية والربع سنوية والمهام الأسبوعية.",
      newGoal: "هدف رئيسي جديد",
      editGoal: "تعديل الهدف",
      goalTitle: "عنوان الهدف",
      goalTitlePlaceholder:
        "مثال: الاستعداد المالي للزواج / بناء محرك الفريلانس",
      level: "مستوى الهدف",
      parentGoal: "الهدف الأب",
      targetValue: "القيمة المستهدفة",
      unit: "الوحدة",
      description: "الوصف والاستراتيجية",
      addChild: "إضافة هدف فرعي",
      noGoalsTitle: "لا توجد أهداف",
      noGoalsDesc:
        "ابدأ بتحديد هدف سنوي أو رؤية رئيسية لتربط بها مهامك اليومية.",
      goalDetails: "تفاصيل واستراتيجية الهدف",
    },
    leads: {
      title: "محرك الفريلانس وإيرادات الصفقات",
      subtitle:
        "دورة المبيعات الكاملة: استكشاف الفرص → تواصل (Outreach) → عروض (Proposals) → تفاوض → إغلاق وتسليم وتأكيد الدفع.",
      newLead: "فرصة جديدة",
      editLead: "تعديل بيانات الفرصة",
      leadTitle: "اسم الفرصة / العميل",
      leadTitlePlaceholder:
        "مثال: تطبيق ويب MERN / بوت ديسكورد لإدارة السيرفرات",
      source: "مصدر الفرصة",
      url: "رابط الإعلان / المنصة",
      stage: "المرحلة في المسار",
      expectedValue: "القيمة المتوقعة",
      probability: "احتمالية الإغلاق (0 - 1.0)",
      proposalAmount: "قيمة العرض المالي",
      proposalNotes: "تفاصيل وشروط العرض",
      followUpDate: "تاريخ المتابعة القادم",
      lostReason: "سبب عدم الإغلاق (إن وجد)",
      notes: "ملاحظات الاستكشاف وتفاصيل العميل",
      pipelineValue: "إجمالي قيمة الفرص النشطة",
      weightedValue: "القيمة الموزونة المتوقعة",
      salesTargets: "مستهدفات التواصل والمبيعات",
      weeklyProposals: "الـ Proposals المرسلة هذا الأسبوع",
      dailyOutreach: "تواصل اليوم",
      followUpQueue: "طابور المتابعة العاجل",
      noFollowUps: "لا توجد متابعات معلقة حالياً. استمر في التحرك!",
      logTouch: "تسجيل تواصل / مكالمة",
      convertToClient: "تحويل إلى عميل",
      recordPayment: "تسجيل دفعة مستلمة",
      moveStage: "نقل المرحلة",
      timeline: "سجل الأنشطة والمتابعات",
      noLeadsTitle: "لا توجد فرص نشطة حالياً",
      noLeadsDesc:
        "أضف فرصة عمل جديدة أو عميل محتمل لبدء المتابعة وإغلاق الصفقات.",
      leadDetails: "ملف تفاصيل الفرصة والتفاوض",
    },
    clients: {
      title: "دليل وسجل العملاء",
      subtitle:
        "إدارة علاقات العملاء، العقود الحالية، المبالغ المتبقية، والحفاظ على ولاء العملاء وتكرار الصفقات.",
      newClient: "عميل جديد",
      editClient: "تعديل بيانات العميل",
      clientName: "اسم العميل / الشركة",
      company: "الشركة / البراند",
      contact: "بيانات التواصل الأساسية",
      source: "قناة الاستقطاب",
      paymentStatus: "حالة الدفع",
      nextAction: "الخطوة القادمة",
      followUpDate: "تاريخ المتابعة",
      notes: "ملاحظات وسياق التعامل مع العميل",
      linkedProjects: "المشاريع النشطة والسابقة",
      noClientsTitle: "لا يوجد عملاء مسجلون",
      noClientsDesc:
        "حول الصفقات الرابحة إلى عملاء أو أضف عميلاً جديداً مباشرة.",
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
      subtitle:
        "متابعة مراحل التنفيذ البرمجي، المواعيد النهائية، متطلبات العملاء والمهام المرتبطة.",
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
      noProjectsDesc:
        "ابدأ مشروعاً جديداً أو حول فرصة فريلانس رابحة إلى مشروع تنفيذي.",
      projectDetails: "المواصفات والمتطلبات التقنية للمشروع",
      linkedTasks: "المهام التنفيذية المرتبطة",
    },
    finances: {
      title: "محرك المالية والمحافظ",
      subtitle:
        "تتبع مسارات الدخل، المصروفات، حساب أرصدة محافظ الادخار، ومسار الاستعداد المالي للزواج.",
      overviewTab: "نظرة عامة والتحليلات",
      transactionsTab: "سجل المعاملات المالية",
      walletsTab: "محافظ الادخار",
      marriageTab: "مستهدف الزواج",
      totalIncome: "إجمالي الدخل",
      totalExpenses: "إجمالي المصروفات",
      netSavings: "صافي الادخار",
      savingsRate: "معدل الادخار",
      wallets: "محافظ الادخار والسيولة",
      newWallet: "محفظة جديدة",
      editWallet: "تعديل المحفظة",
      walletName: "اسم المحفظة",
      walletKind: "نوع المحفظة",
      startingBalance: "الرصيد الابتدائي",
      targetAmount: "المبلغ المستهدف",
      currentBalance: "الرصيد الفعلي الحالي",
      netChange: "صافي الحركة المالية",
      transactions: "سجل المعاملات",
      newTransaction: "معاملة جديدة",
      editTransaction: "تعديل المعاملة",
      amount: "المبلغ (EGP)",
      transactionKind: "نوع المعاملة",
      income: "دخل وارد (+)",
      expense: "مصروف خارج (-)",
      category: "التصنيف",
      date: "التاريخ",
      source: "المصدر / جهة الدفع",
      note: "ملاحظات وتفاصيل",
      wallet: "المحفظة المرتبطة",
      selectWallet: "اختر المحفظة...",
      noWallet: "سيولة عامة (بدون محفظة)",
      linkedProject: "المشروع المرتبط",
      linkedLead: "الصفقة المرتبطة",
      isRecurring: "مصروف / دخل شهري متكرر",
      month: "الشهر",
      allCategories: "كافة التصنيفات",
      allKinds: "كافة الأنواع (دخل/مصروف)",
      noTransactionsTitle: "لا توجد معاملات مسجلة",
      noTransactionsDesc:
        "سجل حركات الدخل والمصروفات لتتبع تدفقاتك المالية بدقة.",
      noWalletsTitle: "لا توجد محافظ ادخار",
      noWalletsDesc:
        "أنشئ محافظ ادخار للزواج والطوارئ والبيزنس والاحتياطيات الشخصية.",
      transactionDetails: "ملف تفاصيل المعاملة المالية",
      walletDetails: "ملف المحفظة والتدفق المالي",
      incomeTargets: "مستهدفات الدخل الشهري",
      minIncome: "الحد الأدنى للأمان (15k)",
      comfortIncome: "المستوى المريح (30k)",
      stretchIncome: "المستهدف الطموح (50k)",
      marriageGoal: "مسار هدف الزواج",
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
    todayPlan: {
      title: "مهمة وخطة اليوم (Today's Mission)",
      subtitle: "ضبط ساعات العمل المتاحة، حسم الأولويات الـ 3 الكبرى، وضمان التوازن بين الدخل والحياة الشخصية.",
      energyLevel: "مستوى الطاقة والنشاط",
      energyLow: "طاقة منخفضة (يُنصح بتخفيف الحمل)",
      energyHigh: "طاقة عالية (جاهزية قصوى للعمل العميق)",
      availableHours: "ساعات العمل المتاحة",
      capacityGuard: "حارس السعة (Capacity Guard)",
      capacityOverload: "تنبيه: حجم المهام المخططة يتجاوز الساعات المتاحة اليوم!",
      capacityOptimal: "حجم المهام متوازن تماماً مع الساعات المتاحة.",
      hoursUnit: "ساعات",
      fridayRule: "قاعدة الجمعة مفعلة",
      fridayRuleDesc: "يوم مخصص للمراجعات الأسبوعية والتنظيم وتصفية الذهن بدون ضغط مشاريع ثقيلة.",
      focusQuestion: "الشيء الواحد الذي يجعل اليوم إنجازاً ناجحاً",
      focusQuestionPlaceholder: "لو لم أنجز سوى شيء واحد رئيسي اليوم، يجب أن يكون...",
      topThreeTitle: "الأولويات الثلاث الكبرى (Top 3)",
      topThreeSubtitle: "أهم 3 مهام محورية يجب إتمامها قبل أي شيء آخر اليوم.",
      topThreeEmpty: "لم يتم اختيار الـ Top 3 بعد. حدد أهم مهامك من القائمة بالأسفل.",
      actionTriad: "ثالوث الإنجاز اليومي المتوازن",
      actionTriadSubtitle: "خطوات محددة تضمن تقدماً يومياً في المال، والذات، والعلاقة.",
      moneyAction: "إجراء العائد والمال (Revenue)",
      moneyActionDesc: "خطوة مباشرة تدر دخلاً (بروبوزال، تسليم عميل، أو تواصل مبيعات).",
      personalAction: "إجراء الذات والصحة (Personal)",
      personalActionDesc: "عادة شخصية أساسية، تمرين رياضي، أو جلسة تعلم مركزة.",
      relationshipAction: "إجراء العلاقة والزواج (Relationship)",
      relationshipActionDesc: "تواصل مع الشريك، جلسة نقاش، أو خطوة في تجهيزات الزواج.",
      selectTask: "تعيين مهمة...",
      noTaskAssigned: "لم يتم تعيين مهمة",
      scheduledTasks: "مجدولة لليوم",
      overdueTasks: "مهام متأخرة ومرحلة",
      todayTasks: "مهام اليوم المقترحة",
      completeTask: "تعليم كمكتملة",
      incompleteTask: "إعادة كغير مكتملة",
      shutdownDay: "حسم وإغلاق اليوم (Shutdown)",
      shutdownTitle: "الإغلاق المسائي والمراجعة اليومية",
      shutdownSubtitle: "إنهاء اليوم بذهن صافٍ وتحديد نقطة الانطلاق لصباح الغد.",
      shutdownConfirm: "تأكيد إغلاق اليوم",
      dayClosed: "تم إغلاق اليوم بنجاح",
      dayClosedDesc: "عمل رائع اليوم! استمتع بوقتك واستعد لصباح جديد.",
      reopenDay: "إعادة فتح خطة اليوم",
      reopeningDay: "جاري الفتح...",
      tasksCompletedToday: "المهام المنجزة اليوم",
      rolloverTasks: "المهام المرحلة للغد",
      tomorrowFocus: "نقطة البداية لصباح الغد",
      tomorrowFocusPlaceholder: "ما هي أول مهمة ستبدأ بها فور استيقاظك غداً؟",
      shutdownNotes: "ملاحظات وانطباعات ختام اليوم",
      shutdownNotesPlaceholder: "دروس مستفادة، انتصارات سريعة، أو أفكار ملهمة...",
      generatePlan: "توليد خطة اليوم",
      planSaved: "تم حفظ وتحديث خطة اليوم بنجاح.",
    },
    dashboard: {
      greetingMorning: "صباح الخير والإنتاجية",
      greetingAfternoon: "طاب مساؤك",
      greetingEvening: "مساء الخير",
      commandSubtitle: "إليك الإحاطة التنفيذية المركزة ليومك عبر بطاقات القيادة الـ 5.",
      vitalFocus: "التركيز الحيوي لليوم",
      topThreeCardTitle: "أولويات الـ Top 3 لليوم",
      topThreeCardSubtitle: "إنجاز هذه المهام الثلاث يضمن فوزك باليوم.",
      moneyCardTitle: "مسار الزواج والمال",
      moneyCardSubtitle: "التقدم نحو مستهدف الـ 250,000 ج.م للزواج.",
      revenueCardTitle: "إجراء الدخل لليوم",
      revenueCardSubtitle: "الخطوة المباشرة لتحقيق التدفق المالي.",
      followupCardTitle: "متابعة العميل القادمة",
      followupCardSubtitle: "أقرب تواصل مطلوب في مسار المبيعات.",
      quickDumpCardTitle: "تسجيل فوري (Brain Dump)",
      quickDumpCardSubtitle: "سجل أفكارك ومهامك اللحظية دون مغادرة لوحة القيادة.",
      quickDumpPlaceholder: "اكتب الفكرة أو المهمة واضغط Enter...",
      quickDumpSubmit: "تسجيل",
      quickDumpSuccess: "تم الإرسال لصندوق الأفكار بنجاح!",
      noRevenueTask: "لا يوجد إجراء دخل محدد لليوم حتى الآن.",
      noFollowups: "رائع! جميع متابعات العملاء منجزة ومحدثة.",
      noTopThree: "لم تحدد أولويات الـ Top 3 لليوم بعد.",
      allDoneCelebration: "🎉 إنجاز استثنائي! تم إتمام جميع أولويات الـ Top 3 لليوم.",
      shutdownCountdown: "موعد الإغلاق المستهدف",
      viewTodayPlan: "فتح خطة اليوم الكاملة",
      viewFinances: "عرض محرك المالية",
      viewTasks: "عرض كافة المهام",
      viewPipeline: "عرض مسار الصفقات",
      marriageTarget: "مستهدف الزواج",
      monthlyTarget: "المستهدف الشهري",
      hoursRemaining: "ساعات متبقية",
      contactClient: "تواصل مع العميل",
    },
    capture: {
      title: "تسجيل سريع",
      placeholder: "ما الذي يدور في ذهنك؟ سجل فكرة أو مهمة أو معلومة فوراً...",
      hint: "اضغط حرف B في أي وقت للكتابة السريعة دون مغادرة صفحتك الحالية.",
      submit: "إرسال إلى Brain Dump",
      inboxTitle: "صندوق الأفكار",
      inboxSubtitle:
        "مساحة التفريغ الفوري لكتابة الأفكار والمهام الخام قبل تصنيفها.",
      noDumpsTitle: "الصندوق فارغ",
      noDumpsDesc: "اضغط B في أي وقت لتفريغ أفكارك ومهامك فور ظهورها.",
    },
    notesPage: {
      title: "محرك الملاحظات والمعرفة (Knowledge Base)",
      subtitle: "تدوين بمحرر Markdown غني، 13 مجلداً منظماً، ونظام وسوم ذكي للمشاريع والحياة.",
      newNote: "ملاحظة جديدة",
      editNote: "تعديل الملاحظة",
      noteTitle: "عنوان الملاحظة",
      noteTitlePlaceholder: "مثال: هيكلية بوت الديسكورد وخطة التسعير للعملاء",
      folder: "المجلد والتصنيف",
      selectFolder: "اختر المجلد...",
      allFolders: "كافة المجلدات",
      tags: "الوسوم (Tags)",
      tagsPlaceholder: "اكتب الوسم واضغط Enter...",
      content: "محتوى الملاحظة (Markdown)",
      contentPlaceholder: "اكتب ملاحظتك بصيغة Markdown. يدعم العناوين #، القوائم -، القوائم التفاعلية - [ ]، الأكواد ```، والاقتباسات >...",
      pinnedNotes: "الملاحظات المثبتة",
      allNotes: "كافة الملاحظات النشطة",
      archivedNotes: "الملاحظات المؤرشفة",
      pinNote: "تثبيت بالأعلى",
      unpinNote: "إلغاء التثبيت",
      archiveNote: "أرشفة الملاحظة",
      unarchiveNote: "استعادة من الأرشيف",
      deleteNote: "حذف الملاحظة",
      previewTab: "معاينة Markdown",
      editTab: "محرر النصوص",
      readingTime: "دقيقة قراءة",
      wordCount: "كلمة",
      noNotesTitle: "لا توجد ملاحظات في هذا المجلد",
      noNotesDesc: "أضف ملاحظة جديدة أو قم بتحويل فكرة من صندوق الـ Brain Dump.",
      noteDetails: "ملف تفاصيل الملاحظة",
      previousPage: "السابق",
      nextPage: "التالي",
      pageOf: "صفحة",
      showingNotes: "عرض",
      folders: {
        inbox: "صندوق الوارد (Inbox)",
        businessStrategy: "استراتيجية العمل (Business)",
        freelanceClients: "العملاء والمشاريع (Freelance)",
        discordBots: "بوتات ديسكورد والخدمات",
        productsSaas: "المنتجات ومختبر الـ SaaS",
        marriageHome: "تجهيزات الزواج والمنزل",
        financesInvestments: "المالية والاستثمارات",
        learningGrowth: "التعلم والتطوير الذاتي",
        habitsHealth: "الصحة والعادات اليومية",
        systemsWorkflows: "الأنظمة وسير العمل",
        decisionsLog: "سجل القرارات المحورية",
        templates: "القوالب والنماذج الجاهزة",
        archive: "الأرشيف",
      },
    },
    conversions: {
      convertTitle: "تحويل الفكرة الملتقطة",
      convertSubtitle: "حوّل هذه الفكرة الخام إلى كيان تنفيذي واضح وملموس.",
      convertToTask: "تحويل إلى مهمة تنفيذية (Task)",
      convertToNote: "تحويل إلى ملاحظة منظمة (Note)",
      convertToGoal: "تحويل إلى هدف استراتيجي (Goal)",
      convertToLead: "تحويل إلى عميل / صفقة (Lead)",
      taskTitle: "عنوان المهمة",
      taskArea: "مسار الحياة",
      taskPriority: "الأولوية",
      noteTitle: "عنوان الملاحظة",
      noteFolder: "المجلد المستهدف",
      goalTitle: "عنوان الهدف",
      goalCategory: "تصنيف الهدف",
      goalTimeframe: "الإطار الزمني",
      leadTitle: "اسم العميل / الصفقة",
      leadStage: "مرحلة المسار",
      leadValue: "القيمة التقديرية للصفقة (EGP)",
      convertedBadge: "تم التحويل",
      convertSuccess: "تم التحويل بنجاح وأرشفة الفكرة في سجل التحويلات.",
      convertedTo: "تم التحويل إلى",
      tabs: {
        inbox: "الوارد (غير المعالج)",
        converted: "المحولات سابقاً",
        all: "كافة الأفكار",
      },
    },
    reviewsPage: {
      title: "محرك المراجعات والتأمل الاستراتيجي",
      subtitle: "المراجعة الأسبوعية، قياس توازن الأبعاد الستة، وتخطيط أولويات الأسبوع القادم.",
      weeklyTab: "المراجعة الأسبوعية",
      dailyTab: "التأملات اليومية (Daily Reflections)",
      startWeeklyReview: "بدء مراجعة يوم الجمعة الأسبوعية",
      editReview: "تعديل المراجعة الأسبوعية",
      resumeWeeklyReview: "استكمال المراجعة",
      reviewHistory: "سجل المراجعات السابقة",
      noReviewsTitle: "لا توجد مراجعات مكتملة بعد",
      noReviewsDesc: "أكمل مراجعتك الأسبوعية الأولى يوم الجمعة لتقييم الأداء ورسم خطة الأسبوع الجديد.",
      dailyReflectionsTitle: "سجل التأملات والإنهاء اليومي",
      noDailyReflections: "لا توجد تأملات إغلاق يومي مسجلة بعد. أكمل إغلاق يومك من صفحة خطة اليوم (Today Plan).",
      weekOf: "أسبوع",
      overallBalance: "مؤشر التوازن العام",
      reviewDossier: "ملف المراجعة الكامل",
      step1Title: "١. الأرقام والواقع",
      step1Subtitle: "مراجعة الأرقام والبيانات المجمعة تلقائياً وإنجازات/تحديات الأسبوع.",
      step2Title: "٢. تقييم الأبعاد الستة",
      step2Subtitle: "تقييم مستوى التقدم في أركان الحياة والعمل الستة على مقياس من ١ إلى ٥.",
      step3Title: "٣. الاستراتيجية والدروس",
      step3Subtitle: "تحليل مشاريع العملاء، التعلم والتطوير، التجهيزات المنزلية، والعادات.",
      step4Title: "٤. خارطة الأسبوع القادم",
      step4Subtitle: "تحديد قرارات (ابدأ / توقف / ضاعف) وتثبيت أهم ٣ أولويات استراتيجية حتمية.",
      nextStep: "الخطوة التالية",
      prevStep: "الخطوة السابقة",
      completeReview: "إتمام واعتماد المراجعة",
      saveDraft: "حفظ كمسودة",
      savingReview: "جاري حفظ المراجعة...",
      reviewSavedSuccess: "تم حفظ وأرشفة المراجعة الأسبوعية بنجاح!",
      autoMetrics: {
        incomeThisWeek: "الدخل المحقق هذا الأسبوع",
        expensesThisWeek: "المصروفات هذا الأسبوع",
        netSavings: "صافي الادخار",
        tasksDone: "المهام المنجزة",
        highPriorityTasks: "مهام حاسمة وعالية الأولوية",
        proposalsSent: "العروض والصفقات",
        daysPlanned: "الأيام المخططة والمنفذة",
      },
      dimensions: {
        revenue: "الدخل والأرباح",
        revenueDesc: "توليد الدخل وإغلاق الصفقات وسرعة التدفق النقدي",
        career: "المهنة وتسليم المشاريع",
        careerDesc: "رضا العملاء، تسليم البرمجيات، وجودة الأكواد والتنفيذ",
        financial: "الانضباط المالي",
        financialDesc: "التحكم بالنفقات، وتغذية صناديق الادخار والاستثمار",
        relationship: "العلاقات والمنزل",
        relationshipDesc: "الوقت المشترك مع شريكة الحياة وتجهيزات الزواج والانسجام",
        execution: "التنفيذ والتركيز العميق",
        executionDesc: "جلسات العمل العميق، إتمام المهام الحاسمة، وقوة التركيز",
        routine: "الطاقة والعادات",
        routineDesc: "جودة النوم، استقرار الروتين الصباحي/المسائي، واللياقة البدنية",
      },
      questions: {
        q_wins: "ما هي أكبر إنجازاتك ونجاحاتك هذا الأسبوع؟",
        q_wins_ph: "مثال: إغلاق صفقة عميل جديد، تحقيق مستهدف ادخار، إنهاء هيكل الـ Auth البرمجي...",
        q_misses: "ما الذي تعثر أو تأخر عن موعده أو أفلت من الجدول؟",
        q_misses_ph: "مثال: تأخر إرسال عرض سعر لمدة يومين، تفويت تمرين النادي مرتين...",
        q_revenue_reflection: "تقييم الإيرادات والأرباح المحققة مقابل المستهدف:",
        q_revenue_reflection_ph: "كيف كان أداء الدخل بالنسبة لمستهدفك المالي بالجنيه؟ ما الأسباب؟",
        q_time_drain: "أين تسرب الوقت أو تشتت الطاقة الذهنية؟",
        q_time_drain_ph: "مثال: التنقل المستمر بين المحادثات في ديسكورد، عدم وضوح أولويات اليوم...",
        q_client_health: "حالة مشاريع العملاء والصفقات القائمة:",
        q_client_health_ph: "حالة تسليمات العملاء النشطين، العروض المعلقة، والمتابعات المطلوبة...",
        q_learning_growth: "التعلم الاستراتيجي والمهارات المكتسبة:",
        q_learning_growth_ph: "ما المفهوم التقني أو العملي الذي أتقنته أو قرأته هذا الأسبوع؟",
        q_relationship_check: "تجهيزات الزواج والعلاقات الأسرية:",
        q_relationship_check_ph: "اللحظات المشتركة، الدعم المعنوي، والتقدم في قائمة تجهيزات الزواج...",
        q_habits_energy: "مستوى الطاقة الجسدية والنوم واستقرار الروتين:",
        q_habits_energy_ph: "كيف كان التزامك بموعد الإغلاق المسائي، ساعات النوم، ولياقتك البدنية؟",
        q_start: "ما الذي يجب أن تبدأ بفعله (START) في الأسبوع القادم؟",
        q_start_ph: "مثال: تخصيص أول ساعتين صباحاً للعمل العميق قبل قراءة الرسائل...",
        q_stop: "ما الذي يجب أن تتوقف عنه تماماً (STOP) فوراً؟",
        q_stop_ph: "مثال: التوقف عن الرد على رسائل العمل غير الطارئة بعد ٨ مساءً...",
        q_continue: "ما الذي نجح بامتياز وتريد مضاعفته (DOUBLE DOWN)؟",
        q_continue_ph: "مثال: طقس الإغلاق اليومي منحني صفاءً ذهنياً ممتازاً...",
        q_next_top_three: "أهم ٣ أولويات استراتيجية حتمية للأسبوع القادم (Top 3 Priorities):",
        q_next_top_three_ph: "١. إطلاق وتطبيق النسخة الأولى للعميل\n٢. تحويل دفعة الادخار للزواج\n٣. إرسال ٣ عروض لعملاء جدد",
        q_system_tweak: "تعديل عملي واحد لتحسين نظام أو بيئة أو جدول عملك:",
        q_system_tweak_ph: "مثال: حجز عصر كل جمعة في التقويم كموعد مقدس للمراجعة الأسبوعية...",
      },
      convertTopThree: "إنشاء الأولويات الثلاث كمهام تنفيذية في الأسبوع القادم",
      topThreeConvertedSuccess: "تم إنشاء المهام الثلاث للأسبوع القادم بنجاح!",
    },
    marriagePage: {
      title: "مهمة الزواج (Marriage Mission)",
      subtitle: "متابعة مستهدف الـ ٢٥٠,٠٠٠ ج.م، المصروفات التفصيلية ومواعيد السداد، والأبعاد السبعة للجاهزية الشاملة.",
      targetAmount: "المستهدف الإجمالي",
      savedSoFar: "المدخر في صندوق الزواج",
      remainingGap: "المتبقي للوصول للمستهدف",
      monthlyNeeded: "المطلوب شهرياً",
      weeklyNeeded: "المطلوب أسبوعياً",
      dailyNeeded: "المطلوب يومياً",
      monthsRemaining: "أشهر متبقية للموعد",
      readinessScore: "مؤشر الجاهزية الشاملة",
      readinessTitle: "أبعاد الجاهزية السبعة للزواج",
      readinessSubtitle: "منهجية متكاملة لضمان الاستعداد المالي والسكني والعاطفي بهدوء ووضوح.",
      antiChaosTitle: "قاعدة منع الفوضى والتشتت (§10)",
      expensesTitle: "سجل المصروفات ومواعيد السداد",
      expensesSubtitle: "جدولة وتتبع تكاليف الأثاث والأجهزة والقاعة ومقدم الإيجار بدون ضغوط.",
      newExpense: "إضافة مصروف جديد",
      editExpense: "تعديل بند المصروف",
      recordPayment: "تسجيل دفعة مسددة",
      paymentAmount: "المبلغ المسدد (EGP)",
      expenseItem: "اسم البند / المصروف",
      category: "التصنيف",
      estimated: "التقديري (EGP)",
      actual: "الفعلي (EGP)",
      paid: "المسدد حتى الآن (EGP)",
      remaining: "المتبقي للسداد (EGP)",
      deadline: "موعد الاستحقاق",
      priority: "الأولوية",
      status: "حالة السداد",
      categories: {
        furniture: "الأثاث والعفش",
        finishing: "التشطيبات والديكور",
        rentDeposit: "مقدم وتأمين الإيجار",
        hall: "القاعة وحفل الزفاف",
        clothing: "الملابس ومستلزمات الفرح",
        photography: "التصوير والميديا",
        transport: "الانتقالات والسيارة",
        appliances: "الأجهزة الكهربائية",
        jewelry: "الذهب والشبكة",
        misc: "نثريات وطوارئ التجهيز",
      },
      statuses: {
        planned: "مخطط",
        inProgress: "قيد السداد",
        paid: "تم السداد بالكامل",
        dropped: "ملغي",
      },
      saveSuccess: "تم حفظ بند المصروف بنجاح!",
      paymentSuccess: "تم تسجيل الدفعة المسددة بنجاح!",
      deleteConfirm: "هل أنت متأكد من رغبتك في حذف هذا المصروف؟",
    },
    relationshipPage: {
      title: "محرك العلاقات (Us)",
      subtitle: "بنك الأفكار المشتركة، مقترحات تراعي الميزانية، قائمة الرغبات، والتقييم الأسبوعي الخاص.",
      tabs: {
        ideas: "بنك الأفكار المشتركة",
        wishlist: "قائمة الرغبات والهدايا",
        checkin: "التقييم الأسبوعي المشترك",
      },
      budgetBannerTitle: "اقتراح الأنشطة وفقاً للوضع المالي الحالي",
      ideasTitle: "أفكار الخروجات والأنشطة المشتركة",
      ideasSubtitle: "مجموعة منتقاة لقضاء أوقات نوعية مميزة مصنفة حسب التكلفة والأسلوب.",
      newIdea: "إضافة فكرة جديدة",
      editIdea: "تعديل الفكرة",
      randomIdea: "اقترح نشاطاً عشوائياً (Surprise Me)",
      randomIdeaPicked: "إليك النشاط المقترح لقضاء وقت رائع هذا الأسبوع!",
      wishlistTitle: "قائمة الرغبات والهدايا المشتركة",
      wishlistSubtitle: "الهدايا ومستلزمات المنزل التي نخطط لاقتنائها بمرور الوقت.",
      newWishlistItem: "إضافة رغبة / هدية",
      bought: "تم الاقتناء",
      pending: "قيد الانتظار",
      checkinTitle: "التقييم الأسبوعي الخاص والاتصال الإنساني",
      checkinSubtitle: "٥ أسئلة تأملية لتعزيز الترابط والتخفيف من ضغوطات التجهيز (§81).",
      checkinHistory: "سجل التقييمات الأسبوعية السابقة",
      saveCheckin: "حفظ التقييم الأسبوعي",
      checkinSavedSuccess: "تم حفظ التقييم الأسبوعي بأمان وخصوصية تامة!",
      privacyBadge: "خصوصية مشددة ومحمية برمجياً",
      privacyNotice: "بيانات العلاقة مشفرة ومستثناة برمجياً من الـ AI والتحليلات العامة (§83).",
      questions: {
        q_appreciation: "ما الذي قدّرته وشعرت بالامتنان تجاهه من شريكتك هذا الأسبوع؟",
        q_appreciation_ph: "مثال: دعمها لي في ضغط العمل، رسالتها الصباحية الجميلة...",
        q_connection: "كيف كانت جودة وقتنا المشترك ومستوى القرب والانسجام؟",
        q_connection_ph: "مثال: تمشية يوم الجمعة كانت رائعة وشعرنا براحة وصفاء...",
        q_stressors: "ما هي الضغوطات الحالية التي يمكننا مساعدة بعضنا فيها؟",
        q_stressors_ph: "مثال: البحث عن القاعة يسبب بعض التوتر، دعنا نقسم التواصل...",
        q_marriage_talk: "هل نحتاج إلى جلسة هادئة لمناقشة أي تفاصيل في تجهيزات الزواج؟",
        q_marriage_talk_ph: "مثال: مراجعة ميزانية الأجهزة الكهربائية صباح السبت القادم...",
        q_next_shared_time: "ما هو النشاط أو الموعد المشترك المخطط له للأسبوع القادم؟",
        q_next_shared_time_ph: "مثال: تمشية وقت الغروب يوم الجمعة + عشاء منزلي معاً...",
      },
      budgetTiers: {
        free: "مجاني (0 ج.م)",
        low: "بسيط (< 300 ج.م)",
        medium: "متوسط (300–800 ج.م)",
        high: "مميز (> 800 ج.م)",
      },
      categories: {
        date: "خروجة وموعد",
        homeActivity: "نشاط منزلي وطبخ",
        conversation: "جلسة حوار عميق",
        trip: "سفر وتجربة جديدة",
        surprise: "مفاجأة وهدية",
      },
      wishlistCategories: {
        gift: "هدية شخصية",
        home: "مستلزمات منزل",
        experience: "تجربة مشتركة",
        other: "أخرى",
      },
    },
    habitsPage: {
      title: "العادات والاستمرارية اليومية",
      subtitle: "بناء وتثبيت عادات الحياة والعمل مع فلسفة 'Restart Today' الخالية من جلد الذات.",
      todayHabits: "تسجيل عادات اليوم",
      allHabits: "كافة العادات النشطة",
      weeklyProgress: "الالتزام الأسبوعي",
      newHabit: "إضافة عادة جديدة",
      editHabit: "تعديل العادة",
      habitName: "اسم العادة",
      description: "الوصف والهدف",
      category: "التصنيف",
      targetPerWeek: "المستهدف (أيام / أسبوع)",
      restartTodayTitle: "فلسفة ابدأ اليوم من جديد (§30)",
      restartTodayDesc: "فاتك يوم؟ لا توجد سلاسل تفشل أو جلد ذات. ابدأ اليوم من جديد بكل هدوء ووضوح.",
      restartButton: "ابدأ من جديد اليوم",
      streakDays: "أيام متتالية",
      completedDays: "أيام منجزة",
      categories: {
        healthRoutine: "الصحة والروتين",
        deepWork: "العمل العميق",
        revenue: "المبيعات والدخل",
        learning: "التعلم والتطوير",
        relationship: "العلاقات والأسرة",
        finance: "الانضباط المالي",
        personal: "النمو الشخصي",
      },
      saveSuccess: "تم حفظ العادة بنجاح!",
      deleteConfirm: "هل أنت متأكد من رغبتك في حذف هذه العادة؟",
    },
    routinesPage: {
      title: "الروتين اليومي (Routines)",
      subtitle: "محطات اليوم الأساسية (الصباح، العمل، المساء، وقبل النوم) لإلغاء إرهاق اتخاذ القرار (§28).",
      tabs: {
        morning: "روتين الصباح",
        workday: "روتين العمل",
        evening: "روتين المساء والإغلاق",
        night: "روتين قبل النوم",
      },
      routineItems: "بنود وخطوات الروتين",
      newItem: "إضافة بند للروتين",
      itemTitle: "عنوان الخطوة / النشاط",
      durationMin: "المدة التقديرية (دقيقة)",
      totalDuration: "إجمالي مدة الروتين",
      resetDefaults: "استعادة القوالب الافتراضية",
      resetConfirm: "هل تريد استعادة قالب هذا الروتين إلى الإعدادات الافتراضية للنظام؟",
      saveSuccess: "تم تحديث الروتين بنجاح!",
      resetSuccess: "تمت استعادة قوالب الروتين الافتراضية بنجاح!",
    },
    dailyLog: {
      title: "مسجل النوم والطاقة اليومي",
      subtitle: "متابعة ساعات النوم ومستوى الطاقة للتكييف التلقائي لسعة تخطيط اليوم (§29).",
      sleepAt: "وقت النوم",
      wokeAt: "وقت الاستيقاظ",
      hoursSlept: "ساعات النوم",
      energy: "مستوى الطاقة (1–5)",
      focus: "مستوى التركيز الذهني (1–5)",
      morningLog: "تسجيل بداية اليوم والطاقة الصباحية",
      nightLog: "تسجيل الإغلاق المسائي وساعات النوم",
      capacityNotice: "السعة التكيفية لليوم",
      energyRatings: {
        1: "1 - إرهاق شديد (ينصح بالوضع الخفيف)",
        2: "2 - طاقة منخفضة",
        3: "3 - طاقة معتدلة ومستقرة",
        4: "4 - طاقة وتركيز عالي",
        5: "5 - قمة النشاط والتركيز!",
      },
      saveLog: "حفظ سجل الطاقة والنوم",
      savedSuccess: "تم حفظ سجل الطاقة والنوم بنجاح!",
    },
    timeTracking: {
      timerTitle: "مؤقت العمل العميق الذكي",
      selectTask: "اختر المهمة للتركيز عليها",
      kind: "نوع الجلسة",
      start: "بدء جلسة التركيز",
      pause: "إيقاف مؤقت",
      resume: "استئناف",
      stop: "إنهاء وحفظ الجلسة",
      focusPrompt: "كيف كان مستوى تركيزك خلال هذه الجلسة؟",
      focusRating: "جودة التركيز (1–5)",
      sessionSaved: "تم تسجيل جلسة العمل العميق بنجاح!",
      weeklyTotal: "إجمالي ساعات التركيز هذا الأسبوع",
      deepWork: "العمل العميق",
      revenue: "المبيعات والتسليم",
      learning: "التعلم",
      relationship: "العلاقات",
      kinds: {
        deepWork: "عمل عميق",
        delivery: "تسليم مشاريع العملاء",
        sales: "مبيعات وتواصل",
        learning: "تعلم تقني",
        product: "مختبر المنتجات",
        admin: "إدارة وتنظيم",
        relationship: "العلاقات والأسرة",
        rest: "راحة واستشفاء",
      },
    },
    settings: {
      title: "الإعدادات وضبط النظام",
      subtitle: "تخصيص الهوية ومواعيد العمل وأهداف الزواج ومستهدفات الدخل.",
      tabs: {
        personal: "البيانات وجدول العمل",
        marriage: "أهداف الزواج والادخار",
        work: "مستهدفات الدخل والـ Sales",
        privacy: "التفضيلات والخصوصية",
      },
      displayName: "الاسم",
      timezone: "المنطقة الزمنية",
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
      outreachPerDay: "مستهدف التواصل اليومي",
      sharedDay: "يوم العلاقة والأسرة المشترك",
      defaultBudget: "ميزانية الخروج الافتراضية",
      aiEnabled: "تفعيل ميزات الذكاء الاصطناعي (Phase 14)",
      aiPrivacy:
        "السماح للـ AI بالوصول لملاحظات العلاقات (معطل افتراضياً للخصوصية)",
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
