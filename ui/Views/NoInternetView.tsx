import React from "react";
import { BiWifiOff } from "@/imports/icons";

const NoInternetView = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "0 20px",
        backgroundColor: "rgb(35, 35, 35, 0.75)",
        backdropFilter: "blur(10px)",
      }}
    >
      <BiWifiOff style={{ fontSize: "100px", color: "var(--color-white)", marginBottom: 20 }} />
      <p
        style={{
          fontSize: "24px",
          fontWeight: 500,
          color: "var(--color-white)",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Uh-oh, looks like you’re offline.
      </p>
      <p style={{ fontSize: "16px", color: "var(--color-white)", textAlign: "center" }}>
        Melofi is currently offline. Please check your internet connection and try again.
      </p>
    </div>
  );
};

export default NoInternetView;
