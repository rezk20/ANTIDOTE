/**
 * Central copy & tone dictionary for LIFE OS.
 *
 * Rules (§70, §71):
 *   - Non-punitive: no guilt, no red-shaming, no streak anxiety.
 *   - Clear & actionable: prioritize "what to do next" over past failures.
 *   - Reality-grounded: calm, objective assessments of targets vs progress.
 */

export const COPY = {
  app: {
    title: "LIFE OS",
    tagline: "Personal Command Center",
    mission: "Build Financial Stability + Career + Marriage Readiness",
  },
  auth: {
    loginTitle: "Welcome back",
    loginSubtitle: "Sign in to your command center",
    emailLabel: "Email address",
    passwordLabel: "Password",
    submitButton: "Sign in",
    signingIn: "Signing in…",
    logout: "Sign out",
    invalidCredentials: "The email or password you entered is incorrect.",
    lockedOut: "Too many failed attempts. Please wait 5 minutes before trying again.",
  },
  status: {
    ready: "Operational",
    allClear: "All systems running normally",
    unauthenticated: "Authentication required",
  },
  home: {
    greeting: (name: string) => `Good day, ${name}`,
    headline: "System Foundation Verified (Phase F1)",
    description:
      "Your database, authentication, and security isolation are active and verified.",
    stats: {
      goals: "Active Goals",
      tasks: "Weekly Tasks",
      buckets: "Savings Buckets",
      projects: "Active Projects",
    },
  },
  staleTasks: {
    prompt: "This item hasn't moved in a few days. How would you like to handle it?",
    actions: {
      do: "Do today",
      reschedule: "Reschedule",
      delegate: "Delegate",
      delete: "Remove",
    },
  },
  habits: {
    missedMessage: "Missed yesterday? No problem. Reset and begin fresh today.",
    restartAction: "Restart Today",
  },
  money: {
    marriageBucketName: "Marriage Fund",
    emergencyBucketName: "Emergency Reserve",
    businessBucketName: "Business / Operations",
    personalBucketName: "Personal Savings",
  },
} as const;
