import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "scmslivraison — Logistique E-commerce, Closing & Livraison au Bénin",
  description:
    "Votre partenaire logistique de confiance au Bénin : closing téléphonique, stockage sécurisé à Cotonou et livraison express Cash On Delivery.",
  keywords: "scmslivraison, logistique e-commerce Bénin, livraison Cotonou, transport colis Bénin, closing e-commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full antialiased scroll-smooth`}>
      <head>
        <meta name="theme-color" content="#090e22" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#090e22] selection:bg-[#06b6d4] selection:text-white">
        {children}
      </body>
    </html>
  );
}
