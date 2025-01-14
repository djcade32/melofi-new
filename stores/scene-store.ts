import { create } from "zustand";
import { scenes } from "@/data/scenes";
import { Scene } from "@/types/general";
import useTemplatesStore from "./widgets/templates-store";

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

  setCurrentScene: (newScene: Scene) => {
    const { settingsChanged, selectedTemplate } = useTemplatesStore.getState();
    set({ currentScene: newScene });
    selectedTemplate && settingsChanged();
  },
  toggleSceneModal: (bool: boolean) => set(() => ({ sceneModalOpen: bool })),
}));

export default useSceneStore;
