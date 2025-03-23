import React, { forwardRef } from "react";
import { cx, css } from "@emotion/css";
import { BaseProps } from "@/types/interfaces/slate_editor";

const EditorMenu = forwardRef<HTMLDivElement, BaseProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        {...props}
        data-test-id="menu"
        ref={ref}
        className={cx(
          className,
          css`
            & > * {
              display: inline-block;
            }

            & > * + * {
              margin-left: 15px;
            }
          `
        )}
      >
        {children}
      </div>
    );
  }
);

export default EditorMenu;
