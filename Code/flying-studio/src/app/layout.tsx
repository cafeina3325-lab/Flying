import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FLYING STUDIO",
  description: "FLYING STUDIO website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
