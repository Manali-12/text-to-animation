import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Text Animation Video Generator",
  description: "Create stunning text animations and export them as MP4 videos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-inter antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
