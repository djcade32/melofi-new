import { Scene } from "../general";
import { MixerSoundConfig } from "./mixer";

export interface Template {
  id: string;
  name: string;
  playlistName: string;
  scene: Scene;
  mixerSoundConfig: MixerSoundConfig;
}

export interface TemplatesPayload {
  id: string;
  name: string;
  playlistName: string;
  sceneName: string;
  mixerSoundConfig: Record<string, number>;
}
