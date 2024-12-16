import React, { forwardRef } from "react";
import { css, cx } from "@emotion/css";
import { BaseProps } from "@/types/interfaces/slate_editor";
import EditorMenu from "./EditorMenu";

const EditorToolbar = forwardRef<HTMLDivElement, BaseProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <EditorMenu
        {...props}
        ref={ref}
        className={cx(
          className,
          css`
            position: relative;
            padding: 0px 25px 5px 25px;
            margin: 0 -20px;
            display: flex;
            align-items: center;
            justify-content: "center";
            gap: 5px;
          `
        )}
      >
        {children}
      </EditorMenu>
    );
  }
);

export default EditorToolbar;
