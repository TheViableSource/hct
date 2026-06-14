import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Cormorant_Infant } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const cormorantInfant = Cormorant_Infant({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["italic", "normal"],
  variable: "--font-cormorant-infant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hillsborocivictheater.org"),
  title: {
    default: "Hillsboro Civic Theater",
    template: "%s | Hillsboro Civic Theater",
  },
  description:
    "A community-powered civic theater producing large-scale musicals with a full orchestra. Where Hillsboro Takes the Stage.",
  openGraph: {
    siteName: "Hillsboro Civic Theater",
    locale: "en_US",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0D1B2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} ${cormorantInfant.variable} font-body bg-hct-ink text-hct-mist antialiased`}
      >
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
