import { User } from "firebase/auth";
import { ReactElement } from "react";
import { IconType } from "react-icons";

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
