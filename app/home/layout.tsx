import "./landing-page-global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Melofi is a productivity and relaxation web app designed to boost focus with Lofi music, stunning visuals, and powerful tools. Track your stats, manage notes, and sync with your Google Calendar—all in one seamless experience. Stay in the zone with Melofi. Try it now!",
};
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <div id="home-layout">{children}</div>;
}
