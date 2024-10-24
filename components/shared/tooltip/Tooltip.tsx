import React, { useState } from "react";
import { Zoom } from "@mui/material";
import TooltipMui from "@mui/material/Tooltip";
// import { FaCrown } from "../../imports/icons";

interface TooltipProps {
  text: string;
  children: React.ReactNode;

  // id: string;
  bgColor?: string;
  textAlign?: "center" | "left" | "right";
  width?: string;
  noFlex?: boolean;
  disabled?: boolean;
  disableCloseOnClick?: boolean;
}

const Tooltip = ({
  disabled = false,
  textAlign = "center",
  disableCloseOnClick = false,
  ...props
}: TooltipProps) => {
  const [open, setOpen] = useState(false);
  //   const premiumTooltip = (
  //     <div style={{ display: "flex", columnGap: 5 }}>
  //       <p>{props.text}</p> <FaCrown size={15} color="var(--color-effect-opacity)" />
  //     </div>
  //   );

  return (
    <TooltipMui
      // This is a workaround to fix the tooltip not showing up in fullscreen mode
      PopperProps={{
        disablePortal: true,
      }}
      describeChild
      disableHoverListener={disabled}
      title={props.text}
      TransitionComponent={Zoom}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      slotProps={{
        tooltip: {
          sx: {
            cursor: "default",
            bgcolor: props.bgColor || "var(--color-primary)",
            fontFamily: "var(--font-primary)",
            fontWeight: 400,
            fontSize: 12,
            userSelect: "none",
            textAlign: textAlign,
            maxWidth: props.width ? props.width : "25ch",
          },
        },
      }}
    >
      {/*Could potentially be a problem in the future if tooltip is not working correctlty*/}
      <div
        style={
          props.noFlex
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
          !disableCloseOnClick && setOpen(false);
        }}
      >
        {props.children}
      </div>
    </TooltipMui>
  );
};

export default Tooltip;
