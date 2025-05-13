"use client";

import React, { createContext, useContext, useState } from "react";
import { Driver, driver } from "driver.js";
import "driver.js/dist/driver.css";
import useMenuStore from "@/stores/menu-store";
import useMixerStore from "@/stores/mixer-store";
import useToolsStore from "@/stores/tools-store";
import useSceneStore from "@/stores/scene-store";
import { wait } from "@/utils/general";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Onboarding Tour Context");

export interface OnboardingTourContextInterface {
  driverObj: Driver;
  tourIsActive: boolean;
  startOnboarding: () => void;
  moveToNextStep: (timeout?: number) => void;
}

const OnboardingTourContext = createContext<OnboardingTourContextInterface>({
  driverObj: driver({
    showProgress: true,
    animate: true,
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Sign Up",
    allowClose: false,
    showButtons: ["next", "close"],
    stageRadius: 10,
    popoverClass: "driverjs-theme",
    steps: [],
  }),
  tourIsActive: false,

  startOnboarding: () => {},
  moveToNextStep: () => {},
});

interface OnboardingTourContextProviderProps {
  children: React.ReactNode;
}

const OnboardingTourContextProvider = ({ children }: OnboardingTourContextProviderProps) => {
  const { setSelectedOption } = useMenuStore();
  const { toggleMixerModal } = useMixerStore();
  const { toggleTools } = useToolsStore();
  const { toggleSceneModal } = useSceneStore();

  const [tourIsActive, setTourIsActive] = useState(false);

  const driverObj = driver({
    showProgress: true,
    animate: true,
    nextBtnText: "Next",
    prevBtnText: "Back",
    doneBtnText: "Sign Up",
    allowClose: false,
    showButtons: ["next", "close"],
    stageRadius: 10,
    popoverClass: "driverjs-theme",
    steps: [
      {
        popover: {
          title: "Welcome to Melofi 👋",
          description: `
        Let's take a quick tour to help you get the most out of your focus sessions.
        We'll show you how to play ambient sounds, use your productivity tools, and customize your environment.
      `,
          align: "center",
        },
      },
      {
        element: "#mixer-button",
        popover: {
          title: "Start Your Focus Session",
          description:
            "Click here to open the mixer to change the playlist and play relaxing sounds like rain or forest ambiance.",
          side: "bottom",
          onNextClick: () => {
            toggleMixerModal(true);
            driverObj.moveNext();
            //   wait(300).then(() => {
            //     driverObj.moveNext();
            //   });
          },
        },
      },
      {
        element: "#mixer-modal",
        popover: {
          title: "Mixer Panel",
          description:
            "This is where you can mix background sounds to create your perfect environment.",
          side: "left",
          onNextClick: () => {
            toggleMixerModal(false);
            driverObj.moveNext();
          },
        },
        // onHighlightStarted: () => waitForElement("#mixer-modal"),
      },
      {
        element: "#tools-button",
        popover: {
          title: "Access Your Tools",
          description: "Use the toolbar to open widgets like the alarm, notes, timer, and more.",
          side: "right",
          onNextClick: () => {
            toggleTools(true);
            wait(500).then(() => {
              driverObj.moveNext();
            });
          },
        },
      },
      {
        element: "#toolbar",
        popover: {
          title: "Toolbar",
          description:
            "Access your productivity tools like the timer, notes, and Pomodoro timer here.",
          side: "left",
          onNextClick: () => {
            toggleTools(false);
            driverObj.moveNext();
          },
        },
        // onHighlightStarted: () => waitForElement("#toolbar"),
        disableActiveInteraction: true,
      },
      {
        element: "#scenes-button",
        popover: {
          title: "Set the Mood",
          description:
            "Click here to change the background scene and personalize your focus environment.",
          side: "left",
          onNextClick: () => {
            toggleSceneModal(true);
            wait(1000).then(() => {
              driverObj.moveNext();
            });
          },
        },
      },
      {
        element: "#scene-modal",
        popover: {
          title: "Choose a Scene",
          description:
            "Pick a relaxing background like a cafe or cozy bedroom to help you stay focused.",
          side: "top",
          onNextClick: () => {
            toggleSceneModal(false);
            driverObj.moveNext();
          },
        },
        // onHighlightStarted: async () => waitForElement("#scene-modal"),
      },
      {
        popover: {
          title: "You're All Set! 🎉",
          description:
            "Enjoy your personalized focus space. You're ready to dive in and start your session!",
          align: "center",
          onNextClick: () => {
            localStorage.setItem("onboardingCompleted", "true");
            setSelectedOption("Account");
            driverObj.moveNext();
          },
        },
      },
    ],
  });

  const startOnboarding = () => {
    const onboardingCompleted = localStorage.getItem("onboardingCompleted");
    let startTour = false;
    if (onboardingCompleted) {
      if (!JSON.parse(onboardingCompleted)) {
        startTour = true;
      }
    } else {
      startTour = true;
    }
    if (startTour) {
      Logger.info("Starting onboarding tour");
      setTourIsActive(true);
      driverObj.drive();
    }
  };

  const moveToNextStep = (timeout: number = 0) => {
    setTimeout(() => {
      driverObj.moveNext();
    }, timeout);
  };

  // Utility to wait for an element before continuing
  const waitForElement = (selector: string, timeout = 5000) => {
    return new Promise<void>((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;

      const check = () => {
        if (document.querySelector(selector)) {
          resolve();
        } else if (elapsed >= timeout) {
          reject(new Error(`Element ${selector} not found within timeout`));
        } else {
          elapsed += interval;
          setTimeout(check, interval);
        }
      };

      check();
    });
  };
  return (
    <OnboardingTourContext.Provider
      value={{ driverObj, tourIsActive, startOnboarding, moveToNextStep }}
    >
      {children}
    </OnboardingTourContext.Provider>
  );
};

export default OnboardingTourContextProvider;

export const useOnboardingTourContext = () => useContext(OnboardingTourContext);
