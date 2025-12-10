import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FilterProvider } from "@/context/FilterContext";

// Force dynamic rendering to avoid SSR issues with Recharts and Leaflet
export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DG Petro - Leadership Command Centre",
  description: "Executive Dashboard for Oil & Gas Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen overflow-hidden`}
        suppressHydrationWarning
      >
        <FilterProvider>
          {children}
        </FilterProvider>
      </body>
    </html>
  );
}
