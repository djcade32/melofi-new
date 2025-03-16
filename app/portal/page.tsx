import { LuConstruction } from "@/imports/icons";

export default function PortalPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-white)",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 0 10px var(--color-black)",
      }}
    >
      <LuConstruction size={100} color="var(--color-effect-opacity)" />
      <h1
        style={{
          color: "var(--color-secondary)",
          border: "1px solid var(--color-secondary-opacity)",
          padding: 10,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        Coming Soon
      </h1>
    </div>
  );
}
