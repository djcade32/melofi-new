import React, { useEffect, useState } from "react";
import styles from "./allSoundsSection.module.css";
import useSceneStore from "@/stores/scene-store";
import useMixerStore from "@/stores/mixer-store";
import MixerSlider from "@/ui/components/mixerSlider/MixerSlider";
import Tooltip from "@/ui/components/shared/tooltip/Tooltip";
import { Sound } from "@/types/interfaces/mixer";

const AllSoundsSection = () => {
  const { currentScene } = useSceneStore();
  const { getOtherSounds, mixerSoundsConfig } = useMixerStore();

  const [otherSounds, setOtherSounds] = useState<Sound[] | undefined>(undefined);

  useEffect(() => {
    setOtherSounds(getOtherSounds(currentScene));
  }, [currentScene, mixerSoundsConfig]);

  return (
    <div className={styles.allSoundsSection__container}>
      <p className={styles.allSoundsSection__title}>ALL SOUNDS</p>
      <div className={styles.allSoundsSection__mixerSliders_container}>
        {otherSounds?.map((sound) => (
          <Tooltip
            key={sound.name}
            text="Upgrade to use all sounds"
            disabled={!sound.premium}
            noFlex
            disableCloseOnClick
          >
            <MixerSlider
              soundPath={sound.path}
              soundName={sound.name}
              soundVolume={sound.volume}
              soundIcon={sound.icon}
              premium={sound.premium}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default AllSoundsSection;
