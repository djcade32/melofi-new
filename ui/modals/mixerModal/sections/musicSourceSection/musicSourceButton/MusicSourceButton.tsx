import React from "react";
import styles from "./musicSourceButton.module.css";
import Image, { StaticImageData } from "next/image";
import { IconType } from "react-icons";
import { MdOutlineDisabledByDefault, BsInfoCircle } from "@/imports/icons";
import HoverIcon from "@/ui/components/shared/hoverIcon/HoverIcon";

interface MusicSourceButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  imgSrc?: StaticImageData;
  icon?: IconType;
  onClick?: () => void;
  showInfo?: boolean;
}

//If no image source is provided, the icon will be displayed

const MusicSourceButton = ({
  id,
  label,
  isActive,
  imgSrc,
  icon = MdOutlineDisabledByDefault,
  onClick,
  showInfo = false,
}: MusicSourceButtonProps) => {
  return (
    <div
      id={id}
      className={`${styles.musicSourceButton__container} ${
        isActive && styles.musicSourceButton__container_active
      }`}
      onClick={onClick}
    >
      {imgSrc ? (
        <Image src={imgSrc} alt="melofi" width={40} height={40} />
      ) : (
        React.createElement(icon, {
          color: "var(--color-white)",
          size: 30,
        })
      )}
      {showInfo && (
        <div className={styles.musicSourceButton_info_icon}>
          <HoverIcon
            icon={BsInfoCircle}
            size={15}
            tooltipText="Login to Spotify from your browser to listen without limits"
            showTooltip
          />
        </div>
      )}
      <p>{label}</p>
    </div>
  );
};

export default MusicSourceButton;
