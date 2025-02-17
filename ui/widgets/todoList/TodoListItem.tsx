import React, { useState } from "react";
import styles from "./todoListItem.module.css";
import Checkbox from "@/ui/components/shared/checkbox/Checkbox";
import { HiTrash } from "@/imports/icons";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import useTodoListStore from "@/stores/widgets/todoList-store";
import useAppStore from "@/stores/app-store";

interface TodoListItemProps {
  text: string;
  id: string;
  isHovered?: boolean;
}

const TodoListItem = ({ id, text, isHovered }: TodoListItemProps) => {
  const { removeTask, changeTaskStatus } = useTodoListStore();
  const { appSettings } = useAppStore();

  const [checked, setChecked] = useState(false);

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
      <div className={styles.todoListItem__delete_icon_container}>
        <HoverIcon
          icon={HiTrash}
          size={20}
          color="var(--color-secondary)"
          hoverColor="var(--color-error)"
          onClick={handleDelete}
          iconStyle={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
};

export default TodoListItem;
