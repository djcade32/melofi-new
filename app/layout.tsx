import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Melofi", template: "%s | Melofi" },
  description:
    "Melofi is a productivity and relaxation web app designed to boost focus with Lofi music, stunning visuals, and powerful tools. Track your stats, manage notes, and sync with your Google Calendar—all in one seamless experience. Stay in the zone with Melofi. Try it now!",
  icons: [
    {
      href: "/favicon.ico",
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
