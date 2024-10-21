import React, { useEffect, useState } from "react";
import styles from "./sceneSoundsSection.module.css";
import useSceneStore from "@/stores/scene-store";
import useMixerStore from "@/stores/mixer-store";
import MixerSlider from "@/components/mixerSlider/MixerSlider";
import { Sound } from "@/types/interfaces";

const SceneSoundsSection = () => {
  const { currentScene } = useSceneStore();
  const { getSceneSounds, mixerSoundsConfig } = useMixerStore();

  const [sceneSounds, setSceneSounds] = useState<Sound[] | undefined>(undefined);

  useEffect(() => {
    setSceneSounds(getSceneSounds(currentScene));
  }, [currentScene, mixerSoundsConfig]);

  return (
    <div className={styles.sceneSoundsSection__container}>
      <p className={styles.sceneSoundsSection__title}>SCENE SOUNDS</p>
      <div className={styles.sceneSoundsSection__mixerSliders_container}>
        {sceneSounds?.map((sound) => (
          <MixerSlider
            key={sound.name}
            soundPath={sound.path}
            soundName={sound.name}
            soundVolume={sound.volume}
            soundIcon={sound.icon}
            premium={sound.premium}
          />
        ))}
      </div>
    </div>
  );
};

export default SceneSoundsSection;
