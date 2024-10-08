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
