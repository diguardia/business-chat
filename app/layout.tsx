import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Chat Assistant",
  description: "Asistente documental conversacional con Google Drive y Docs"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl p-6">{children}</main>
      </body>
    </html>
  );
}
