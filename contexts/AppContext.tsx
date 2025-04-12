"use client";
import { Logger } from "@/classes/Logger";
import useAppStore from "@/stores/app-store";
import useUserStore from "@/stores/user-store";
import useWidgetsStore from "@/stores/widgets-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  const { currentUser } = useUserStore();
  const { isOnline } = useAppStore();

  const [isSleep, setIsSleep] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);

  useEffect(() => {
    // Get the open widgets from local storage and open them
    const widgets = fetchOpenWidgets();
    toggleOpenWidgets(widgets);
  }, []);

  useMemo(() => {
    const fetchUserAppSettings = async () => {
      await fetchAppSettings();
    };
    if (currentUser?.authUser?.uid !== userUid) {
      Logger.getInstance().info("fetching user app settings");
      setUserUid(currentUser?.authUser?.uid || null);
      fetchUserAppSettings();
    }
  }, [currentUser]);

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
