import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDB } from "../firebaseClient";
import { Alarm } from "@/types/interfaces/alarms";
import { Note, Task } from "@/types/general";
import { PomodoroTimerTask } from "@/types/interfaces/pomodoro_timer";
import { Template } from "@/types/interfaces/templates";
const db = getFirebaseDB();

interface WidgetData {
  alarmsList: Alarm[];
  notesList: Note[];
  selectedNote: Note | null;
  pomodoroTasks: PomodoroTimerTask[];
  templatesList: Template[];
  todoList: Task[];
}

export const saveFirebaseWidgetData = async (uid: string, widgetData: WidgetData) => {
  if (!db) {
    throw new Error("Firebase DB is not initialized");
  }
  try {
    const userDoc = doc(db, `widget_data/${uid}`);
    await setDoc(userDoc, widgetData, { merge: true });
    return { result: true, message: "Widget data saved successfully" };
  } catch (error) {
    console.log("Error saving widget data in Firebase: ", error);
    return { result: false, message: error };
  }
};
