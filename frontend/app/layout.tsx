import type { Metadata } from "next";
import { Fraunces, Figtree, Gaegu } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: "variable",
  style: ["italic", "normal"],
  axes: ["opsz"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700"],
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
    <html
      lang="en"
      className={`${fraunces.variable} ${figtree.variable} ${gaegu.variable}`}
    >
      <body className="font-body text-ink antialiased">
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
