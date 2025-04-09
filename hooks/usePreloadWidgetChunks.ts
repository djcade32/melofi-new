// hooks/usePreloadWidgetChunks.ts
"use client";

import { useEffect } from "react";

export const usePreloadWidgetChunks = () => {
  useEffect(() => {
    // Dynamically import all widget components so chunks are cached
    const preloadAll = async () => {
      await Promise.all([
        import("@/ui/widgets/alarms/Alarms"),
        import("@/ui/widgets/calculator/Calculator"),
        import("@/ui/widgets/calendar/Calendar"),
        import("@/ui/widgets/todoList/TodoList"),
        import("@/ui/widgets/notes/Notes"),
        import("@/ui/widgets/pomodoroTimer/PomodoroTimer"),
        import("@/ui/widgets/templates/Templates"),
        import("@/ui/widgets/youtube/Youtube"),
        import("@/ui/widgets/timer/Timer"),
        import("@/ui/modals/sceneModal/SceneModal"),
      ]);
    };

    preloadAll();
  }, []);
};
