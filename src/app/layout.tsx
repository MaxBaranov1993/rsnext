import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FavoritesProvider } from "@/lib/contexts/FavoritesContext";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "rSALE - Платформа для умных продаж",
  description: "Автоматизируйте ваши продажи, анализируйте данные и увеличивайте доход с помощью современной платформы rSALE",
  keywords: "продажи, CRM, аналитика, автоматизация, бизнес",
  authors: [{ name: "rSALE Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FavoritesProvider>
          {children}
          <Footer />
          <Toaster />
        </FavoritesProvider>
      </body>
    </html>
  );
}
