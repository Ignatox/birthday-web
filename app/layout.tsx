import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invitación de cumpleaños",
  description: "Invitación de cumpleaños 3D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
