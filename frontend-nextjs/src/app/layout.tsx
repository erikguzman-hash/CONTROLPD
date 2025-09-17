import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "CONTROLPD - HGIO",
  description: "Control de pauta digital para HGIO",
  icons: {
    icon: "https://hgio-basics-images.s3.us-east-1.amazonaws.com/hgio-logos/apps-logos/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-sans`}>{children}</body>
    </html>
  );
}