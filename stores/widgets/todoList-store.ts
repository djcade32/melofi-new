import { Task } from "@/types/interfaces";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface TodoListState {
  isTodoListOpen: boolean;
  taskList: Task[];
  getTodoListTitle: () => string;

  setIsTodoListOpen: (bool: boolean) => void;
  changeTaskStatus: (id: string, status: boolean) => void;
  addTask: (task: string) => void;
  removeTask: (id: string) => void;
}

const useTodoListStore = create<TodoListState>((set, get) => ({
  isTodoListOpen: false,
  taskList: [],

  getTodoListTitle: () => {
    if (get().taskList.length === 0) return "TO - DO LIST";
    const completedTasks = get().taskList.filter((task) => task.completed).length;
    return `TO - DO LIST (${completedTasks}/${get().taskList.length})`;
  },
  setIsTodoListOpen: (bool) => set({ isTodoListOpen: bool }),
  changeTaskStatus: (id, status) => {
    const newTaskList = get().taskList.map((task) =>
      task.id === id ? { ...task, completed: status } : task
    );
    set({ taskList: newTaskList });
  },
  addTask: (task) =>
    set({
      taskList: [
        ...get().taskList,
        {
          id: uuidv4(),
          text: task,
          completed: false,
        },
      ],
    }),
  removeTask: (id) => {
    const newTaskList = get().taskList.filter((task) => task.id !== id);
    set({ taskList: newTaskList });
  },
}));

export default useTodoListStore;
