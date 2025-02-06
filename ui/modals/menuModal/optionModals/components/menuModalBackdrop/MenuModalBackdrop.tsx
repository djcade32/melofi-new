import useMenuStore from "@/stores/menu-store";
import React from "react";

const styles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.5s",
  backdropFilter: "blur(10px)",
};

interface MenuModalBackdropProps {
  open: boolean;
  children?: React.ReactNode;
}

const MenuModalBackdrop = ({ open, children }: MenuModalBackdropProps) => {
  const { setSelectedOption } = useMenuStore();

  const handleBackDropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.target === e.currentTarget && setSelectedOption(null);
  };

  return (
    <div
      id="menu-modal-backdrop"
      onClick={handleBackDropClick}
      style={{
        ...styles,
        opacity: open ? 1 : 0,
        zIndex: open ? 100 : -1,
      }}
    >
      {children}
    </div>
  );
};

export default MenuModalBackdrop;
