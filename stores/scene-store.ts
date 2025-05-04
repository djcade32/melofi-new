import { create } from "zustand";
import { scenes } from "@/data/scenes";
import { Scene } from "@/types/general";
import useTemplatesStore from "./widgets/templates-store";
import useUserStatsStore from "./user-stats-store";
import useUserStore from "./user-store";
import useAppStore from "./app-store";

export interface SceneState {
  currentScene: Scene;
  sceneModalOpen: boolean;
  allScenes: Scene[];

  getCurrentScene: () => void;
  setCurrentScene: (newScene: Scene) => void;
  toggleSceneModal: (bool: boolean) => void;
}

const useSceneStore = create<SceneState>((set) => ({
  currentScene: scenes[0],
  sceneModalOpen: false,
  allScenes: scenes,

  getCurrentScene: () => {
    const { isPremiumUser } = useUserStore.getState();
    const { sceneRouletteEnabled } = useAppStore.getState().appSettings;
    if (sceneRouletteEnabled) {
      // Filter out premium scenes if the user is not a premium user
      const filteredScenes = isPremiumUser ? scenes.filter((scene) => !scene.premium) : scenes;
      const randomScene = filteredScenes[Math.floor(Math.random() * filteredScenes.length)];
      set({ currentScene: randomScene });
      localStorage.setItem("currentScene", JSON.stringify(randomScene));
      return;
    }

    const currentScene = localStorage.getItem("currentScene");
    if (currentScene) {
      const parsedScene = JSON.parse(currentScene);
      if (parsedScene.premium && !isPremiumUser) {
        set({ currentScene: scenes[0] });
        return;
      }
      set({ currentScene: parsedScene });
    }
  },

  setCurrentScene: (newScene: Scene) => {
    const { settingsChanged, selectedTemplate } = useTemplatesStore.getState();
    set({ currentScene: newScene });
    // Set local storage
    localStorage.setItem("currentScene", JSON.stringify(newScene));
    selectedTemplate && settingsChanged();
    try {
      useUserStatsStore.getState().updateSceneCounts(newScene.name);
    } catch (error) {
      console.log("Error updating scene counts: ", error);
    }
  },

  toggleSceneModal: (bool: boolean) => set(() => ({ sceneModalOpen: bool })),
}));

export default useSceneStore;
