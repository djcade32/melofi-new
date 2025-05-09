import React, { useState } from "react";
import styles from "./userAccount.module.css";
import { PiSignOutBold, MdOutlineOpenInNew, FaDownload } from "@/imports/icons";
import useUserStore from "@/stores/user-store";
import Button from "@/ui/components/shared/button/Button";
import { manageSubscription } from "@/lib/stripe/manageSubscription";
import useNotificationProviderStore from "@/stores/notification-provider-store";
import Switch from "@/ui/components/shared/switch/Switch";
import { createCheckoutSession } from "@/lib/stripe/createCheckoutSession";
import { Logger } from "@/classes/Logger";
import { wait } from "@/utils/general";

const UserAccount = () => {
  const { signUserOut, currentUser, isPremiumUser, membershipType } = useUserStore();
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

  const handleDownloadClick = async () => {
    const osType = getOsType();
    if (osType === "unknown") {
      console.error("Unknown OS type");
      return;
    }
    const fileExtension = osType === "mac" ? "dmg" : "exe";
    window.open(
      `https://pub-883c6ee85c4c477c966ca224ca5d4b13.r2.dev/${osType}/Melofi-${process.env.NEXT_PUBLIC_MELOFI_VERSION}.${fileExtension}`
    );
  };

  const handleGoPremiumClick = async (lifetime?: boolean) => {
    document.body.style.cursor = "wait";
    let model = "monthly";
    if (lifetime) {
      model = "lifetime";
    } else {
      model = isYearly ? "yearly" : "monthly";
    }
    try {
      await createCheckoutSession(currentUser?.authUser?.uid, model, "portal");
    } catch (error) {
      Logger.getInstance().error(`Error creating checkout session: ${error}`);
      useNotificationProviderStore.getState().addNotification({
        type: "error",
        message: "Error creating checkout session",
      });
    } finally {
      await wait(3000);
      document.body.style.cursor = "default";
    }
  };

  const getOsType = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("Mac OS X")) {
      return "mac";
    } else if (userAgent.includes("Windows NT")) {
      return "windows";
    } else if (userAgent.includes("Linux")) {
      return "linux";
    }
    return "unknown";
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
          {membershipType === "lifetime" && (
            <Button
              id="portal-manage-download-button"
              text="Melofi Desktop"
              onClick={handleDownloadClick}
              containerClassName={styles.userAccount__button}
              textClassName={styles.userAccount__button_text}
              showLoadingState={true}
              postpendIcon={FaDownload}
            />
          )}
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
              onClick={() => handleGoPremiumClick()}
              containerClassName={styles.userAccount__button}
              textClassName={styles.userAccount__button_text}
              showLoadingState={true}
            />
            <Button
              id="portal-go-premium-button"
              text="Get Lifetime Access"
              onClick={() => handleGoPremiumClick(true)}
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
