import React, { useEffect, useState } from "react";
import styles from "./generalSettingsModal.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import useMenuStore from "@/stores/menu-store";
import Switch from "@/ui/components/shared/switch/Switch";
import Selector from "@/ui/components/shared/selector/Selector";
import { LongMenuOption } from "@/types/general";
import useAppStore from "@/stores/app-store";
import PremiumBadge from "@/ui/components/premiumBadge/PremiumBadge";
import useUserStore from "@/stores/user-store";

const delayOptions: LongMenuOption[] = [
  { id: "delay-option-0", label: "5 seconds" },
  { id: "delay-option-1", label: "15 seconds" },
  { id: "delay-option-2", label: "30 seconds" },
  { id: "delay-option-3", label: "1 minute" },
  { id: "delay-option-4", label: "Never" },
];

const musicControlHotKeys = [
  { action: "Play / Pause", hotKey: "Shift + Space" },
  { action: "Next Song", hotKey: "Shift + Right Arrow" },
  { action: "Previous Song", hotKey: "Shift + Left Arrow" },
  { action: "Volume Up", hotKey: "Shift + Up Arrow" },
  { action: "Volume Down", hotKey: "Shift + Down Arrow" },
  { action: "Mute / Unmute", hotKey: "Shift + M" },
  { action: "Toggle Volume Slider", hotKey: "Shift + V" },
];

const GeneralSettingsModal = () => {
  const { selectedOption, setSelectedOption } = useMenuStore();
  const {
    setInactivityThreshold,
    appSettings,
    setAlarmSoundEnabled,
    setPomodoroTimerSoundEnabled,
    setCalendarHoverEffectEnabled,
    setTodoListHoverEffectEnabled,
    setDailyQuoteEnabled,
    setShowPremiumModal,
    setSceneRouletteEnabled,
    setShowMiddleClock,
  } = useAppStore();
  const { isPremiumUser } = useUserStore();
  const isOpen = selectedOption === "General Settings";
  const [delayOption, setDelayOption] = useState<LongMenuOption>(delayOptions[0]);

  useEffect(() => {
    setDelayOption(convertThresholdToOption(appSettings.inActivityThreshold));
  }, []);

  const handleInactivityDelayChange = (option: LongMenuOption) => {
    setDelayOption(option);
    switch (option.id) {
      case "delay-option-0":
        setInactivityThreshold(5000);
        break;
      case "delay-option-1":
        setInactivityThreshold(15000);
        break;
      case "delay-option-2":
        setInactivityThreshold(30000);
        break;
      case "delay-option-3":
        setInactivityThreshold(60000);
        break;
      case "delay-option-4":
        setInactivityThreshold(0);
        break;
      default:
        break;
    }
  };

  const convertThresholdToOption = (threshold: number): LongMenuOption => {
    switch (threshold) {
      case 5000:
        return delayOptions[0];
      case 15000:
        return delayOptions[1];
      case 30000:
        return delayOptions[2];
      case 60000:
        return delayOptions[3];
      case 0:
        return delayOptions[4];
      default:
        return delayOptions[0];
    }
  };

  return (
    <Modal
      id="general-settings-modal"
      className={styles.generalSettingsModal__container}
      isOpen={isOpen}
      close={() => setSelectedOption(null)}
      draggable
      title="SETTINGS"
      titleClassName={styles.generalSettingsModal__title}
    >
      <div className={styles.generalSettingsModal__content}>
        {/* Hide Interface */}
        <div className={styles.generalSettingsModal__settings_section}>
          <div>
            <p className={styles.generalSettingsModal__setting_section_title}>Hide Interface</p>
            <p className={styles.generalSettingsModal__setting_description}>
              Hide the interface after a certain amount of time to focus on your work.
            </p>
          </div>

          <div className={styles.generalSettingsModal__setting_container}>
            <p>Inactivity Delay</p>
            <Selector
              id="general-settings-delay-selector"
              options={delayOptions}
              onSelected={handleInactivityDelayChange}
              selectedOption={delayOption}
            />
          </div>
        </div>
        {/* Sound & Notifications */}
        <div className={styles.generalSettingsModal__settings_section}>
          <div>
            <p className={styles.generalSettingsModal__setting_section_title}>
              Sound & Notifications
            </p>
            <p className={styles.generalSettingsModal__setting_description}>
              Turn sound alerts on or off for your Pomodoro timer and alarms, or opt for silent
              notifications.
            </p>
          </div>
          <div className={styles.generalSettingsModal__setting_container}>
            <div>
              <p>Pomodoro Timer</p>
            </div>
            <Switch
              checked={appSettings.pomodoroTimerSoundEnabled}
              onChange={() => setPomodoroTimerSoundEnabled(!appSettings.pomodoroTimerSoundEnabled)}
            />
          </div>
          <div style={{ marginTop: 3 }} className={styles.generalSettingsModal__setting_container}>
            <div>
              <p>Alarms</p>
            </div>
            <Switch
              checked={appSettings.alarmSoundEnabled}
              onChange={() => setAlarmSoundEnabled(!appSettings.alarmSoundEnabled)}
            />
          </div>
        </div>
        {/* Hover Effects */}
        <div className={styles.generalSettingsModal__settings_section}>
          <div>
            <p className={styles.generalSettingsModal__setting_section_title}>Hover Effects</p>
            <p className={styles.generalSettingsModal__setting_description}>
              Enable or disable the fade effect when hovering over the calendar and to-do list.
            </p>
          </div>
          <div className={styles.generalSettingsModal__setting_container}>
            <div>
              <p>Calendar</p>
            </div>
            <Switch
              checked={appSettings.calendarHoverEffectEnabled}
              onChange={() =>
                setCalendarHoverEffectEnabled(!appSettings.calendarHoverEffectEnabled)
              }
            />
          </div>
          <div style={{ marginTop: 3 }} className={styles.generalSettingsModal__setting_container}>
            <div>
              <p>To-Do List</p>
            </div>
            <Switch
              checked={appSettings.todoListHoverEffectEnabled}
              onChange={() =>
                setTodoListHoverEffectEnabled(!appSettings.todoListHoverEffectEnabled)
              }
            />
          </div>
        </div>
        {/* Quotes */}
        <div className={styles.generalSettingsModal__settings_section}>
          <div className={styles.generalSettingsModal__setting_container}>
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <p>Show Daily Quotes</p>
              {!isPremiumUser && (
                <PremiumBadge
                  id="premium-badge-show-quotes"
                  onClick={() => setShowPremiumModal("show_quotes")}
                />
              )}
            </div>
            <Switch
              disabled={!isPremiumUser}
              checked={isPremiumUser && appSettings.showDailyQuote}
              onChange={() => setDailyQuoteEnabled(!appSettings.showDailyQuote)}
            />
          </div>
          <p className={styles.generalSettingsModal__setting_description}>
            Display a daily motivational quote in your workspace.
          </p>
        </div>

        {/* Clock Position */}
        <div className={styles.generalSettingsModal__settings_section}>
          <div className={styles.generalSettingsModal__setting_container}>
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <p>Show Middle Clock</p>
            </div>
            <Switch
              checked={appSettings.showMiddleClock}
              onChange={() => setShowMiddleClock(!appSettings.showMiddleClock)}
            />
          </div>
          <p className={styles.generalSettingsModal__setting_description}>
            Display clock in the middle of the screen for better visibility.
          </p>
        </div>

        {/* Scene Settings */}
        <div className={styles.generalSettingsModal__settings_section}>
          <div>
            <p className={styles.generalSettingsModal__setting_section_title}>Scene</p>
          </div>
          <div className={styles.generalSettingsModal__setting_container}>
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <p>Scene Roulette</p>
              {!isPremiumUser && (
                <PremiumBadge
                  id="premium-badge-scenes"
                  onClick={() => setShowPremiumModal("scenes")}
                />
              )}
            </div>
            <Switch
              disabled={!isPremiumUser}
              checked={isPremiumUser && appSettings.sceneRouletteEnabled}
              onChange={() => setSceneRouletteEnabled(!appSettings.sceneRouletteEnabled)}
            />
          </div>
          <p className={styles.generalSettingsModal__setting_description}>
            Loads a random scene every visit to keep your focus fresh.
          </p>
        </div>

        {/* Hot Keys */}
        <div className={styles.generalSettingsModal__settings_section}>
          <div>
            <p className={styles.generalSettingsModal__setting_section_title}>Hot Keys</p>
          </div>
          <div>
            <div
              style={{ paddingLeft: 10 }}
              className={styles.generalSettingsModal__setting_section_title}
            >
              <p>Music Controls</p>
            </div>
            <div style={{ paddingLeft: 10, display: "flex", flexDirection: "column", gap: 5 }}>
              {musicControlHotKeys.map((control, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ color: "var(--color-secondary)" }}>{control.action}</p>
                  <p
                    style={{
                      border: "1px solid var(--color-secondary-opacity)",
                      padding: "2px",
                      borderRadius: 5,
                      backgroundColor: "var(--color-primary)",
                    }}
                  >
                    {control.hotKey}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GeneralSettingsModal;
