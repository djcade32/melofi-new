import { Note } from "@/types/general";
import React, { useEffect, useState } from "react";

interface EditorTimeDisplayProps {
  note: Note;
}

const EditorTimeDisplay = ({ note }: EditorTimeDisplayProps) => {
  const [timeShown, setTimeShown] = useState<number | null>(null);

  useEffect(() => {
    setTimeShown(null);
  }, [note.id]);

  const getTimestamp = (time: string) => {
    const date = new Date(time).toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return date;
  };

  const getTimeDisplayString = () => {
    if (timeShown === 0) {
      return `Created: ${getTimestamp(note.createdAt)}`;
    } else if (timeShown === 1) {
      return `Updated: ${getTimestamp(note.updatedAt)}`;
    }
    return getTimestamp(note.updatedAt);
  };

  // 0 = show Created At, 1 = show Updated At
  const handleOnClick = () => {
    if (timeShown === null || timeShown === 1) {
      setTimeShown(0);
    } else {
      setTimeShown(1);
    }
  };

  return (
    <div
      style={{
        marginTop: 10,
        cursor: "pointer",
      }}
      onClick={handleOnClick}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "var(--color-secondary)",
        }}
      >
        {getTimeDisplayString()}
      </p>
    </div>
  );
};

export default EditorTimeDisplay;
