import SceneBackground from "@/components/sceneBackground/SceneBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SceneBackground />
        {children}
      </body>
    </html>
  );
}
