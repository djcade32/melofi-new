import React, { useState } from "react";
import styles from "./noteCard.module.css";
import { HiTrash } from "@/imports/icons";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";
import { Note } from "@/types/general";
import useNotesStore from "@/stores/widgets/notes-store";
import { serializeToPlainText } from "@/utils/strings";
import { format } from "date-fns";

interface NoteCardProps {
  selected: boolean;
  note: Note;
}

const NoteCard = ({ selected, note }: NoteCardProps) => {
  const { setSelectedNote, deleteNote } = useNotesStore();

  const getNoteDate = (date: string) => {
    // If date is today, return time
    if (new Date(date).toDateString() === new Date().toDateString()) {
      return format(new Date(date), "h:mm a");
    }
    return format(new Date(date), "MMM dd, yyyy");
  };

  return (
    <div
      id={note.id}
      className={styles.noteCard__container}
      style={{
        backgroundColor: selected ? "var(--color-secondary-opacity)" : "transparent",
      }}
      onClick={() => setSelectedNote(note)}
    >
      <div className={styles.noteCard__title_container}>
        <h3>{note.title} </h3>
        <HoverIcon
          containerClassName={styles.noteCard__trash_icon}
          size={15}
          color="var(--color-secondary)"
          icon={HiTrash}
          hoverColor="var(--color-error)"
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(note.id);
          }}
        />
      </div>
      <div className={styles.noteCard__footer}>
        <p className={styles.noteCard__date}>{getNoteDate(note.updatedAt)}</p>
        <p className={styles.noteCard__content}>{serializeToPlainText(note.text)}</p>
      </div>
    </div>
  );
};

export default NoteCard;
