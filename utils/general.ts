import { PremiumModalTypes } from "@/enums/general";

// Validate if a string is a valid email
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Wait for a specified time in milliseconds
/**
 *
 * @param time - Time in milliseconds to wait
 * @returns
 */
export const wait = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// Get correct PremiumModalType based on string
export const getPremiumModalType = (type: string): PremiumModalTypes => {
  switch (type) {
    case "Pomodoro Timer":
      return "pomodoro_timer";
    case "Templates":
      return "templates";
    case "Watch Youtube":
      return "youtube";
    case "Alarms":
      return "alarms";
    default:
      return "pomodoro_timer";
  }
};

export function sendNotification(title: string, options?: NotificationOptions) {
  if (
    "Notification" in window &&
    Notification.permission === "granted" &&
    document.visibilityState !== "visible"
  ) {
    new Notification(title, {
      body: options?.body,
      icon: "/icons/melofi-icon-192x192.png", // Optional
      silent: false, // Plays a sound if the OS allows it
      ...options,
    });
  }
}
