import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Finding Rad | Build in Public",
  description:
    "Mark documents the real, messy process of turning ideas into adventures. Founder, Navy officer, builder. No polish. No pretense. Just the build.",
  openGraph: {
    title: "Finding Rad | Build in Public",
    description:
      "Real stories from a founder who builds in public. Hibear, Navy, family, and the grind.",
    url: "https://findingrad.com",
    siteName: "Finding Rad",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
