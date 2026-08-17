import type { Metadata } from "next";
import { Fraunces, Raleway } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { HashScrollSync } from "@/components/HashScrollSync";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSiteSettings } from "@/lib/content";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Move Social | Gestão de impacto socioambiental",
  description:
    "A Move apoia organizações a ampliar o que o impacto pode ser, com rigor analítico, escuta qualificada e presença no campo."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { navItems, contact, social } = await getSiteSettings();

  return (
    <html lang="pt-BR">
      <body className={`${raleway.variable} ${fraunces.variable} antialiased`} suppressHydrationWarning>
        <SmoothScroll />
        <HashScrollSync />
        <Header navItems={navItems} social={social} />
        {children}
        <Footer navItems={navItems} contact={contact} />
      </body>
    </html>
  );
}
