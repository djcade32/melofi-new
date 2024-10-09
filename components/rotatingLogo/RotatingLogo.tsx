"use client";

import React, { useState } from "react";
import styles from "./rotatingLogo.module.css";
import Image from "next/image";
import logo from "@/public/assets/logos/melofi-logo.png";

const RotatingLogo = () => {
  const [rotationDirection, setRotationDirection] = useState(0); // Keep track of current rotation angle

  return (
    <div
      id="rotating-logo"
      className={`${
        rotationDirection === 0
          ? styles.header_logo_clockwise
          : styles.header_logo_counter_clockwise
      }`}
      onClick={() => setRotationDirection(rotationDirection === 0 ? 1 : 0)}
    >
      <Image src={logo} alt="melofi logo" width={122} height={122} priority />
    </div>
  );
};

export default RotatingLogo;
