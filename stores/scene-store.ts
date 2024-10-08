import { create } from "zustand";
import { scenes } from "@/data/scenes";
import { Scene } from "@/types/interfaces";

export interface SceneState {
  currentScene: Scene;
  sceneModalOpen: boolean;
  allScenes: Scene[];

  setCurrentScene: (newScene: Scene) => void;
  toggleSceneModal: (bool: boolean) => void;
}

const useSceneStore = create<SceneState>((set) => ({
  currentScene: scenes[0],
  sceneModalOpen: false,
  allScenes: scenes,

  setCurrentScene: (newScene: Scene) => set({ currentScene: newScene }),
  toggleSceneModal: (bool: boolean) => set((state) => ({ sceneModalOpen: bool })),
}));

export default useSceneStore;
