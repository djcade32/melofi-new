import {
  changeUserEmailOrFullNameInDb,
  deleteAccount,
  reauthenticateUser as reauthenticateUserAction,
  resetPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateUserProfile,
} from "@/lib/firebase/actions/auth-actions";
import { getUserFromUserDb } from "@/lib/firebase/getters/auth-getters";
import { MelofiUser, UserStats } from "@/types/general";
import { create } from "zustand";
import useNotificationProviderStore from "./notification-provider-store";
import { getFirebaseAuth } from "@/lib/firebase/firebaseClient";
import useCalendarStore from "./widgets/calendar-store";
import useNotesStore from "./widgets/notes-store";
import useTodoListStore from "./widgets/todoList-store";
import usePomodoroTimerStore from "./widgets/pomodoro-timer-store";
import useTemplatesStore from "./widgets/templates-store";
import useAlarmsStore from "./widgets/alarms-store";
import useUserStatsStore from "./user-stats-store";
import useAppStore from "./app-store";
import { UserMembership } from "@/enums/general";
import useMenuStore from "./menu-store";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("User Store");

export interface UserState {
  isUserLoggedIn: boolean;
  currentUser?: MelofiUser;
  userStats?: UserStats;
  isPremiumUser?: boolean | undefined;
  membershipType?: UserMembership;

  getCurrentUserUid: () => string | undefined;
  setIsUserLoggedIn: (value: boolean) => void;
  setCurrentUser: (user: MelofiUser) => void;
  checkIfUserIsInDb: (uid: string) => Promise<boolean>;
  resetUserPassword: (email: string) => Promise<void>;
  changeFullName: (fullName: string) => Promise<void>;
  changeUserEmail: (email: string) => Promise<void>;
  changePassword: (password: string) => Promise<void>;
  reAuthenticateUser: (password: string, callBackFunction: () => Promise<void>) => Promise<void>;
  clearUserData: () => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  signUserOut: () => Promise<void>;
  setIsPremiumUser: (value: UserMembership) => void;
}

const useUserStore = create<UserState>((set, get) => ({
  isUserLoggedIn: false,
  currentUser: undefined,
  userStats: undefined,
  isPremiumUser: undefined,
  membershipType: "free",

  getCurrentUserUid: () => {
    const { currentUser } = get();
    return currentUser?.authUser?.uid;
  },

  setIsUserLoggedIn: (value) => {
    set({ isUserLoggedIn: value });
  },

  setCurrentUser: (user) => {
    // Save user to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    set({ currentUser: user });
  },

  async checkIfUserIsInDb(uid) {
    if (process.env.NEXT_PUBLIC_IS_CYPRESS) {
      Logger.debug.warn("Mocked checkIfUserIsInDb");
      return true;
    }
    const userInDb = await getUserFromUserDb(uid);
    return !!userInDb;
  },

  async resetUserPassword(email) {
    resetPassword(email);
  },

  async changeFullName(fullName) {
    const { currentUser } = get();
    try {
      if (currentUser?.authUser?.uid) {
        const { addNotification } = useNotificationProviderStore.getState();

        await updateUserProfile(fullName);
        await changeUserEmailOrFullNameInDb(currentUser.authUser.uid, {
          firstName: fullName,
        });

        currentUser.name = fullName;
        if (currentUser.authUser) {
          const authUser = getFirebaseAuth()?.currentUser;
          if (authUser) {
            currentUser.authUser = {
              ...currentUser.authUser,
              displayName: fullName,
            };
          }
        }
        set({ currentUser });
        localStorage.setItem("user", JSON.stringify(currentUser));

        addNotification({ type: "success", message: "Full name changed successfully" });
      }
    } catch (error) {
      Logger.error("Error changing full name: ", error);
    }
  },

  async changeUserEmail(email) {
    const { currentUser } = get();
    const { addNotification } = useNotificationProviderStore.getState();

    try {
      if (currentUser?.authUser?.email) {
        await updateEmail(email);

        if (currentUser.authUser) {
          const authUser = getFirebaseAuth()?.currentUser;
          if (authUser) {
            currentUser.authUser = {
              ...currentUser.authUser,
              email,
            };
          }
        }
        set({ currentUser });
        localStorage.setItem("user", JSON.stringify(currentUser));

        addNotification({ type: "success", message: "Email changed successfully" });
      }
    } catch (error) {
      Logger.error("Error changing email: ", error);
      addNotification({ type: "error", message: "Error changing email" });
    }
  },

  async changePassword(password) {
    const { addNotification } = useNotificationProviderStore.getState();

    try {
      await updatePassword(password);
      addNotification({ type: "success", message: "Password changed successfully" });
    } catch (error) {
      Logger.error("Error changing password: ", error);
      addNotification({ type: "error", message: "Error changing password" });
    }
  },

  async reAuthenticateUser(password, callBackFunction) {
    const { currentUser } = get();
    const { addNotification } = useNotificationProviderStore.getState();

    if (currentUser?.authUser?.email) {
      const result = await reauthenticateUserAction(currentUser.authUser.email, password);
      if (!result.success) {
        addNotification({
          type: "error",
          message: result.message || "Error reauthenticating user",
        });
      } else {
        await callBackFunction();
      }
    }
  },

  async clearUserData() {
    const { currentUser } = get();
    if (!currentUser?.authUser?.uid) return;

    useCalendarStore.getState().resetCalendarState();
    useNotesStore.getState().resetNotesData(currentUser.authUser.uid);
    await useTodoListStore.getState().resetTodoListData(currentUser.authUser.uid);
    await usePomodoroTimerStore.getState().resetPomodoroTimerData();
    await useTemplatesStore.getState().resetTemplatesData();
    await useAlarmsStore.getState().resetAlarmsData();
    await useUserStatsStore.getState().resetUserStatsData();

    useNotificationProviderStore.getState().addNotification({
      type: "success",
      message: "Data cleared successfully",
    });
  },

  async deleteUserAccount() {
    const { currentUser, clearUserData } = get();
    const { addNotification } = useNotificationProviderStore.getState();
    const uid = currentUser?.authUser?.uid;

    try {
      if (uid) {
        await clearUserData();
        await deleteAccount(uid);
        localStorage.removeItem("user");
        set({ currentUser: undefined, isUserLoggedIn: false, userStats: undefined });
        addNotification({ type: "success", message: "Account deleted successfully" });
      }
    } catch (error) {
      Logger.error("Error deleting account: ", error);
      addNotification({ type: "error", message: "Error deleting account" });
    }
  },

  signUserOut: async () => {
    const { isElectron, removePremiumFeatures } = useAppStore.getState();
    const { setIsMenuOpen } = useMenuStore.getState();

    const user = {
      authUser: undefined,
      name: get().currentUser?.name || "",
      skippedOnboarding: true,
    } as MelofiUser;
    const userUid = get().currentUser?.authUser?.uid;
    if (!userUid) return Logger.debug.info("User not logged in");

    // Reset all stores
    useNotesStore.getState().resetNotesData(userUid, false);
    await useTodoListStore.getState().resetTodoListData(userUid, false);
    await usePomodoroTimerStore.getState().resetPomodoroTimerData(false);
    await useTemplatesStore.getState().resetTemplatesData(false);
    await useAlarmsStore.getState().resetAlarmsData(false);
    await useUserStatsStore.getState().resetUserStatsData(false);

    removePremiumFeatures();
    useNotificationProviderStore
      .getState()
      .addNotification({ type: "success", message: "Logged out" });

    if (isElectron()) {
      localStorage.removeItem("user");
      setIsMenuOpen(false);
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
    signOut();
    set({
      currentUser: isElectron() ? undefined : user,
      isUserLoggedIn: false,
      userStats: undefined,
      isPremiumUser: false,
      membershipType: "free",
    });
  },

  setIsPremiumUser: (value) => {
    set({ isPremiumUser: value === "premium" || value === "lifetime", membershipType: value });
  },
}));

export default useUserStore;
