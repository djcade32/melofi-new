import { User } from "firebase/auth";
import { ReactElement, ReactNode } from "react";
import { IconType } from "react-icons";
import { Descendant } from "slate";
import { PomodoroTimerStats } from "./interfaces/pomodoro_timer";
import { NotificationTypes } from "@/enums/general";
import { Timestamp } from "firebase/firestore";

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
  showPremiumIcon?: boolean;
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
  authUser?: {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
  };
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

export interface SceneCounts {
  counts: { [key: string]: number };
  favoriteSceneName: string | null;
}

export interface UserStats {
  pomodoroTimer: PomodoroTimerStats;
  totalNotesCreated: number;
  sceneCounts: SceneCounts | null;
  alarmsExpiredCount: number;
}

export interface DialogModalActions {
  toggleOpen: number;
  cancel: () => void;
  confirm: () => void;
  title: string;
  message: string;
}

export interface PromiseResolveType {
  success: boolean;
  message?: string;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface Widget {
  name: string;
  position: Coordinates;
  dimensions?: Dimensions;
}

export interface ToolbarSettings {
  isVertical: boolean;
  isUndocked: boolean;
  position: Coordinates;
}

export interface AppSettings {
  userUid: string | null;
  inActivityThreshold: number;
  pomodoroTimerSoundEnabled: boolean;
  alarmSoundEnabled: boolean;
  calendarHoverEffectEnabled: boolean;
  todoListHoverEffectEnabled: boolean;
  showDailyQuote: boolean;
  sceneRouletteEnabled: boolean;
}

export interface AnnouncementBanner {
  text: string;
  cta: string;
  ctaLink: string;
  start: Timestamp;
  end: Timestamp;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
