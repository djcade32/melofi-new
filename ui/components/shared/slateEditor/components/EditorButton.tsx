import React, { forwardRef } from "react";
import { css, cx } from "@emotion/css";
import Tooltip from "@/ui/components/shared/tooltip/Tooltip";

import { ButtonProps } from "@/types/interfaces/slate_editor";
import { TOOLBAR_TOOLTIP_MAPPINGS } from "../helpers";

const EditorButton = forwardRef<HTMLSpanElement, ButtonProps>(
  ({ className, active, children, format, showHoverEffect = true, ...props }, ref) => {
    return (
      <Tooltip
        {...props}
        offset={[0, -8]}
        noFlex
        text={TOOLBAR_TOOLTIP_MAPPINGS[format as keyof typeof TOOLBAR_TOOLTIP_MAPPINGS]}
        tooltipClassName={cx(
          className,
          css`
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 0px !important;
            border-radius: 10px;
            padding: 8px;
            cursor: pointer;
            transition: all 0.3s;
            background-color: ${
              active && showHoverEffect ? "var(--color-effect-opacity)" : "transparent"
            };
            &:hover {
              background-color:${
                showHoverEffect
                  ? active
                    ? "var(--color-effect-opacity)"
                    : "var(--color-secondary-opacity)"
                  : "transparent"
              };
            } ;
          }
        `
        )}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {children}
        </div>
      </Tooltip>
    );
  }
);

export default EditorButton;
