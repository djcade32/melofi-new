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
  const { inActivityThreshold } = useAppStore();
  const { fetchOpenWidgets, toggleOpenWidgets } = useWidgetsStore();

  const [isSleep, setIsSleep] = useState(false);

  let timeout: NodeJS.Timeout;
  useEffect(() => {
    // Detects if the user is idle and sets the isSleep state to true
    const onMouseMove = () => {
      setIsSleep(false);
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        // if (JSON.parse(localStorage.getItem("settingsConfig")).hideInterface) {
        setIsSleep(true);
        //   return;
        // }
        clearTimeout(timeout);
      }, inActivityThreshold);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseMove);

    // Get the open widgets from local storage and open them
    fetchOpenWidgets();
    toggleOpenWidgets();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseMove);
    };
  }, []);
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
