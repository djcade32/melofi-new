import { ReactElement } from "react";

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
  songs: Song[];
}
