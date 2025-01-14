import { Template } from "@/types/interfaces/templates";
import { scenes } from "@/data/scenes";
import { Scene } from "@/types/general";
import { sounds } from "@/data/sounds";
import { MixerSoundConfig } from "@/types/interfaces/mixer";
import { cloneDeep } from "lodash";

export const buildTemplatesList = (templates: any[]): Template[] => {
  if (!templates) {
    return [];
  }
  return templates.map((template) => buildTemplate(template));
};

export const buildTemplate = (template: any): Template => {
  const scene = getSceneByName(template.sceneName);
  const mixerSoundConfig = buildMixerSoundConfig(template.mixerSoundConfig);
  if (!scene) {
    throw new Error(`Scene with name ${template.sceneName} not found`);
  }
  return {
    id: template.id,
    name: template.name,
    playlistName: template.playlistName,
    scene,
    mixerSoundConfig,
  };
};

const getSceneByName = (name: string): Scene | undefined => {
  return scenes.find((scene) => scene.name === name);
};

const buildMixerSoundConfig = (config: any): MixerSoundConfig => {
  const soundConfig: MixerSoundConfig = cloneDeep(sounds);
  for (const key in config) {
    if (!sounds[key]) {
      throw new Error(`Sound with key ${key} not found`);
    }

    soundConfig[key] = {
      ...soundConfig[key],
      volume: config[key],
    };
  }

  return soundConfig;
};
