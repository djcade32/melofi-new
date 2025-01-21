import { User } from "firebase/auth";
import { ReactElement, ReactNode } from "react";
import { IconType } from "react-icons";
import { Descendant } from "slate";
import { PomodoroTimerStats } from "./interfaces/pomodoro_timer";
import { NotificationTypes } from "@/enums/general";

export interface Scene {
  id: number;
  name: string;
  thumbnail: string;
  video: string;
  soundIcons: SoundIcon[];
  fontFamily: string;
  premium: boolean;
}

export interface SoundIcon {
  name: string;
  icon: IconType;
}

export interface Song {
  id: number;
  mp3Path: string;
  artist: string;
  title: string;
  provider: string;
  providerUrl: string;
}

export interface NotificationType {
  message: string;
  type: NotificationTypes;
  icon?: IconType;
  actions?: { element: ReactNode; onClick: () => void }[];
}

export interface MenuOption {
  id: string;
  label: string;
  icon: ReactElement;
  onClick: () => void;
}

export interface LongMenuOption {
  id: string;
  label: string;
}

export interface LongMenuRenderedOption extends LongMenuOption {
  element: ReactNode;
}

export interface AuthViewProps {
  setOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
}

export interface MelofiUser {
  // isPremium: boolean;
  // playlists: Playlist[];
  // likedSongs: Song[];
  name: string;
  skippedOnboarding?: boolean;
  authUser?: User;
}

export interface Error {
  name: string;
  message: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  text: Descendant[];
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  lastLogin: string;
  pomodoroTimer: PomodoroTimerStats;
  totalFocusTime: number;
  totalConsecutiveDays: number;
  totalTasksCompleted: number;
  totalNotesCreated: number;
  favoriteScene: string | null;
  alarmsExpiredCount: number;
}

export interface DialogModalActions {
  toggleOpen: number;
  cancel: () => void;
  confirm: () => void;
  title: string;
  message: string;
}
