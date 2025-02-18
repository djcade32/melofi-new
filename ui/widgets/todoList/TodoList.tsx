import React, { useEffect, useState } from "react";
import styles from "./todoList.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import useTodoListStore from "@/stores/widgets/todoList-store";
import { FiPlus } from "@/imports/icons";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import TodoListItem from "./TodoListItem";
import useAppStore from "@/stores/app-store";

const TodoList = () => {
  const { isTodoListOpen, setIsTodoListOpen, taskList, addTask, getTodoListTitle, fetchTaskList } =
    useTodoListStore();
  const { appSettings } = useAppStore();

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // Handle enter key press to add task
  useEffect(() => {
    fetchTaskList();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const task = document.getElementById("to-do-list-widget-input")?.getAttribute("value");
        task && handleAddTask(task);
      }
    };
    const input = document.getElementById("to-do-list-widget-input");
    input?.addEventListener("keydown", handleKeyDown);

    return () => {
      input?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Focus input when modal is opened
  useEffect(() => {
    if (isTodoListOpen) {
      document.getElementById("to-do-list-widget-input")?.focus();
    }
  }, [isTodoListOpen]);

  const handleAddTask = (task: string) => {
    if (task.trim() === "") return;
    addTask(task.trim());
    setTaskInput("");
  };

  return (
    <Modal
      id="to-do-list-widget"
      isOpen={isTodoListOpen}
      className={styles.todoList__container}
      title={getTodoListTitle()}
      titleClassName={styles.todoList__title}
      draggable
      fadeCloseIcon
      close={() => setIsTodoListOpen(!isTodoListOpen)}
      isWidget
      name="to-do-list"
      fadeBackground={appSettings.todoListHoverEffectEnabled}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 10 }}>
        <input
          id="to-do-list-widget-input"
          className={`${
            appSettings.todoListHoverEffectEnabled
              ? styles.todoList__input_background_fade
              : styles.todoList__input
          } ${
            (isInputFocused || (!isHovered && appSettings.todoListHoverEffectEnabled)) &&
            styles.todoList__input_focused
          }`}
          placeholder="Add new task"
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          autoFocus={true}
          autoComplete="off"
          aria-autocomplete="none"
          autoSave="off"
        />
        <HoverIcon
          id="to-do-list-widget-add-task-button"
          icon={FiPlus}
          size={30}
          onClick={() => handleAddTask(taskInput)}
          iconStyle={{ cursor: "pointer" }}
          hoverColor="var(--color-white)"
          color={
            !isHovered && appSettings.todoListHoverEffectEnabled
              ? "var(--color-white)"
              : "var(--color-secondary)"
          }
        />
      </div>
      <div className={styles.todoList__task_container}>
        {taskList.map((task) => (
          <TodoListItem
            key={task.id}
            id={task.id}
            text={task.text}
            isHovered={isHovered}
            completed={task.completed}
          />
        ))}
      </div>
    </Modal>
  );
};

export default TodoList;
