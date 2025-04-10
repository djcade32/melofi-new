import React, { useState } from "react";
import styles from "./userAccount.module.css";
import { PiSignOutBold, MdOutlineOpenInNew } from "@/imports/icons";
import useUserStore from "@/stores/user-store";
import Button from "@/ui/components/shared/button/Button";
import { manageSubscription } from "@/lib/stripe/manageSubscription";
import useNotificationProviderStore from "@/stores/notification-provider-store";
import Switch from "@/ui/components/shared/switch/Switch";
import { createCheckoutSession } from "@/lib/stripe/createCheckoutSession";
import { Logger } from "@/classes/Logger";

const UserAccount = () => {
  const { signUserOut, currentUser, isPremiumUser } = useUserStore();
  const [isYearly, setIsYearly] = useState(true);

  const getInitials = (name: string | undefined) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
    return initials.length > 2 ? initials.slice(0, 2) : initials;
  };

  const handleManageSubscriptionClick = async () => {
    const success = await manageSubscription("portal");
    if (!success) {
      useNotificationProviderStore.getState().addNotification({
        type: "error",
        message: "Error retrieving billing subscription information",
      });
    }
  };

  const handleGoPremiumClick = async () => {
    try {
      await createCheckoutSession(
        currentUser?.authUser?.uid,
        isYearly ? "yearly" : "monthly",
        "portal"
      );
    } catch (error) {
      Logger.getInstance().error(`Error creating checkout session: ${error}`);
      useNotificationProviderStore.getState().addNotification({
        type: "error",
        message: "Error creating checkout session",
      });
    }
  };

  return (
    <div className={styles.userAccount__container}>
      <div onClick={signUserOut} className={styles.userAccount__logout}>
        <PiSignOutBold size={20} color="var(--color-secondary)" />
        <p>Logout</p>
      </div>

      <div className={styles.userAccount__userInfo}>
        <div className={styles.userAccount__userInitials}>
          <p>{getInitials(currentUser?.authUser?.displayName)}</p>
        </div>
        <h2>{currentUser?.authUser?.displayName}</h2>
        <p>{currentUser?.authUser?.email}</p>
      </div>
      {isPremiumUser ? (
        <div>
          <Button
            id="portal-manage-subscription-button"
            text="Manage Subscription"
            onClick={handleManageSubscriptionClick}
            containerClassName={styles.userAccount__button}
            textClassName={styles.userAccount__button_text}
            showLoadingState={true}
            postpendIcon={MdOutlineOpenInNew}
          />
        </div>
      ) : (
        <div>
          <div className={styles.userAccount__switch}>
            <p className={`${!isYearly ? styles.active : ""} ${styles.userAccount__switch_txt}`}>
              MONTHLY
            </p>
            <Switch
              sx={{
                width: 51,
                height: 35,
                "& .MuiSwitch-thumb": {
                  boxSizing: "border-box",
                  width: 31,
                  height: 31,
                },
              }}
              checked={isYearly}
              onChange={() => setIsYearly((prev) => !prev)}
            />
            <p className={`${isYearly ? styles.active : ""} ${styles.userAccount__switch_txt}`}>
              YEARLY
            </p>
            <div className={styles.userAccount__save}>
              <p>SAVE 33%</p>
            </div>
          </div>
          <div>
            <Button
              id="portal-go-premium-button"
              text="Upgrade to Premium"
              onClick={handleGoPremiumClick}
              containerClassName={styles.userAccount__button}
              textClassName={styles.userAccount__button_text}
              showLoadingState={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccount;
