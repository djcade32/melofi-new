import { Task } from "@/types/general";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface TodoListState {
  isTodoListOpen: boolean;
  taskList: Task[];

  fetchTaskList: () => void;
  getTodoListTitle: () => string;
  setIsTodoListOpen: (bool: boolean) => void;
  changeTaskStatus: (id: string, status: boolean) => void;
  addTask: (task: string) => void;
  removeTask: (id: string) => void;
  resetTodoListData: () => void;
}

const useTodoListStore = create<TodoListState>((set, get) => ({
  isTodoListOpen: false,
  taskList: [],

  fetchTaskList: () => {
    const taskList = localStorage.getItem("todo_list");
    if (taskList) {
      set({ taskList: JSON.parse(taskList) });
    }
  },

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
    localStorage.setItem("todo_list", JSON.stringify(newTaskList));
  },

  addTask: (task) => {
    set({
      taskList: [
        ...get().taskList,
        {
          id: uuidv4(),
          text: task,
          completed: false,
        },
      ],
    });
    localStorage.setItem("todo_list", JSON.stringify(get().taskList));
  },

  removeTask: (id) => {
    const newTaskList = get().taskList.filter((task) => task.id !== id);
    localStorage.setItem("todo_list", JSON.stringify(newTaskList));
    set({ taskList: newTaskList });
  },

  resetTodoListData: () => {
    localStorage.removeItem("todo_list");
    set({ taskList: [] });
  },
}));

export default useTodoListStore;
