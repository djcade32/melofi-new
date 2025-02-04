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
import { auth } from "firebase-functions/v1";
import { skip } from "node:test";

export interface UserState {
  isUserLoggedIn: boolean;
  currentUser?: MelofiUser;
  userStats?: UserStats;

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
  signUserOut: () => void;
}

const useUserStore = create<UserState>((set, get) => ({
  isUserLoggedIn: false,
  currentUser: undefined,
  userStats: undefined,

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
      console.log("Mocked checkIfUserIsInDb");
      return true;
    }
    return !!(await getUserFromUserDb(uid));
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
            currentUser.authUser = authUser;
          }
        }
        set({ currentUser });
        localStorage.setItem("user", JSON.stringify(currentUser));

        addNotification({ type: "success", message: "Full name changed successfully" });
      }
    } catch (error) {
      console.error("Error changing full name: ", error);
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
            currentUser.authUser = authUser;
          }
        }
        set({ currentUser });
        localStorage.setItem("user", JSON.stringify(currentUser));

        addNotification({ type: "success", message: "Email changed successfully" });
      }
    } catch (error) {
      console.error("Error changing email: ", error);
      addNotification({ type: "error", message: "Error changing email" });
    }
  },

  async changePassword(password) {
    const { addNotification } = useNotificationProviderStore.getState();

    try {
      await updatePassword(password);
      addNotification({ type: "success", message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password: ", error);
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
    useCalendarStore.getState().resetCalendarState();
    useNotesStore.getState().resetNotesData();
    useTodoListStore.getState().resetTodoListData();
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
      console.error("Error deleting account: ", error);
      addNotification({ type: "error", message: "Error deleting account" });
    }
  },

  signUserOut: () => {
    const user = {
      name: get().currentUser?.name || "",
      skippedOnboarding: true,
    } as MelofiUser;

    localStorage.setItem("user", JSON.stringify(user));
    signOut();
    set({ currentUser: user, isUserLoggedIn: false, userStats: undefined });
    useNotificationProviderStore
      .getState()
      .addNotification({ type: "success", message: "Logged out" });
  },
}));

export default useUserStore;
