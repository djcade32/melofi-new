import React, { useState } from "react";
import styles from "./todoListItem.module.css";
import Checkbox from "@/ui/components/shared/checkbox/Checkbox";
import { IoClose } from "@/imports/icons";
import useTodoListStore from "@/stores/widgets/todoList-store";
import useAppStore from "@/stores/app-store";

interface TodoListItemProps {
  text: string;
  id: string;
  completed: boolean;

  isHovered?: boolean;
}

const TodoListItem = ({ id, text, isHovered, completed }: TodoListItemProps) => {
  const { removeTask, changeTaskStatus } = useTodoListStore();
  const { appSettings } = useAppStore();

  const [checked, setChecked] = useState(completed);

  const handleClick = () => {
    setChecked((prev) => !prev);
    changeTaskStatus(id, !checked);
  };

  const handleDelete = () => {
    removeTask(id);
  };

  return (
    <div id={id} className={styles.todoListItem__container}>
      <Checkbox
        id={`to-do-list-item-checkbox-${id}`}
        text={text}
        onClick={handleClick}
        value={checked}
        centerCheckbox={false}
        textClassName={
          checked
            ? !isHovered && appSettings.todoListHoverEffectEnabled
              ? styles.todoListItem__task_complete_background_fade
              : styles.todoListItem__task_complete
            : ""
        }
      />
      <div className={styles.todoListItem__delete_button} onClick={handleDelete}>
        <IoClose size={12} color="var(--color-primary-opacity)" />
      </div>
    </div>
  );
};

export default TodoListItem;
