import type { Metadata } from "next";
import { Fraunces, Figtree, Gaegu } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["700", "900"],
  style: ["italic", "normal"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600"],
});

const gaegu = Gaegu({
  subsets: ["latin"],
  variable: "--font-gaegu",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Bloom Journal",
  description: "Your PCOS companion. Informed, personal, yours.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${figtree.variable} ${gaegu.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
