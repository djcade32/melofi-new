import {
  changeUserEmailOrFullNameInDb,
  reauthenticateUser as reauthenticateUserAction,
  resetPassword,
  updateEmail,
  updateUserProfile,
} from "@/lib/firebase/actions/auth-actions";
import { getUserFromUserDb } from "@/lib/firebase/getters/auth-getters";
import { MelofiUser, UserStats } from "@/types/general";
import { create } from "zustand";
import useNotificationProviderStore from "./notification-provider-store";
import { getFirebaseAuth } from "@/lib/firebase/firebaseClient";

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
  reAuthenticateUser: (password: string, callBackFunction: () => Promise<void>) => Promise<void>;
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
}));

export default useUserStore;
