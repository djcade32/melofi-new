import { ReactElement } from "react";
import { IconType } from "react-icons";

export interface Scene {
  id: number;
  name: string;
  thumbnail: string;
  video: string;
  soundIcons: ReactElement[];
  fontFamily: string;
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
