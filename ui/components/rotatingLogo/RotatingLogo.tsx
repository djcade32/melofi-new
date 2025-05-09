"use client";

import React, { useEffect, useState } from "react";
import styles from "./rotatingLogo.module.css";
import Image from "next/image";
import logo from "@/public/assets/logos/melofi-logo.png";

const RotatingLogo = () => {
  const [rotationDirection, setRotationDirection] = useState("0"); // Keep track of current rotation angle
  useEffect(() => {
    const storedRotationDirection = localStorage.getItem("logo_rotation_direction") || "0";
    setRotationDirection(storedRotationDirection);
  }, []);

  const handleClick = () => {
    setRotationDirection(rotationDirection === "0" ? "1" : "0");
    // set in local storage
    localStorage.setItem("logo_rotation_direction", rotationDirection === "0" ? "1" : "0");
  };

  return (
    <div
      id="rotating-logo"
      className={`${
        rotationDirection === "0"
          ? styles.header_logo_clockwise
          : styles.header_logo_counter_clockwise
      }`}
      onClick={handleClick}
    >
      <Image src={logo} alt="melofi logo" width={122} height={122} priority />
    </div>
  );
};

export default RotatingLogo;
