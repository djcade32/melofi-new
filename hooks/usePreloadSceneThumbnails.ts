"use client";

import { scenes } from "@/data/scenes";
import { Scene } from "@/types/general";
import { useEffect } from "react";

export const usePreloadSceneThumbnails = () => {
  useEffect(() => {
    const preloadAll = async () => {
      const imagesPaths = scenes.map((scene: Scene) => scene.thumbnail);
      imagesPaths.forEach((path) => {
        import("../public" + path);
      });
    };

    preloadAll();
  }, []);
};
