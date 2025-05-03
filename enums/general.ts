export const enum MusicSource {
  MELOFI = "melofi",
  SPOTIFY = "spotify",
}

export const ERROR_MESSAGES = {
  FIRST_NAME_REQUIRED: "First name is required",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  INVALID_EMAIL: "Email is invalid",
  PASSWORD_WEAK: "Password must be at least 8 characters, contain uppercase letters, and numbers",
  EMAIL_ALREADY_IN_USE: "Email is already in use",
  INVALID_CREDENTIALS: "Invalid email or password",
  NO_INTERNET_CONNECTION: "No internet connection",
};

export type NotificationTypes = "success" | "error" | "normal" | "alarm" | "copy_to_clipboard";

export type MenuOptionNames =
  | "Account"
  | "Insights"
  | "General Settings"
  | "Leave Feedback"
  | "Support"
  | "Share With Friends"
  | "Melofi Desktop"
  | "About Melofi"
  | "Logout";

export type DaysOfWeek = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export type PremiumModalTypes =
  | "mixer"
  | "pomodoro_timer"
  | "templates"
  | "alarms"
  | "toolbar_settings"
  | "show_quotes"
  | "scenes"
  | "focus_stats"
  | "youtube"
  | "spotify";

export type UserMembership = "free" | "premium" | "lifetime";
