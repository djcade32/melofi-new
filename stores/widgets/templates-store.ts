import { Template } from "@/types/interfaces/templates";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { HiTemplate } from "@/imports/icons";
import { Study, Relax, Sleepy } from "@/data/songs";
import cloneDeep from "lodash/cloneDeep";

import useMusicPlayerStore from "../music-player-store";
import useNotificationProviderStore from "../notification-provider-store";

import useSceneStore from "../scene-store";
import useMixerStore from "../mixer-store";
import { NotificationType } from "@/types/general";
import {
  addTemplateToDb,
  deleteAllTemplatesFromDb,
  deleteTemplateFromDb,
} from "@/lib/firebase/actions/templates-actions";
import useUserStore from "../user-store";
import { getTemplatesFromDb } from "@/lib/firebase/getters/templates-getter";
import { buildTemplatesList } from "@/lib/type-builders/templates-type-builder";

export interface TemplatesState {
  isTemplatesOpen: boolean;
  selectedTemplate: Template | null;
  templateList: Template[];
  wasTemplateSelected: boolean;

  setIsTemplatesOpen: (isOpen: boolean) => void;
  createTemplate: (name: string) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  setSelectedTemplate: (template: Template | null) => void;
  settingsChanged: () => void;
  fetchTemplates: () => Promise<void>;
  resetTemplatesData: () => Promise<void>;
}

const useTemplatesStore = create<TemplatesState>((set, get) => ({
  isTemplatesOpen: false,
  selectedTemplate: null,
  templateList: [],
  wasTemplateSelected: false,

  setIsTemplatesOpen: (isOpen) => set({ isTemplatesOpen: isOpen }),

  deleteTemplate: async (id) => {
    try {
      await deleteTemplateFromDb(useUserStore.getState().currentUser?.authUser?.uid, id);

      const updatedTemplates = get().templateList.filter((template) => template.id !== id);
      if (get().selectedTemplate?.id === id) {
        get().setSelectedTemplate(null);
      }
      set({ templateList: updatedTemplates });
    } catch (error) {
      console.log("Error deleting template: ", error);
    }
  },

  createTemplate: async (name: string) => {
    try {
      const uid = useUserStore.getState().currentUser?.authUser?.uid;

      const newMixerSoundsConfig = cloneDeep(useMixerStore.getState().mixerSoundsConfig);
      const playlistName = useMusicPlayerStore.getState().currentPlaylist.name;
      const scene = useSceneStore.getState().currentScene;
      const newTemplate: Template = {
        id: uuidv4(),
        name,
        playlistName,
        scene,
        mixerSoundConfig: newMixerSoundsConfig,
      };
      const templates = get().templateList;
      templates.unshift(newTemplate);
      // Update templates in the database
      await addTemplateToDb(uid, newTemplate);
      set({ templateList: templates, selectedTemplate: Object.freeze(newTemplate) });
    } catch (error) {
      console.log("Error creating template: ", error);
    }
  },

  setSelectedTemplate: (template) => {
    if (template) {
      if (template.id === get()?.selectedTemplate?.id) return;

      set({ selectedTemplate: template, wasTemplateSelected: true });
      setTemplateSettings(template);
      useNotificationProviderStore.getState().addNotification({
        message: `${template.name} template selected`,
        type: "normal",
        icon: HiTemplate,
      } as NotificationType);
    } else {
      set({ selectedTemplate: null });
    }
  },

  settingsChanged: () => {
    const { selectedTemplate, setSelectedTemplate, wasTemplateSelected } = get();
    const currentScene = useSceneStore.getState().currentScene;
    const currentPlaylist = useMusicPlayerStore.getState().currentPlaylist.name;
    const mixerSoundsConfig = useMixerStore.getState().mixerSoundsConfig;

    if (!selectedTemplate || wasTemplateSelected)
      return wasTemplateSelected && set({ wasTemplateSelected: false });

    if (
      currentScene !== selectedTemplate?.scene ||
      currentPlaylist !== selectedTemplate.playlistName ||
      mixerSoundsConfig !== selectedTemplate.mixerSoundConfig
    ) {
      setSelectedTemplate(null);
    }
  },

  fetchTemplates: async () => {
    try {
      const uid = useUserStore.getState().currentUser?.authUser?.uid;
      if (!uid) return;
      const templates = await getTemplatesFromDb(uid);
      set({ templateList: buildTemplatesList(templates) });
    } catch (error) {
      console.log("Error fetching templates: ", error);
    }
  },

  resetTemplatesData: async () => {
    const uid = useUserStore.getState().currentUser?.authUser?.uid;
    if (!uid) {
      return;
    }
    try {
      await deleteAllTemplatesFromDb(uid);
      set({ templateList: [], selectedTemplate: null, wasTemplateSelected: false });
    } catch (error) {
      console.log("Error resetting templates data: ", error);
    }
  },
}));

// Helper functions

const setTemplateSettings = (template: Template) => {
  useSceneStore.getState().setCurrentScene(template.scene);
  useMixerStore.getState().setMixerSoundsConfig(template.mixerSoundConfig);
  useMusicPlayerStore.getState().setCurrentPlaylist(getPlaylistByName(template.playlistName));
};

const getPlaylistByName = (name: string) => {
  switch (name) {
    case "Study":
      return Study;
    case "Relax":
      return Relax;
    case "Sleepy":
      return Sleepy;
    default:
      return Study;
  }
};

export default useTemplatesStore;
