import { User } from "firebase/auth";
import { ReactElement, ReactNode } from "react";
import { IconType } from "react-icons";
import { Descendant } from "slate";

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

export interface Sound {
  name: string;
  path: string;
  icon: IconType;
  volume: number;
  premium: boolean;
}

export interface Song {
  id: number;
  mp3Path: string;
  artist: string;
  title: string;
  provider: string;
  providerUrl: string;
}

export interface Playlist {
  id: number;
  name: string;
  icon: IconType;
  spotifyPlaylistId: string;
  songs: Song[];
}

export interface NotificationType {
  message: string;
  type: "success" | "error" | "normal";
  icon?: ReactElement;
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

export interface CalendarListItem {
  id: string;
  name: string;
  color: string;
  primary: boolean;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
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
  pomodoroTimer: PomodoroTimerStats;
  totalFocusTime: number;
  totalConsecutiveDays: number;
  totalTasksCompleted: number;
  totalNotesCreated: number;
  favoriteScene: string | null;
  lastLogin: string;
}

export interface PomodoroTimerStats {
  totalFocusTime: number;
  totalBreakTime: number;
  totalSessionsCompleted: number;
  totalTasksCompleted: number;
}

export interface PomodoroTimerTaskPayload {
  title: string;
  focusTime: number;
  breakTime: number;
  sessions: number;
}

export interface PomodoroTimerTask extends PomodoroTimerTaskPayload {
  id: string;
  completed: boolean;
  completedAt: string | null;
  sessionsCompleted: number;
  percentCompleted: number;
  currentMode: "Focus" | "Break";
}
