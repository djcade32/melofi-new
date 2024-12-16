import React, { useEffect, useState } from "react";
import styles from "./todoList.module.css";
import Modal from "@/ui/components/shared/modal/Modal";
import useTodoListStore from "@/stores/widgets/todoList-store";
import { FiPlus } from "@/imports/icons";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import TodoListItem from "./TodoListItem";

const TodoList = () => {
  const { isTodoListOpen, setIsTodoListOpen, taskList, addTask, getTodoListTitle } =
    useTodoListStore();

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [taskInput, setTaskInput] = useState("");

  // Handle enter key press to add task
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const task = document.getElementById("to-do-list-widget-input")?.getAttribute("value");
        task && handleAddTask(task);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
    >
      <div style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 10 }}>
        <input
          id="to-do-list-widget-input"
          className={`${styles.todoList__input} ${
            isInputFocused && styles.todoList__input_focused
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
          color="var(--color-secondary)"
        />
      </div>
      <div className={styles.todoList__task_container}>
        {taskList.map((task) => (
          <TodoListItem key={task.id} id={task.id} text={task.text} />
        ))}
      </div>
    </Modal>
  );
};

export default TodoList;
