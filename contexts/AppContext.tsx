"use client";
import useAppStore from "@/stores/app-store";
import useIndexedDBStore from "@/stores/indexedDB-store";
import useUserStore from "@/stores/user-store";
import useWidgetsStore from "@/stores/widgets-store";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("App Context");

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
  const { appSettings, fetchAppSettings, isOnline } = useAppStore();
  const { fetchOpenWidgets, toggleOpenWidgets } = useWidgetsStore();
  const { currentUser } = useUserStore();
  const { indexedDB, initializeIndexedDB, syncWidgetData, pushAllDataToFirebase } =
    useIndexedDBStore();

  const [isSleep, setIsSleep] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    const initLocalDB = async () => {
      await initializeIndexedDB();
    };

    initLocalDB();
    // Get the open widgets from local storage and open them
    const widgets = fetchOpenWidgets();
    toggleOpenWidgets(widgets);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (indexedDB === null || !currentUser?.authUser?.uid) return;
    syncWidgetData();
  }, [indexedDB, currentUser]);

  useEffect(() => {
    if (isOnline && !loading && currentUser?.authUser?.uid) {
      Logger.info("Syncing data with backend...");
      // Sync data with Firebase if back online
      pushAllDataToFirebase();
    }
  }, [isOnline]);

  useEffect(() => {
    const fetchUserAppSettings = async () => {
      await fetchAppSettings();
    };
    if (currentUser?.authUser?.uid !== userUid) {
      Logger.debug.info("fetching user app settings");
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
