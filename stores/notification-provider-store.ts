import { NotificationType } from "@/types/general";
import { create } from "zustand";

export interface NotificationProviderState {
  notificationQueue: NotificationType[];
  showNotification: boolean;
  currentNotification?: NotificationType | undefined;

  setShowNotification: (showNotification: boolean) => void;
  setCurrentNotification: (currentNotification: NotificationType) => void;
  addNotification: (notification: NotificationType) => void;
  removeNotification: () => void;
}

const useNotificationProviderStore = create<NotificationProviderState>((set, get) => ({
  notificationQueue: [],
  showNotification: false,
  currentNotification: undefined,

  setShowNotification: (showNotification: boolean) => {
    set({ showNotification });
  },
  setCurrentNotification: (currentNotification: NotificationType) => {
    set({ currentNotification });
  },
  addNotification: (notification: NotificationType) => {
    console.log("noti queue", [...get().notificationQueue, notification]);
    set((state) => ({ notificationQueue: [...state.notificationQueue, notification] }));
  },
  removeNotification: () => {
    set((state) => ({ notificationQueue: state.notificationQueue.slice(1) }));
  },
}));

export default useNotificationProviderStore;
