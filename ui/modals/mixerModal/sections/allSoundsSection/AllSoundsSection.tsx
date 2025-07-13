import React, { useEffect, useState } from "react";
import styles from "./allSoundsSection.module.css";
import useSceneStore from "@/stores/scene-store";
import useMixerStore from "@/stores/mixer-store";
import MixerSlider from "@/ui/components/mixerSlider/MixerSlider";
import Tooltip from "@/ui/components/shared/tooltip/Tooltip";
import { Sound } from "@/types/interfaces/mixer";
import useUserStore from "@/stores/user-store";

const AllSoundsSection = () => {
  const { currentScene } = useSceneStore();
  const { getOtherSounds, mixerSoundsConfig } = useMixerStore();
  const { isPremiumUser, isUserLoggedIn } = useUserStore();

  const [otherSounds, setOtherSounds] = useState<Sound[] | undefined>(undefined);

  useEffect(() => {
    setOtherSounds(getOtherSounds(currentScene));
  }, [currentScene, mixerSoundsConfig]);

  const soundIsDisabled = (sound: Sound) => sound.premium && !isUserLoggedIn;
  // const soundIsDisabled = (sound: Sound) => sound.premium && !isPremiumUser;

  return (
    <div className={styles.allSoundsSection__container}>
      <p className={styles.allSoundsSection__title}>ALL SOUNDS</p>
      <div className={styles.allSoundsSection__mixerSliders_container}>
        {otherSounds?.map((sound) => (
          <Tooltip
            key={sound.name}
            text={soundIsDisabled(sound) ? "Sign in to use all sounds" : undefined}
            // text={soundIsDisabled(sound) ? "Upgrade to use all sounds" : undefined}
            disabled={!soundIsDisabled(sound)}
            noFlex
            disableCloseOnClick
          >
            <MixerSlider
              soundPath={sound.path}
              soundName={sound.name}
              soundVolume={sound.volume}
              soundIcon={sound.icon}
              premium={soundIsDisabled(sound)}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default AllSoundsSection;
