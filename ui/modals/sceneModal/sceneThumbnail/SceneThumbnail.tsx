import { Scene } from "@/types/general";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styles from "./sceneThumbnail.module.css";
import useSceneStore from "@/stores/scene-store";

interface SceneThumbnailProps {
  scene: Scene;
  setSelectedScene: Dispatch<SetStateAction<Scene>>;
}

const iconProps = {
  size: 30,
  color: "var(--color-white)",
};

const SceneThumbnail = ({ scene, setSelectedScene }: SceneThumbnailProps) => {
  const { currentScene } = useSceneStore();
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

  return (
    <div
      ref={ref}
      className={`${styles.sceneThumbnail__container} ${
        currentScene.id === scene.id && styles.selected
      }`}
      style={{
        backgroundImage: isVisible ? `url(${scene.thumbnail})` : "none",
        backgroundSize: "cover",
        filter: isVisible ? "none" : "blur(5px)",
      }}
      onClick={() => setSelectedScene(scene)}
    >
      <div>
        {!isVisible && <p>Loading...</p>}
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
