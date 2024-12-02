import React, { useState } from "react";
import styles from "./todoListItem.module.css";
import Checkbox from "@/ui/components/shared/checkbox/Checkbox";
import { HiTrash } from "@/imports/icons";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import useTodoListStore from "@/stores/widgets/todoList-store";

interface TodoListItemProps {
  text: string;
  position: number;
}

const TodoListItem = ({ position, text }: TodoListItemProps) => {
  const { removeTask, changeTaskStatus } = useTodoListStore();
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked((prev) => !prev);
    changeTaskStatus(position, !checked);
  };

  const handleDelete = () => {
    removeTask(position);
  };

  return (
    <div className={styles.todoListItem__container}>
      <Checkbox
        id="test"
        text={text}
        onClick={handleClick}
        value={checked}
        centerCheckbox={false}
        textClassName={checked ? styles.todoListItem__task_complete : ""}
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
