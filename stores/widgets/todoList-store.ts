import { Task } from "@/types/general";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import useUserStore from "../user-store";
import { updateTodoList } from "@/lib/firebase/actions/to-do-list-actions";
import { getTodoListFromDB } from "@/lib/firebase/getters/to-do-list-getters";
import { Logger } from "@/classes/Logger";

export interface TodoListState {
  isTodoListOpen: boolean;
  taskList: Task[];

  fetchTaskList: () => Promise<void>;
  getTodoListTitle: () => string;
  setIsTodoListOpen: (bool: boolean) => void;
  changeTaskStatus: (id: string, status: boolean) => void;
  addTask: (task: string) => void;
  removeTask: (id: string) => void;
  resetTodoListData: (uid: string, resetDb?: boolean) => Promise<void>;
}

const useTodoListStore = create<TodoListState>((set, get) => ({
  isTodoListOpen: false,
  taskList: [],

  fetchTaskList: async () => {
    Logger.getInstance().info("Fetching task list");

    const { currentUser } = useUserStore.getState();
    if (!currentUser?.authUser?.uid) console.log("User not logged in");

    const todoList = currentUser?.authUser?.uid
      ? await getTodoListFromDB(currentUser.authUser.uid)
      : [];
    set({ taskList: todoList });
    localStorage.setItem("todo_list", JSON.stringify(todoList));
  },

  getTodoListTitle: () => {
    if (get().taskList.length === 0) return "To - do List";
    const completedTasks = get().taskList.filter((task) => task.completed).length;
    return `TO - DO LIST (${completedTasks}/${get().taskList.length})`;
  },

  setIsTodoListOpen: (bool) => set({ isTodoListOpen: bool }),

  changeTaskStatus: (id, status) => {
    const { currentUser } = useUserStore.getState();

    const newTaskList = get().taskList.map((task) =>
      task.id === id ? { ...task, completed: status } : task
    );
    set({ taskList: newTaskList });
    localStorage.setItem("todo_list", JSON.stringify(newTaskList));
    currentUser?.authUser?.uid && updateTodoList(currentUser.authUser.uid, newTaskList);
  },

  addTask: (task) => {
    const { currentUser } = useUserStore.getState();

    const newTaskList = [
      ...get().taskList,
      {
        id: uuidv4(),
        text: task,
        completed: false,
      },
    ];
    set({
      taskList: newTaskList,
    });
    localStorage.setItem("todo_list", JSON.stringify(newTaskList));
    currentUser?.authUser?.uid && updateTodoList(currentUser.authUser.uid, newTaskList);
  },

  removeTask: (id) => {
    const { currentUser } = useUserStore.getState();

    const newTaskList = get().taskList.filter((task) => task.id !== id);
    localStorage.setItem("todo_list", JSON.stringify(newTaskList));
    set({ taskList: newTaskList });
    currentUser?.authUser?.uid && updateTodoList(currentUser.authUser.uid, newTaskList);
  },

  resetTodoListData: async (uid: string, resetDb: boolean = true) => {
    localStorage.removeItem("todo_list");
    set({ taskList: [] });
    resetDb && updateTodoList(uid, []);
  },
}));

export default useTodoListStore;
