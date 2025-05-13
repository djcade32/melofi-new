import { Scene } from "@/types/general";
import React, { useEffect, useRef, useState } from "react";
import styles from "./sceneThumbnail.module.css";
import useSceneStore from "@/stores/scene-store";
import useUserStore from "@/stores/user-store";
import { PiCrownSimpleFill } from "@/imports/icons";
import useAppStore from "@/stores/app-store";
import { useOnboardingTourContext } from "@/contexts/OnboardingTourContext";

interface SceneThumbnailProps {
  scene: Scene;
  setSelectedScene: (newScene: Scene) => void;
}

const iconProps = {
  size: 30,
  color: "var(--color-white)",
};

const SceneThumbnail = ({ scene, setSelectedScene }: SceneThumbnailProps) => {
  const { currentScene, toggleSceneModal } = useSceneStore();
  const { isPremiumUser } = useUserStore();
  const { setShowPremiumModal } = useAppStore();
  const { tourIsActive, moveToNextStep } = useOnboardingTourContext();

  const showPremiumIcon = scene.premium && !isPremiumUser;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true); // Set visible when in view
          observer.disconnect(); // Stop observing once loaded
        }
      },
      { threshold: 0.01 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  const handleThumbnailClick = () => {
    if (showPremiumIcon) {
      setShowPremiumModal("scenes");
      return;
    }
    setSelectedScene(scene);
    // If tour is active, move to the next step and close the modal
    if (tourIsActive) {
      moveToNextStep();
      toggleSceneModal(false);
    }
  };

  return (
    <div
      id={`scene-${scene.id}-thumbnail`}
      ref={ref}
      className={`${styles.sceneThumbnail__container} ${
        currentScene.id === scene.id && styles.selected
      }`}
      style={{
        backgroundImage: isVisible ? `url(${scene.thumbnail})` : "none",
        backgroundSize: "cover",
        filter: isVisible ? "none" : "blur(5px)",
      }}
      onClick={handleThumbnailClick}
    >
      <div>
        {!isVisible && <p>Loading...</p>}
        {showPremiumIcon && (
          <PiCrownSimpleFill
            className={styles.sceneThumbnail__premium_icon}
            size={25}
            color="var(--color-effect-opacity)"
          />
        )}
        <p className={styles.sceneThumbnail__sceneName} style={{ fontFamily: scene.fontFamily }}>
          {scene.name}
        </p>
        <div className={styles.sceneThumbnail__container_soundIcons}>
          {scene.soundIcons.map((sound, index) =>
            React.createElement(sound.icon, { key: index, ...iconProps })
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneThumbnail;
