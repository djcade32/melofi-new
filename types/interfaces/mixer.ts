import { IconType } from "react-icons";
import { Song } from "../general";

export interface Sound {
  name: string;
  path: string;
  icon: IconType;
  volume: number;
  premium: boolean;
}

export interface Playlist {
  id: number;
  name: string;
  icon: IconType;
  spotifyPlaylistId: string;
  songs: Song[];
}

export interface MixerSoundConfig extends Record<string, Sound> {}
