import React from "react";
import styles from "./sceneSoundsSection.module.css";
import useSceneStore from "@/stores/scene-store";
import useMixerStore from "@/stores/mixer-store";
import MixerSlider from "@/components/mixerSlider/MixerSlider";

const SceneSoundsSection = () => {
  const { currentScene } = useSceneStore();
  const { getSceneSounds } = useMixerStore();

  return (
    <div className={styles.sceneSoundsSection__container}>
      <p className={styles.sceneSoundsSection__title}>SCENE SOUNDS</p>
      <div className={styles.sceneSoundsSection__mixerSliders_container}>
        {getSceneSounds(currentScene).map((sound) => (
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
