import React from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import styles from "./volumeSlider.module.css";

const StyledSlider = styled(Slider)({
  color: "var(--color-effect)",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    height: 15,
    width: 15,
    backgroundColor: "var(--color-secondary)",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.25,
  },
});

const VolumeSlider = (props: any) => {
  return (
    <div className={styles.melofi__volumeSlider_container}>
      <StyledSlider defaultValue={35} aria-label="Volume" {...props} />
    </div>
  );
};

export default VolumeSlider;
