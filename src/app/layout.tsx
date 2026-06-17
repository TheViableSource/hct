import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Hillsboro Civic Theater | Where Hillsboro Takes the Stage",
  description: "Hillsboro Civic Theater is creating a permanent home for creativity, storytelling, live performance, and community participation. Join us as we build a cultural institution that will belong to Hillsboro for generations.",
  keywords: "Hillsboro Civic Theater, HCT, Hillsboro Oregon, theater, live performance, community theater, performing arts",
  openGraph: {
    title: "Hillsboro Civic Theater | Where Hillsboro Takes the Stage",
    description: "Hillsboro Civic Theater is creating a permanent home for creativity, storytelling, live performance, and community participation.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
