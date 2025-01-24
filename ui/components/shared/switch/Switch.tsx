import React from "react";
import { styled } from "@mui/material/styles";
import { Switch as SwitchMui } from "./imports";
import { SwitchProps } from "@mui/material/Switch";

const IOSSwitch = styled((props: SwitchProps) => (
  <SwitchMui focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "var(--color-white)",
      "& + .MuiSwitch-track": {
        backgroundColor: "var(--color-effect-opacity)",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "var(--color-effect-opacity)",
      border: "6px solid var(--color-white)",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26,
    backgroundColor: "var(--color-secondary-opacity)",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

interface CustomSwitchProps extends SwitchProps {}

const Switch: React.FC<CustomSwitchProps> = (props) => {
  return <IOSSwitch {...props} onClick={(e) => e.stopPropagation()} />;
};

export default Switch;
