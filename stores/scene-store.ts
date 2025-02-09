import { create } from "zustand";
import { scenes } from "@/data/scenes";
import { Scene } from "@/types/general";
import useTemplatesStore from "./widgets/templates-store";

export interface SceneState {
  currentScene: Scene | null;
  sceneModalOpen: boolean;
  allScenes: Scene[];

  getCurrentScene: () => void;
  setCurrentScene: (newScene: Scene) => void;
  toggleSceneModal: (bool: boolean) => void;
}

const useSceneStore = create<SceneState>((set) => ({
  currentScene: null,
  sceneModalOpen: false,
  allScenes: scenes,

  getCurrentScene: () => {
    const currentScene = localStorage.getItem("currentScene");
    if (currentScene) {
      set({ currentScene: JSON.parse(currentScene) });
    }
  },

  setCurrentScene: (newScene: Scene) => {
    const { settingsChanged, selectedTemplate } = useTemplatesStore.getState();
    set({ currentScene: newScene });
    // Set local storage
    localStorage.setItem("currentScene", JSON.stringify(newScene));
    selectedTemplate && settingsChanged();
  },

  toggleSceneModal: (bool: boolean) => set(() => ({ sceneModalOpen: bool })),
}));

export default useSceneStore;
