"use client";
import useAppStore from "@/stores/app-store";
import useWidgetsStore from "@/stores/widgets-store";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface AppContextInterface {
  isSleep: boolean;
  setIsSleep: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextInterface>({
  isSleep: false,
  setIsSleep: () => {},
});

interface AppContextProviderProps {
  children: React.ReactNode;
}

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const { appSettings, fetchAppSettings } = useAppStore();
  const { fetchOpenWidgets, toggleOpenWidgets } = useWidgetsStore();

  const [isSleep, setIsSleep] = useState(false);

  useEffect(() => {
    // Get the open widgets from local storage and open them
    fetchOpenWidgets();
    toggleOpenWidgets();
    fetchAppSettings();
  }, []);

  let timeout: NodeJS.Timeout;
  useEffect(() => {
    const { inActivityThreshold } = appSettings;

    timeout = setTimeout(() => {
      if (inActivityThreshold === 0) {
        clearTimeout(timeout);
        return;
      }
      setIsSleep(true);
    }, inActivityThreshold);

    const onMouseMove = () => {
      setIsSleep(false);
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setIsSleep(true);
        clearTimeout(timeout);
      }, inActivityThreshold);
    };

    if (inActivityThreshold === 0) {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseMove);
      clearTimeout(timeout);
      return;
    }
    // Detects if the user is idle and sets the isSleep state to true

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseMove);
      clearTimeout(timeout);
    };
  }, [appSettings.inActivityThreshold]);
  return (
    <AppContext.Provider
      value={{
        isSleep,
        setIsSleep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
