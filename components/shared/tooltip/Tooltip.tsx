import React from "react";
import { Zoom } from "@mui/material";
import TooltipMui from "@mui/material/Tooltip";
// import { FaCrown } from "../../imports/icons";

interface TooltipProps {
  text: string;
  children: React.ReactNode;

  bgColor?: string;
  textAlign?: "center" | "left" | "right";
  width?: string;
  noFlex?: boolean;
  disabled?: boolean;
}

const Tooltip = ({ disabled = false, ...props }: TooltipProps) => {
  //   const premiumTooltip = (
  //     <div style={{ display: "flex", columnGap: 5 }}>
  //       <p>{props.text}</p> <FaCrown size={15} color="var(--color-effect-opacity)" />
  //     </div>
  //   );
  return (
    <TooltipMui
      describeChild
      disableHoverListener={disabled}
      title={props.text}
      TransitionComponent={Zoom}
      slotProps={{
        tooltip: {
          sx: {
            cursor: "default",
            bgcolor: props.bgColor || "var(--color-primary)",
            fontFamily: "var(--font-primary)",
            fontWeight: 400,
            fontSize: 12,
            userSelect: "none",
            textAlign: props.textAlign ? props.textAlign : "center",
            maxWidth: props.width ? props.width : "25ch",
          },
        },
      }}
    >
      {/*Could potentially be a problem in the future if tooltip is not working correctlty*/}
      <div
        style={{
          width: "100%",
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {/* <div style={props.noFlex ? {} : { display: "flex", alignItems: "center" }}> */}
        {props.children}
      </div>
    </TooltipMui>
  );
};

export default Tooltip;
