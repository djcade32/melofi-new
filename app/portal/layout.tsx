import type { Metadata } from "next";
import "./portal-page-global.css";

export const metadata: Metadata = {
  title: "Portal",
  description:
    "Melofi is a productivity and relaxation web app designed to boost focus with Lofi music, stunning visuals, and powerful tools. Track your stats, manage notes, and sync with your Google Calendar—all in one seamless experience. Stay in the zone with Melofi. Try it now!",
};
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <div id="portal-layout">{children}</div>;
}
