/**
 * 13 suggested note folders for the Notes & Knowledge engine (§16).
 */

export const NOTE_FOLDERS = [
  "00 Inbox",
  "01 Vision & Life",
  "02 Freelance & Clients",
  "03 Discord Bots",
  "04 Product Lab",
  "05 Career & Learning",
  "06 Finances",
  "07 Marriage & Us",
  "08 System & Processes",
  "09 Decision Desk",
  "10 Ideas & Someday",
  "11 Personal Journal",
  "12 Archive",
] as const;

export type NoteFolder = (typeof NOTE_FOLDERS)[number];
