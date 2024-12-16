import { ToolbarButtonProps } from "@/types/interfaces/slate_editor";
import { useSlate } from "slate-react";
import { isBlockActive, TEXT_ALIGN_TYPES, toggleBlock } from "../helpers";
import EditorButton from "./EditorButton";
import React from "react";

const BlockButton = ({
  format,
  icon,
  showHoverEffect = true,
  activeColor = "var(--color-primary)",
  color = "var(--color-secondary-white)",
  disabled = false,
  isSelectOption = false,
}: ToolbarButtonProps) => {
  const editor = useSlate();
  const active = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );

  return (
    <EditorButton
      format={format}
      active={active}
      onMouseDown={(event: MouseEvent) => {
        if (disabled) return;
        if (active && isSelectOption) return;
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      showHoverEffect={showHoverEffect}
    >
      {React.createElement(icon, {
        color: active ? activeColor : color,
        size: 25,
      })}
    </EditorButton>
  );
};

export default BlockButton;
