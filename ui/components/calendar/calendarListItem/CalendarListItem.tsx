import React from "react";
import styles from "./calendarListItem.module.css";
import { CalendarListItem as CalendarListItemType } from "@/types/general";
import { RxCaretRight } from "@/imports/icons";

interface CalendarListItemProps {
  item: CalendarListItemType;
  onClick: (item: CalendarListItemType) => void;
}

const CalendarListItem = ({ item, onClick }: CalendarListItemProps) => {
  return (
    <div className={styles.calendarListItem__container} onClick={() => onClick(item)}>
      <div className={styles.calendarListItem__text_container}>
        <p>{item.name}</p>
        <p style={{ fontSize: 12, fontStyle: "italic" }}>{item.primary ? "(Primary)" : ""}</p>
      </div>
      <div
        className={styles.calendarListItem__color}
        style={{
          backgroundColor: item.color,
        }}
      >
        <RxCaretRight
          className={styles.calendarListItem__caret_icon}
          size={30}
          color="var(--color-primary-opacity)"
        />
      </div>
    </div>
  );
};

export default CalendarListItem;
