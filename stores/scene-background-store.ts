import { create } from "zustand";

export interface SceneBackgroundState {
  currentScene: string;
}

const useSceneBackgroundStore = create<SceneBackgroundState>((set) => ({
  currentScene: "/assets/videos/girl-in-cafe_vid.mp4",

  //   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
  //   updateBears: (newBears) => set({ bears: newBears }),
}));

export default useSceneBackgroundStore;
