import React from "react";
import { IconType } from "react-icons";
import styles from "./playlistButton.module.css";
import HoverIcon from "@/components/shared/hoverIcon/HoverIcon";

interface PlaylistButtonProps {
  icon: IconType;
  label: string;
  isActive: boolean;
  id: string;
  iconSize?: number;
  onClick?: () => void;
}

const PlaylistButton = ({
  icon,
  label,
  iconSize = 30,
  isActive,
  onClick,
  id,
}: PlaylistButtonProps) => {
  return (
    <div className={styles.playlistButton__container}>
      <div
        id={id}
        onClick={onClick}
        style={{
          backgroundColor: isActive
            ? "var(--color-effect-opacity)"
            : "var(--color-secondary-opacity)",
        }}
      >
        <HoverIcon
          icon={icon}
          size={iconSize}
          color={isActive ? "var(--color-secondary-white)" : "var(--color-secondary)"}
          hoverColor="var(--color-secondary-white)"
        />
      </div>
      <p
        className={`${
          isActive
            ? styles.playlistButton__container_text_active
            : styles.playlistButton__container_text_not_active
        }`}
      >
        {label}
      </p>
    </div>
  );
};

export default PlaylistButton;
