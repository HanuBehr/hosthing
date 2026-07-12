import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hosthing.vercel.app"),
  title: "Hosthing | AI Guest Guides for Short-Term Rentals",
  description:
    "Create property-specific guest guides with check-in instructions, WiFi, house rules, local recommendations, booking details, and automated guest support.",
  alternates: {
    canonical: "https://hosthing.vercel.app",
  },
  openGraph: {
    title: "Hosthing | AI Guest Guides for Short-Term Rentals",
    description:
      "Create property-specific guest guides with check-in instructions, WiFi, house rules, local recommendations, booking details, and automated guest support.",
    url: "https://hosthing.vercel.app",
    siteName: "Hosthing",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
