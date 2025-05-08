import { SceneCounts, Task } from "@/types/general";
import { PomodoroTimerStats, PomodoroTimerTask } from "../pomodoro_timer";
import { Alarm } from "../alarms";
import { Template } from "../templates";
import { AchievementTypes } from "@/enums/general";

export interface IndexedDBAppSettings {
  alarm: { alarmSoundEnabled: boolean };
  calendar: { calendarHoverEffectEnabled: boolean };
  inActivityThreshold: { inActivityThreshold: number };
  pomodoro: { pomodoroTimerSoundEnabled: boolean };
  quote: { showDailyQuote: boolean };
  todo: { todoListHoverEffectEnabled: boolean };
  sceneRoulette: { sceneRouletteEnabled: boolean };
  userUid: string | null;
  _lastSynced: string;
}

export interface IndexedDBUserStats {
  alarm: { alarmsExpiredCount: number | undefined };
  pomodoroTimer: PomodoroTimerStats | undefined;
  notes: { totalNotesCreated: number | undefined };
  sceneCounts: SceneCounts | null | undefined;
  achievements: { achievements: AchievementTypes[] | undefined };
  _lastSynced: string;
}

export interface IndexedDBWidgetData {
  alarm: { alarmList: Alarm[] };
  notesList: { notesList: string };
  selectedNote: { selectedNote: string };
  pomodoroTimer: { pomodoroTasks: PomodoroTimerTask[] };
  templates: { templatesList: Template[] };
  todos: { todosList: Task };
  _lastSynced: string;
}
