import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ENO LIVRAISON — Vos colis, notre priorité | Closing, Stockage & Livraison au Bénin",
  description:
    "ENO LIVRAISON : Votre partenaire logistique de confiance au Bénin. Agences à Cotonou et Lokossa. Closing téléphonique sous 15 min, stockage offert et livraison express Cash On Delivery.",
  keywords:
    "ENO LIVRAISON, Vos colis notre priorité, livraison Cotonou, livraison Lokossa, logistique e-commerce Bénin, closing Bénin, transport colis Calavi, Cash on delivery Bénin, Mono Couffo",
  icons: {
    icon: "/images/eno_livraison_logo.png",
    apple: "/images/eno_livraison_logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full antialiased scroll-smooth`}>
      <head>
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 selection:bg-[#16a34a] selection:text-white">
        {children}
      </body>
    </html>
  );
}
