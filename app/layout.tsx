import type { Metadata } from "next";
import { Host_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/website/Nav";
import Footer from "@/components/website/Footer";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"]
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Golf4Community",
  description: "Connecting Golfers. Empowering Communities."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${hostGrotesk.variable} ${instrumentSerif.variable} antialiased w-full max-w-[1440px] min-h-screen mx-auto`}
      >
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
