import { doc, getDoc, setDoc } from "firebase/firestore";
import { Template, TemplatesPayload } from "@/types/interfaces/templates";
import { getFirebaseDB } from "../firebaseClient";
import { MixerSoundConfig } from "@/types/interfaces/mixer";
import { createLogger } from "@/utils/logger";

const Logger = createLogger("Templates Actions");
const db = getFirebaseDB();

export const addTemplateToDb = async (uid: string | null | undefined, template: Template) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  if (!uid) {
    throw new Error("UID is not provided");
  }

  try {
    const userDoc = doc(db, `widget_data/${uid}`);

    // Retrieve the current templatesList from the database
    const userDocSnapshot = await getDoc(userDoc);

    let currentTemplatesList: Template[] = [];
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      currentTemplatesList = userData.templatesList || [];
    }

    const reducedTemplate: TemplatesPayload = {
      id: template.id,
      name: template.name,
      playlistName: template.playlistName,
      sceneName: template.scene.name,
      mixerSoundConfig: reduceMixerSoundConfig(template.mixerSoundConfig),
    };

    // Merge the current templatesList with the new templates
    const updatedTemplatesList = [reducedTemplate, ...currentTemplatesList];

    // Update the database with the merged templatesList
    await setDoc(userDoc, { templatesList: updatedTemplatesList }, { merge: true });
  } catch (error) {
    Logger.error("Error adding template to db:", error);
    throw error;
  }
};

export const deleteTemplateFromDb = async (uid: string | null | undefined, templateId: string) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  if (!uid) {
    throw new Error("UID is not provided");
  }

  try {
    const userDoc = doc(db, `widget_data/${uid}`);

    // Retrieve the current templatesList from the database
    const userDocSnapshot = await getDoc(userDoc);

    let currentTemplatesList: Template[] = [];
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      currentTemplatesList = userData.templatesList || [];
    }

    // Filter out the template to be deleted
    const updatedTemplatesList = currentTemplatesList.filter(
      (template) => template.id !== templateId
    );

    // Update the database with the updated templatesList
    await setDoc(userDoc, { templatesList: updatedTemplatesList }, { merge: true });
  } catch (error) {
    Logger.error("Error deleting template in db:", error);
    throw error;
  }
};

export const deleteAllTemplatesFromDb = async (uid: string | null | undefined) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  if (!uid) {
    throw new Error("UID is not provided");
  }

  try {
    const userDoc = doc(db, `widget_data/${uid}`);

    // Update the database with an empty templatesList
    await setDoc(userDoc, { templatesList: [] }, { merge: true });
  } catch (error) {
    Logger.error("Error deleting all templates in db:", error);
    throw error;
  }
};

const reduceMixerSoundConfig = (mixerSoundConfig: MixerSoundConfig) => {
  const reducedMixerSoundConfig: Record<string, number> = {};
  Object.keys(mixerSoundConfig).forEach((key) => {
    if (mixerSoundConfig[key].volume) reducedMixerSoundConfig[key] = mixerSoundConfig[key].volume;
  });
  return reducedMixerSoundConfig;
};
