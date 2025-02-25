import React, { useEffect, useState } from "react";
import TooltipMui from "@mui/material/Tooltip";
import { TransitionProps } from "@mui/material/transitions";
import { use } from "chai";
import { PopperProps } from "@mui/material/Popper/BasePopper.types";
import { PiCrownSimpleFill } from "@/imports/icons";

interface TooltipProps {
  text: string | undefined;
  children: React.ReactNode;

  bgColor?: string;
  textAlign?: "center" | "left" | "right";
  width?: string;
  noFlex?: boolean;
  disabled?: boolean;
  disableCloseOnClick?: boolean;
  placement?: "top" | "bottom" | "left" | "right";
  TransitionComponent?: React.JSXElementConstructor<TransitionProps>;
  tooltipClassName?: string;
  closeOverride?: boolean;
  disableInteractive?: boolean;
  offset?: [number, number];
  isPremiumTooltip?: boolean;
}

const Tooltip = ({
  disabled = false,
  textAlign = "center",
  disableCloseOnClick = false,
  placement = "bottom",
  TransitionComponent,
  tooltipClassName,
  noFlex,
  closeOverride = false,
  disableInteractive,
  offset = [0, 0],
  isPremiumTooltip,
  ...props
}: TooltipProps) => {
  const [openHandler, setOpenHandler] = useState(false);
  const [documentEl, setDocumentEl] = useState<Document | null>(null);

  useEffect(() => {
    if (document) {
      setDocumentEl(document);
    }
  }, []);

  const premiumTooltip = (
    <div style={{ display: "flex", columnGap: 5, justifyContent: "center", alignItems: "center" }}>
      <PiCrownSimpleFill size={15} color="var(--color-effect-opacity)" /> <p>{props.text}</p>
    </div>
  );

  return (
    <TooltipMui
      disableInteractive={disableInteractive}
      // This is a workaround to fix the tooltip not showing up in fullscreen mode
      PopperProps={{
        container: documentEl?.querySelector(".fullscreen") as HTMLElement | null,
      }}
      describeChild
      disableHoverListener={disabled}
      placement={placement}
      title={isPremiumTooltip ? premiumTooltip : props.text}
      TransitionComponent={TransitionComponent}
      open={openHandler && !closeOverride}
      onOpen={() => setOpenHandler(true)}
      onClose={() => setOpenHandler(false)}
      slotProps={{
        tooltip: {
          sx: {
            cursor: "default",
            bgcolor: props.bgColor || "var(--color-primary-opacity)",
            fontFamily: "var(--font-primary)",
            fontWeight: 400,
            fontSize: 16,
            userSelect: "none",
            textAlign: textAlign,
            maxWidth: props.width ? props.width : "25ch",
          },
        },
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset,
              },
            },
          ],
        },
      }}
      {...props}
    >
      {/*Could potentially be a problem in the future if tooltip is not working correctly*/}
      <div
        className={tooltipClassName}
        style={
          noFlex
            ? {}
            : {
                width: "100%",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }
        }
        onClick={() => {
          !disableCloseOnClick && setOpenHandler(false);
        }}
      >
        {props.children}
      </div>
    </TooltipMui>
  );
};

export default Tooltip;
