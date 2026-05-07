import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mundo Descartes — Visualizador de Funcoes",
  description: "Represente graficamente funcoes do 1 e 2 grau em tempo real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#0d1515] text-[#dce4e4] antialiased"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
