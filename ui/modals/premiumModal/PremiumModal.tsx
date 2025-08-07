import React, { useEffect, useState } from "react";
import styles from "./premiumModal.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import Button from "@/ui/components/shared/button/Button";
import useAppStore from "@/stores/app-store";
import { createCheckoutSession } from "@/lib/stripe/createCheckoutSession";
import useUserStore from "@/stores/user-store";
import Switch from "@/ui/components/shared/switch/Switch";
import useNotificationProviderStore from "@/stores/notification-provider-store";
import useMenuStore from "@/stores/menu-store";
import { wait } from "@/utils/general";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Premium Modal");

const featuresList = [
  "📊 Focus stats",
  "🖼️ Premium Scenes",
  "🎧 Premium ambient sounds",
  "🎵 Additional lofi tracks",
  "🍅 Pomodoro tasks",
  "📺 Watch Youtube",
  "📋 Templates",
  "🎶 Melofi playlist",
  "🌟 And much more on the way!",
];

const PremiumModal = () => {
  const { showPremiumModal, setShowPremiumModal } = useAppStore();
  const { currentUser } = useUserStore();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [isYearly, setIsYearly] = useState(true);

  useEffect(() => {
    setContent(getContent());
  }, [showPremiumModal]);

  const getContent = () => {
    switch (showPremiumModal) {
      case "mixer":
        return (
          <>
            <p className={styles.premiumModal__title}>Mix It Your Way</p>
            <p className={styles.premiumModal__description}>
              Take full control of your sound with all playlists, ambient layers, and seamless
              Spotify integration.
            </p>
            <img
              src="/assets/premium-pics/mixer-modal-premium-pic.png"
              alt="Premium Modal"
              width={350}
              height={196.88}
            />
          </>
        );
      case "pomodoro_timer":
        return (
          <>
            <p className={styles.premiumModal__title}>Power of Focus</p>
            <p className={styles.premiumModal__description}>
              Unlock the Pomodoro timer to stay focused, manage breaks, and get more
              done—distraction-free.
            </p>
            <img
              src="/assets/premium-pics/pomodoro-timer-premium-pic.png"
              alt="Premium Modal"
              width={261.33}
              height={196}
            />
          </>
        );
      case "templates":
        return (
          <>
            <p className={styles.premiumModal__title}>Save the Vibe</p>
            <p className={styles.premiumModal__description}>
              Unlock Templates to save and switch between your favorite Melofi setups—scenes, and
              sounds.
            </p>
            <img
              src="/assets/premium-pics/templates-premium-pic.png"
              alt="Premium Modal"
              width={215}
              height={215}
            />
          </>
        );
      case "youtube":
        return (
          <>
            <p className={styles.premiumModal__title}>Watch, Focus, Repeat</p>
            <p className={styles.premiumModal__description}>
              Unlock the YouTube widget to watch videos while staying in the zone—seamless,
              distraction-free focus.
            </p>
            <img
              src="/assets/premium-pics/youtube-premium-pic.png"
              alt="Premium Modal"
              width={355.56}
              height={200}
            />
          </>
        );
      case "toolbar_settings":
        return (
          <>
            <p className={styles.premiumModal__title}>Customize Your Workflow</p>
            <p className={styles.premiumModal__description}>
              Unlock toolbar customization to change its orientation or undock it for a setup that
              fits your flow.
            </p>
            <img
              src="/assets/premium-pics/toolbar-settings-premium-pic.png"
              alt="Premium Modal"
              width={266.67}
              height={200}
            />
          </>
        );
      case "focus_stats":
        return (
          <>
            <p className={styles.premiumModal__title}>Track Your Focus</p>
            <p className={styles.premiumModal__description}>
              Unlock detailed focus stats—track your best days, total focus time, breaks, and more
              to optimize your productivity.
            </p>
            <img
              src="/assets/premium-pics/focus-stats-premium-pic-1.png"
              alt="Premium Modal"
              width={333.33}
              height={200}
            />
          </>
        );
      case "show_quotes":
        return (
          <>
            <p className={styles.premiumModal__title}>Focus with Inspiration</p>
            <p className={styles.premiumModal__description}>
              Unlock a collection of motivational quotes to keep you inspired and in the zone.
            </p>
            <img
              src="/assets/premium-pics/quotes-premium-pic.png"
              alt="Premium Modal"
              width={400}
              height={200}
            />
          </>
        );
      case "spotify":
        return (
          <>
            <p className={styles.premiumModal__title}>Stream Your Soundtrack</p>
            <p className={styles.premiumModal__description}>
              Unlock Spotify integration to paste any playlist URL and enjoy your perfect focus
              soundtrack right in Melofi.
            </p>
            <img
              src="/assets/premium-pics/spotify-premium-pic.png"
              alt="Premium Modal"
              width={355.56}
              height={200}
            />
          </>
        );
      case "scenes":
        return (
          <>
            <p className={styles.premiumModal__title}>Exclusive Scenes</p>
            <p className={styles.premiumModal__description}>
              Upgrade to Premium to access a collection of immersive scenes that set the perfect
              mood for focus and relaxation.
            </p>
            <img
              src="/assets/premium-pics/scenes-premium-pic.png"
              alt="Premium Modal"
              width={320}
              height={200}
            />
          </>
        );
      case "alarms":
        return (
          <>
            <p className={styles.premiumModal__title}>Stay on Track</p>
            <p className={styles.premiumModal__description}>
              Set custom alerts and stay in control of your time and focus.
            </p>
            <img
              src="/assets/premium-pics/alarms-premium-pic.png"
              alt="Premium Modal"
              width={215}
              height={215}
            />
          </>
        );
      case "achievements":
        return (
          <>
            <p className={styles.premiumModal__title}>Celebrate Your Progress</p>
            <p className={styles.premiumModal__description}>
              See how far you've come and stay motivated on your focus journey.
            </p>
            <img
              src="/assets/premium-pics/achievements-premium-pic.png"
              alt="Premium Modal"
              width={215}
              height={215}
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleGoPremiumClick = async (lifetime?: boolean) => {
    document.body.style.cursor = "wait";
    const { isUserLoggedIn } = useUserStore.getState();
    const { setSelectedOption } = useMenuStore.getState();
    // If user is not logged in, show account modal
    if (!isUserLoggedIn) {
      setSelectedOption("Account");
      setShowPremiumModal(null);
      return;
    }

    let model = "yearly";
    if (lifetime) {
      model = "lifetime";
    } else if (!isYearly) {
      model = "monthly";
    }

    try {
      await createCheckoutSession(currentUser?.authUser?.uid, model);
    } catch (error) {
      Logger.error(`Error creating checkout session: ${error}`);
      useNotificationProviderStore.getState().addNotification({
        type: "error",
        message: "Error creating checkout session",
      });
    } finally {
      await wait(2000);
      document.body.style.cursor = "default";
    }
  };
  return (
    <>
      <div
        className={styles.premiumModal__backdrop}
        style={{
          opacity: showPremiumModal ? 1 : 0,
          zIndex: showPremiumModal ? 100 : -1,
        }}
      >
        <Modal
          id="premium-modal"
          isOpen={showPremiumModal !== null}
          close={() => setShowPremiumModal(null)}
          className={styles.premiumModal__container}
        >
          <div className={styles.premiumModal__content}>
            {content}
            <div className={styles.premiumModal__pricing_container}>
              <div className={styles.premiumModal__pricing_switch}>
                <p className={`${!isYearly ? styles.active : ""}`}>MONTHLY</p>
                <Switch checked={isYearly} onChange={() => setIsYearly((prev) => !prev)} />
                <p className={`${isYearly ? styles.active : ""}`}>YEARLY</p>
                <div className={styles.premiumModal__pricing_save}>
                  <p>SAVE 33%</p>
                </div>
              </div>
              <p className={styles.premiumModal__pricing}>
                <span>$6</span>
                /mo or <span>$4</span>
                /mo yearly
              </p>
              <Button
                id="go-premium-button"
                text="Go Premium"
                containerClassName={styles.premiumModal__premium_button}
                hoverClassName={styles.premiumModal__premium_button_hover}
                textClassName={styles.premiumModal__premium_button_text}
                onClick={() => handleGoPremiumClick()}
                showLoadingState={true}
              />
            </div>
            <div className={styles.premiumModal__features_lifetime_container}>
              <p onClick={() => handleGoPremiumClick(true)}>$79 for lifetime access</p>
              <p>Download Melofi Desktop</p>
            </div>
            <div className={styles.premiumModal__features_container}>
              <p className={styles.premiumModal__subtitle}>Everything with Premium</p>
              <div className={styles.premiumModal__features_list}>
                {featuresList.map((feature, index) => (
                  <p
                    style={{
                      color: index % 2 === 0 ? "var(--color-secondary)" : "var(--color-white)",
                    }}
                    key={index}
                  >
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PremiumModal;
