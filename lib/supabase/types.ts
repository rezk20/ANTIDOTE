/**
 * Database types for the LIFE OS schema.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type GoalLevel = "vision" | "year" | "quarter" | "month" | "week";
export type GoalStatus = "active" | "achieved" | "dropped" | "paused";
export type TaskType =
  | "revenue"
  | "career"
  | "client"
  | "learning"
  | "product"
  | "finance"
  | "marriage"
  | "relationship"
  | "personal"
  | "admin"
  | "health_routine";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus =
  | "backlog"
  | "planned"
  | "in_progress"
  | "done"
  | "dropped"
  | "someday";
export type BucketKind =
  | "marriage"
  | "emergency"
  | "business"
  | "personal"
  | "hardware"
  | "travel"
  | "apartment"
  | "other";
export type TransactionKind = "income" | "expense";
export type ProjectKind = "client" | "internal" | "experimental" | "learning";
export type ProjectStatus = "idea" | "active" | "paused" | "done" | "killed";
export type ClientStatus = "active" | "past" | "lost";
export type PaymentStatus = "none" | "pending" | "partial" | "paid";
export type FollowUpStatus = "none" | "asked" | "received" | "declined";
export type LeadStage =
  | "new"
  | "qualified"
  | "contacted"
  | "proposal_sent"
  | "follow_up"
  | "call"
  | "negotiation"
  | "won"
  | "in_progress"
  | "delivered"
  | "paid"
  | "review_requested"
  | "referral_requested"
  | "lost";
export type LeadEventType =
  | "discovered"
  | "outreach"
  | "proposal_sent"
  | "follow_up"
  | "call"
  | "negotiation"
  | "won"
  | "lost"
  | "delivered"
  | "invoiced"
  | "paid"
  | "review_requested"
  | "referral_received"
  | "note";
export type BrainDumpStatus = "inbox" | "converted" | "archived";
export type ReviewType = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export type MarriageExpenseCategory =
  | "furniture"
  | "finishing"
  | "rent_deposit"
  | "hall"
  | "clothing"
  | "photography"
  | "transport"
  | "appliances"
  | "jewelry"
  | "misc";
export type MarriageExpenseStatus = "planned" | "in_progress" | "paid" | "dropped";
export type ServiceComplexity = "low" | "medium" | "high";
export type OutreachTemplateKind =
  | "cold_dm"
  | "email"
  | "proposal"
  | "follow_up"
  | "referral_request"
  | "testimonial_request";

export type ProfileRow = {
  id: string;
  display_name: string;
  email: string | null;
  timezone: string;
  currency: string;
  weekly_off_day: string;
  agent_api_key: string | null;
  settings: Json;
  created_at: string;
  updated_at: string;
};

export type GoalRow = {
  id: string;
  user_id: string;
  level: GoalLevel;
  parent_id: string | null;
  title: string;
  description: string | null;
  period_start: string | null;
  period_end: string | null;
  target_value: number | null;
  unit: string | null;
  status: GoalStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TaskRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  area: string | null;
  task_type: TaskType;
  priority: TaskPriority;
  effort: number | null;
  duration_min: number | null;
  scheduled_date: string | null;
  deadline: string | null;
  status: TaskStatus;
  is_top_three: boolean;
  recurring_rule: string | null;
  recurring_source_id: string | null;
  energy_level: number | null;
  revenue_impact: number | null;
  strategic_impact: number | null;
  relationship_impact: number | null;
  urgency: number | null;
  goal_id: string | null;
  project_id: string | null;
  lead_id: string | null;
  completed_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BucketRow = {
  id: string;
  user_id: string;
  name: string;
  kind: BucketKind;
  target_amount: number | null;
  starting_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TransactionRow = {
  id: string;
  user_id: string;
  amount: number;
  kind: TransactionKind;
  category: string;
  occurred_on: string;
  source: string | null;
  project_id: string | null;
  lead_id: string | null;
  bucket_id: string | null;
  note: string | null;
  is_recurring: boolean;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type ProjectRow = {
  id: string;
  user_id: string;
  name: string;
  kind: ProjectKind;
  brief: string | null;
  requirements: string | null;
  status: ProjectStatus;
  client_id: string | null;
  budget: number | null;
  started_on: string | null;
  deadline: string | null;
  meta: Json;
  created_at: string;
  updated_at: string;
};

export type ClientRow = {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  contact: string | null;
  source: string | null;
  status: ClientStatus;
  started_on: string | null;
  deadline: string | null;
  payment_status: PaymentStatus | null;
  notes: string | null;
  next_action: string | null;
  follow_up_date: string | null;
  testimonial_status: FollowUpStatus | null;
  referral_status: FollowUpStatus | null;
  created_at: string;
  updated_at: string;
};

export type LeadRow = {
  id: string;
  user_id: string;
  title: string;
  source: string | null;
  url: string | null;
  stage: LeadStage;
  expected_value: number | null;
  probability: number | null;
  client_id: string | null;
  proposal_amount: number | null;
  proposal_sent_at: string | null;
  proposal_notes: string | null;
  last_contact_at: string | null;
  next_follow_up_at: string | null;
  lost_reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadEventRow = {
  id: string;
  user_id: string;
  lead_id: string;
  event_type: LeadEventType;
  occurred_at: string;
  amount: number | null;
  transaction_id: string | null;
  note: string | null;
  created_at: string;
};

export type MarriageExpenseRow = {
  id: string;
  user_id: string;
  item: string;
  category: MarriageExpenseCategory | null;
  estimated_cost: number;
  actual_cost: number | null;
  paid_amount: number;
  deadline: string | null;
  priority: TaskPriority;
  status: MarriageExpenseStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ServiceRow = {
  id: string;
  user_id: string;
  name: string;
  base_price: number | null;
  min_price: number | null;
  estimated_hours: number | null;
  complexity: ServiceComplexity | null;
  profitability: number | null;
  portfolio_example: string | null;
  delivery_estimate: string | null;
  maintenance_plan: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OutreachTemplateRow = {
  id: string;
  user_id: string;
  name: string;
  kind: OutreachTemplateKind;
  body: string;
  created_at: string;
  updated_at: string;
};

export type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type BrainDumpRow = {
  id: string;
  user_id: string;
  content: string;
  status: BrainDumpStatus;
  converted_type: string | null;
  converted_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DayPlanStatus = "draft" | "active" | "closed";

export type DayPlanRow = {
  id: string;
  user_id: string;
  plan_date: string;
  available_hours: number;
  energy: number;
  focus_question_answer: string | null;
  money_action_task_id: string | null;
  personal_action_task_id: string | null;
  relationship_action_task_id: string | null;
  shutdown_time: string | null;
  status: DayPlanStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type WeekPlanRow = {
  id: string;
  user_id: string;
  week_start: string;
  outcomes: string[];
  allocation: Json;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewRow = {
  id: string;
  user_id: string;
  review_type: ReviewType;
  period_start: string;
  period_end: string | null;
  answers: Json;
  scores: Json;
  created_at: string;
  updated_at: string;
};

export type RelationshipIdeaCategory =
  | "date"
  | "home_activity"
  | "conversation"
  | "trip"
  | "surprise";
export type RelationshipBudgetTier = "free" | "low" | "medium" | "high";
export type RelationshipWishlistCategory = "gift" | "home" | "experience" | "other";

export type RelationshipIdeaRow = {
  id: string;
  user_id: string;
  title: string;
  category: RelationshipIdeaCategory;
  budget_tier: RelationshipBudgetTier;
  estimated_cost: number;
  notes: string | null;
  is_completed: boolean;
  last_done_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RelationshipWishlistRow = {
  id: string;
  user_id: string;
  title: string;
  category: RelationshipWishlistCategory;
  estimated_price: number | null;
  url: string | null;
  priority: TaskPriority;
  is_bought: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type RelationshipCheckinRow = {
  id: string;
  user_id: string;
  checkin_date: string;
  answers: Json;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type HabitCategory =
  | "health_routine"
  | "deep_work"
  | "revenue"
  | "learning"
  | "relationship"
  | "finance"
  | "personal";

export type RoutineTimeOfDay = "morning" | "workday" | "evening" | "night";

export type TimeEntryKind =
  | "deep_work"
  | "delivery"
  | "sales"
  | "learning"
  | "product"
  | "admin"
  | "relationship"
  | "rest";

export type HabitRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: HabitCategory;
  target_per_week: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type HabitLogRow = {
  id: string;
  user_id: string;
  habit_id: string;
  log_date: string;
  note: string | null;
  created_at: string;
};

export type RoutineRow = {
  id: string;
  user_id: string;
  name: string;
  time_of_day: RoutineTimeOfDay;
  items: Json;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type DailyLogRow = {
  id: string;
  user_id: string;
  log_date: string;
  sleep_at: string | null;
  woke_at: string | null;
  hours_slept: number | null;
  energy: number | null;
  focus: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type TimeEntryRow = {
  id: string;
  user_id: string;
  task_id: string | null;
  project_id: string | null;
  kind: TimeEntryKind;
  started_at: string;
  ended_at: string | null;
  duration_min: number;
  focus_rating: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type DecisionStatus = "open" | "decided" | "reviewed";

export type DecisionOption = {
  id: string;
  label: string;
  notes?: string;
};

export type DecisionRow = {
  id: string;
  user_id: string;
  title: string;
  why_now: string | null;
  options: Json; // DecisionOption[]
  upside: string | null;
  downside: string | null;
  cost: string | null;
  time_required: string | null;
  risk: string | null;
  worst_case: string | null;
  best_case: string | null;
  reversible: boolean;
  decision: string | null;
  review_date: string | null;
  status: DecisionStatus;
  created_at: string;
  updated_at: string;
};

export type OpportunityKind =
  | "job"
  | "freelance"
  | "discord_client"
  | "remote"
  | "partnership"
  | "product"
  | "other";

export type OpportunityRisk = "low" | "medium" | "high";
export type OpportunityStatus = "open" | "pursuing" | "won" | "dropped";

export type OpportunityRow = {
  id: string;
  user_id: string;
  title: string;
  kind: OpportunityKind;
  expected_value: number;
  probability: number;
  time_required_hours: number;
  risk: OpportunityRisk;
  next_action: string | null;
  status: OpportunityStatus;
  created_at: string;
  updated_at: string;
};

export type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow>;
        Update: Partial<ProfileRow>;
        Relationships: GenericRelationship[];
      };
      goals: {
        Row: GoalRow;
        Insert: Partial<GoalRow> & { user_id: string; level: GoalLevel; title: string };
        Update: Partial<GoalRow>;
        Relationships: GenericRelationship[];
      };
      tasks: {
        Row: TaskRow;
        Insert: Partial<TaskRow> & { user_id: string; title: string; task_type: TaskType };
        Update: Partial<TaskRow>;
        Relationships: GenericRelationship[];
      };
      buckets: {
        Row: BucketRow;
        Insert: Partial<BucketRow> & { user_id: string; name: string; kind: BucketKind };
        Update: Partial<BucketRow>;
        Relationships: GenericRelationship[];
      };
      transactions: {
        Row: TransactionRow;
        Insert: Partial<TransactionRow> & {
          user_id: string;
          amount: number;
          kind: TransactionKind;
          category: string;
          occurred_on: string;
        };
        Update: Partial<TransactionRow>;
        Relationships: GenericRelationship[];
      };
      projects: {
        Row: ProjectRow;
        Insert: Partial<ProjectRow> & { user_id: string; name: string; kind: ProjectKind };
        Update: Partial<ProjectRow>;
        Relationships: GenericRelationship[];
      };
      clients: {
        Row: ClientRow;
        Insert: Partial<ClientRow> & { user_id: string; name: string };
        Update: Partial<ClientRow>;
        Relationships: GenericRelationship[];
      };
      leads: {
        Row: LeadRow;
        Insert: Partial<LeadRow> & { user_id: string; title: string };
        Update: Partial<LeadRow>;
        Relationships: GenericRelationship[];
      };
      lead_events: {
        Row: LeadEventRow;
        Insert: Partial<LeadEventRow> & {
          user_id: string;
          lead_id: string;
          event_type: LeadEventType;
        };
        Update: Partial<LeadEventRow>;
        Relationships: GenericRelationship[];
      };
      marriage_expenses: {
        Row: MarriageExpenseRow;
        Insert: Partial<MarriageExpenseRow> & { user_id: string; item: string };
        Update: Partial<MarriageExpenseRow>;
        Relationships: GenericRelationship[];
      };
      services: {
        Row: ServiceRow;
        Insert: Partial<ServiceRow> & { user_id: string; name: string };
        Update: Partial<ServiceRow>;
        Relationships: GenericRelationship[];
      };
      outreach_templates: {
        Row: OutreachTemplateRow;
        Insert: Partial<OutreachTemplateRow> & { user_id: string; name: string; kind: OutreachTemplateKind; body: string };
        Update: Partial<OutreachTemplateRow>;
        Relationships: GenericRelationship[];
      };
      notes: {
        Row: NoteRow;
        Insert: Partial<NoteRow> & { user_id: string };
        Update: Partial<NoteRow>;
        Relationships: GenericRelationship[];
      };
      brain_dumps: {
        Row: BrainDumpRow;
        Insert: Partial<BrainDumpRow> & { user_id: string; content: string };
        Update: Partial<BrainDumpRow>;
        Relationships: GenericRelationship[];
      };
      day_plans: {
        Row: DayPlanRow;
        Insert: Partial<DayPlanRow> & { user_id: string; plan_date: string };
        Update: Partial<DayPlanRow>;
        Relationships: GenericRelationship[];
      };
      week_plans: {
        Row: WeekPlanRow;
        Insert: Partial<WeekPlanRow> & { user_id: string; week_start: string };
        Update: Partial<WeekPlanRow>;
        Relationships: GenericRelationship[];
      };
      reviews: {
        Row: ReviewRow;
        Insert: Partial<ReviewRow> & {
          user_id: string;
          review_type: ReviewType;
          period_start: string;
        };
        Update: Partial<ReviewRow>;
        Relationships: GenericRelationship[];
      };
      relationship_ideas: {
        Row: RelationshipIdeaRow;
        Insert: Partial<RelationshipIdeaRow> & { user_id: string; title: string };
        Update: Partial<RelationshipIdeaRow>;
        Relationships: GenericRelationship[];
      };
      relationship_wishlist: {
        Row: RelationshipWishlistRow;
        Insert: Partial<RelationshipWishlistRow> & { user_id: string; title: string };
        Update: Partial<RelationshipWishlistRow>;
        Relationships: GenericRelationship[];
      };
      relationship_checkins: {
        Row: RelationshipCheckinRow;
        Insert: Partial<RelationshipCheckinRow> & { user_id: string };
        Update: Partial<RelationshipCheckinRow>;
        Relationships: GenericRelationship[];
      };
      habits: {
        Row: HabitRow;
        Insert: Partial<HabitRow> & { user_id: string; name: string };
        Update: Partial<HabitRow>;
        Relationships: GenericRelationship[];
      };
      habit_logs: {
        Row: HabitLogRow;
        Insert: Partial<HabitLogRow> & { user_id: string; habit_id: string };
        Update: Partial<HabitLogRow>;
        Relationships: GenericRelationship[];
      };
      routines: {
        Row: RoutineRow;
        Insert: Partial<RoutineRow> & { user_id: string; name: string; time_of_day: RoutineTimeOfDay };
        Update: Partial<RoutineRow>;
        Relationships: GenericRelationship[];
      };
      daily_logs: {
        Row: DailyLogRow;
        Insert: Partial<DailyLogRow> & { user_id: string; log_date: string };
        Update: Partial<DailyLogRow>;
        Relationships: GenericRelationship[];
      };
      time_entries: {
        Row: TimeEntryRow;
        Insert: Partial<TimeEntryRow> & { user_id: string };
        Update: Partial<TimeEntryRow>;
        Relationships: GenericRelationship[];
      };
      decisions: {
        Row: DecisionRow;
        Insert: Partial<DecisionRow> & { user_id: string; title: string };
        Update: Partial<DecisionRow>;
        Relationships: GenericRelationship[];
      };
      opportunities: {
        Row: OpportunityRow;
        Insert: Partial<OpportunityRow> & { user_id: string; title: string };
        Update: Partial<OpportunityRow>;
        Relationships: GenericRelationship[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
