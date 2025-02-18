import React from "react";

const SmallerScreenView = () => {
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
      <p
        style={{
          fontSize: "24px",
          fontWeight: 500,
          color: "var(--color-white)",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Oops! We’re Too Powerful for Smaller Screens
      </p>
      <p style={{ fontSize: "16px", color: "var(--color-white)", textAlign: "center" }}>
        Melofi is built to thrive on desktop. For the best vibes, grab your computer and let the
        focus begin!
      </p>
    </div>
  );
};

export default SmallerScreenView;
