import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elegance - Premium Erotik Guide Deutschland",
  description: "Exklusive Clubs, erstklassige Saunen und diskrete Studios. Finden und buchen Sie die besten Adressen Deutschlands. Ihr Premium-Erotikguide für diskrete und elegante Erlebnisse.",
  keywords: ["Premium Club", "Sauna", "Studio", "Deutschland", "Reservierung", "Diskretion", "Nightlife"],
  authors: [{ name: "Elegance Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Elegance - Premium Erotik Guide Deutschland",
    description: "Exklusive Clubs, erstklassige Saunen und diskrete Studios",
    url: "https://elegance.de",
    siteName: "Elegance",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elegance - Premium Erotik Guide Deutschland",
    description: "Exklusive Clubs, erstklassige Saunen und diskrete Studios",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
