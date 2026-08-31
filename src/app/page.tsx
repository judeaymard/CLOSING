"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Truck,
  Package,
  BarChart3,
  CheckCircle2,
  XCircle,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Globe,
  ArrowUpRight,
  HelpCircle,
  Check,
  Zap,
  ArrowRight,
  Activity,
  Headphones,
  TrendingUp,
  Share2,
  Video,
  ThumbsUp,
  Heart,
  Calendar,
} from "lucide-react";
import { agencyConfig } from "@/lib/mock-data";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const steps = [
    {
      number: "01",
      icon: PhoneCall,
      title: "Contactez l'Agence",
      desc: "Inscrivez-vous sur l'Espace Partenaire ou contactez nos agences à Cotonou ou Lokossa via WhatsApp.",
      color: "bg-[#16a34a]",
    },
    {
      number: "02",
      icon: Package,
      title: "Stockage & Prise en charge",
      desc: "Notre coursier récupère vos articles ou vous les déposez dans nos entrepôts sécurisés à Cotonou & Lokossa.",
      color: "bg-[#091b14]",
    },
    {
      number: "03",
      icon: Truck,
      title: "Closing & Livraison Express",
      desc: "Nos closeuses confirment vos prospects sous 15 min et le colis est livré à destination en express.",
      color: "bg-[#16a34a]",
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Reversement Immédiat Cash",
      desc: "Vous recevez une notification dès la remise du colis et vos fonds sont reversés par Mobile Money.",
      color: "bg-[#22c55e]",
    },
  ];

  const faqs = [
    {
      q: "Quelles sont les villes couvertes par les agences ENO LIVRAISON ?",
      a: "Nous disposons de 2 pôles opérationnels majeurs : l'Agence de Cotonou qui couvre Cotonou, Abomey-Calavi et Porto-Novo, et l'Agence de Lokossa qui assure la distribution rapide sur Lokossa et l'ensemble des communes du Mono & Couffo. Nous assurons aussi des expéditions régulières vers le reste du Bénin.",
    },
    {
      q: "Comment s'effectue le reversement de mon argent collecté (Cash On Delivery) ?",
      a: "Tous les soirs ou à chaque livraison validée, l'argent collecté en espèces par nos livreurs vous est reversé directement par MTN Mobile Money, Moov Money ou Wave selon votre préférence.",
    },
    {
      q: "Combien coûte le service de closing téléphonique ?",
      a: "Le closing téléphonique professionnel (confirmation, négociation et fiabilisation des adresses sous 15 min) est facturé à seulement 800 F CFA par commande validée et livrée.",
    },
    {
      q: "Où puis-je joindre directement les agences pour une urgence ou un ramassage ?",
      a: "Vous pouvez joindre l'Agence Cotonou au +229 01 64 29 18 84 (ou +229 01 93 83 79 06) et l'Agence Lokossa au +229 01 67 51 00 82. Les lignes téléphoniques et WhatsApp sont ouvertes 6j/7.",
    },
    {
      q: "Le stockage dans vos entrepôts est-il payant ?",
      a: "Non, le stockage de vos produits est 100% OFFERT et sécurisé pour tous nos e-commerçants partenaires inscrits chez ENO LIVRAISON.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#16a34a] selection:text-white">
      {/* 🚀 TOP ANNOUNCEMENT / CONTACTS BAR */}
      <div className="bg-[#07130e] text-white py-2 px-4 text-xs font-medium border-b border-emerald-950">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          {/* Real Phone Numbers for both branches */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
              <span className="text-emerald-300 font-bold">Agence Cotonou :</span>
              <a href="tel:+2290164291884" className="text-white hover:text-emerald-400 font-bold transition-colors">
                +229 01 64 29 18 84
              </a>
            </div>
            <span className="hidden sm:inline text-emerald-800">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-300 font-bold">Agence Lokossa :</span>
              <a href="tel:+2290167510082" className="text-white hover:text-emerald-400 font-bold transition-colors">
                +229 01 67 51 00 82
              </a>
            </div>
          </div>

          {/* Socials & WhatsApp direct */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.tiktok.com/@enolivraison"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <span className="px-1.5 py-0.5 rounded bg-black/60 border border-emerald-500/40 text-[9px] font-black text-emerald-400">
                TikTok
              </span>
              <span className="font-semibold">@enolivraison</span>
            </a>
            <span className="text-emerald-900">•</span>
            <a
              href="https://wa.me/2290164291884"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#25d366] hover:text-emerald-300 font-bold"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* 💎 NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo with Ultra HD round badge */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform bg-white">
                <Image
                  src="/images/eno_livraison_logo.png"
                  alt="Logo Officiel ENO LIVRAISON"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  ENO <span className="text-[#16a34a]">LIVRAISON</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-black text-emerald-600">
                  VOS COLIS, NOTRE PRIORITÉ
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-800">
              <a href="#services" className="hover:text-[#16a34a] transition-colors">
                Nos Services
              </a>
              <a href="#agences" className="hover:text-[#16a34a] transition-colors flex items-center gap-1 text-[#16a34a] font-bold">
                <MapPin className="w-3.5 h-3.5" />
                Agences Cotonou & Lokossa
              </a>
              <a href="#comment-ca-marche" className="hover:text-[#16a34a] transition-colors">
                Comment ça marche
              </a>
              <a href="#communaute" className="hover:text-[#16a34a] transition-colors">
                Réseaux Sociaux
              </a>
              <a href="#faq" className="hover:text-[#16a34a] transition-colors">
                FAQ
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://wa.me/2290164291884"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25d366] hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                WhatsApp Agence
              </a>
              <Link
                href="/partenaire"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#091b14] hover:bg-[#16a34a] text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all active:scale-95"
              >
                <Users className="w-4 h-4 text-[#86efac]" />
                Espace E-commerçant
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="/partenaire"
                className="px-3.5 py-2 rounded-full bg-[#16a34a] text-white text-xs font-bold"
              >
                Connexion
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white px-6 py-6 space-y-4">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-900">
              Nos Services
            </a>
            <a href="#agences" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-[#16a34a]">
              📍 Agences Cotonou & Lokossa
            </a>
            <a href="#comment-ca-marche" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-900">
              Comment ça marche
            </a>
            <a href="#communaute" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-[#16a34a]">
              🎵 Réseaux Sociaux
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-900">
              FAQ
            </a>
            <Link href="/partenaire" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-black text-[#16a34a]">
              Espace Partenaire / Connexion
            </Link>

            <div className="pt-2 flex flex-col gap-2.5 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Nos Lignes Directes :</p>
              <a
                href="tel:+2290164291884"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-200"
              >
                <span>Agence Cotonou</span>
                <span className="text-[#16a34a]">+229 01 64 29 18 84</span>
              </a>
              <a
                href="tel:+2290167510082"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-200"
              >
                <span>Agence Lokossa</span>
                <span className="text-[#16a34a]">+229 01 67 51 00 82</span>
              </a>
              <a
                href="https://wa.me/2290164291884"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25d366] text-white font-bold text-xs shadow-md"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Agence
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* 🌟 HERO SECTION WITH ULTRA-SHARP HD CARDS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white py-12 lg:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy (6 cols) */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-[#15803d] text-xs font-bold border border-emerald-300 shadow-sm">
                <Sparkles className="w-4 h-4 animate-pulse text-[#16a34a]" />
                CLOSING & LIVRAISON EXPRESS AU BÉNIN
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                Vos colis, notre priorité avec <span className="text-[#16a34a]">ENO LIVRAISON</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                <strong>ENO LIVRAISON</strong> est votre partenaire logistique de référence au Bénin. Nous prenons en charge vos confirmations téléphoniques sous 15 minutes, le stockage offert de vos marchandises et la livraison rapide Cash On Delivery avec nos agences de <strong>Cotonou</strong> (Cotonou, Calavi, Porto-Novo) et de <strong>Lokossa</strong> (Mono & Couffo).
              </p>

              {/* Agency Highlights Pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-900">
                  <MapPin className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>Cotonou, Calavi, Porto-Novo :</span>
                  <strong className="text-[#16a34a]">+229 01 64 29 18 84</strong>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-900">
                  <MapPin className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>Lokossa & Mono :</span>
                  <strong className="text-[#16a34a]">+229 01 67 51 00 82</strong>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/partenaire"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Users className="w-5 h-5 text-emerald-100" />
                  Espace E-commerçant
                </Link>

                <a
                  href="https://wa.me/2290164291884"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25d366] hover:bg-emerald-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <MessageSquare className="w-5 h-5 fill-white" />
                  WhatsApp Direct
                </a>
              </div>

              {/* Trust metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-black text-slate-900">94%+</p>
                  <p className="text-xs text-slate-500 font-semibold">Taux de livraison réussi</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#16a34a]">2 Agences</p>
                  <p className="text-xs text-slate-500 font-semibold">Cotonou & Lokossa</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-700">100%</p>
                  <p className="text-xs text-slate-500 font-semibold">Reversement COD Journalier</p>
                </div>
              </div>
            </div>

            {/* Right Side: 3D ROTATING PHOTO CARD STACK WITH HIGH-RES SHARP ASSETS */}
            <div className="lg:col-span-6 relative py-6">
              <div className="wrap_3d_card">
                {/* 3D Card 1: High-res Delivery Courier */}
                <div className="rotating_card group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/african_delivery_rider.jpg"
                      alt="Flotte de livreurs ENO LIVRAISON"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#16a34a] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow">
                      LIVREUR À MOTO EXPRESS
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 text-white">
                      <p className="text-xs font-black">Livraison Rapide (&lt; 2h)</p>
                      <p className="text-[10px] text-emerald-300 font-bold mt-0.5">Cotonou, Calavi & Lokossa</p>
                    </div>
                  </div>
                </div>

                {/* 3D Card 2: High-res Professional African Closeuse */}
                <div className="rotating_card group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/african_closeuse_woman.jpg"
                      alt="Closeuse téléphonique professionnelle ENO LIVRAISON"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#091b14] text-[#86efac] border border-emerald-600 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow">
                      CLOSING 15 MIN
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 text-white">
                      <p className="text-xs font-black">Centre d&apos;Appels Dédié</p>
                      <p className="text-[10px] text-emerald-300 font-bold mt-0.5">Confirmation & Relance Prospect</p>
                    </div>
                  </div>
                </div>

                {/* 3D Card 3: 3D Cash Wallet COD */}
                <div className="rotating_card group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/cash_wallet_3d.jpg"
                      alt="Encaissement sécurisé Cash on Delivery et virement Mobile Money"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#16a34a] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow">
                      CASH ON DELIVERY
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 text-white">
                      <p className="text-xs font-black">Reversement MoMo Journalier</p>
                      <p className="text-[10px] text-emerald-300 font-bold mt-0.5">MTN MoMo • Moov Money • Wave</p>
                    </div>
                  </div>
                </div>

                {/* 3D Card 4: 3D Closing & Dashboard Mobile */}
                <div className="rotating_card group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/closing_phone_3d.jpg"
                      alt="Dashboard et synchronisation Shopify"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-black/80 border border-emerald-400 text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow">
                      ESPACE PARTENAIRE
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 text-white">
                      <p className="text-xs font-black">Suivi en Temps Réel</p>
                      <p className="text-[10px] text-emerald-300 font-bold mt-0.5">Stocks, commandes et finances</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📍 SECTION: NOS AGENCES DE COTONOU & LOKOSSA */}
      <section id="agences" className="py-20 bg-emerald-50/40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-[#15803d] text-xs font-black uppercase tracking-widest border border-emerald-300 inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#16a34a]" /> PRÉSENCE TERRAIN AU BÉNIN
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Deux Agences Opérationnelles à votre Service
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              Que vous vendiez à Cotonou, Calavi, Porto-Novo ou dans le Mono à Lokossa, ENO LIVRAISON prend en charge vos stocks et vos livraisons express.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
            {/* AGENCE COTONOU */}
            <div className="bg-[#091b14] border-2 border-emerald-600/40 rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                    Pôle Littoral • Atlantique • Ouémé
                  </span>
                  <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping"></span> Ouvert 6j/7
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">Agence de Cotonou</h3>
                  <p className="text-emerald-200/80 text-xs sm:text-sm mt-1 font-medium">
                    Gestion des livraisons, closing d&apos;appels et entreposage central.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs text-slate-200 bg-emerald-950/80 p-3 rounded-2xl border border-emerald-900/60">
                    <MapPin className="w-4 h-4 text-[#22c55e] shrink-0" />
                    <span><strong>Zones couvertes :</strong> Cotonou, Abomey-Calavi, Godomey, Porto-Novo</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-200 bg-emerald-950/80 p-3 rounded-2xl border border-emerald-900/60">
                    <PhoneCall className="w-4 h-4 text-[#22c55e] shrink-0" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span><strong>Lignes directes :</strong></span>
                      <a href="tel:+2290164291884" className="text-[#22c55e] font-black hover:underline">+229 01 64 29 18 84</a>
                      <span className="text-emerald-700">/</span>
                      <a href="tel:+2290193837906" className="text-emerald-300 font-black hover:underline">+229 01 93 83 79 06</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-3 relative z-10">
                <a
                  href="tel:+2290164291884"
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <PhoneCall className="w-4 h-4" /> Appeler Cotonou
                </a>
                <a
                  href="https://wa.me/2290164291884"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#25d366] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-white" /> WhatsApp Cotonou
                </a>
              </div>
            </div>

            {/* AGENCE LOKOSSA */}
            <div className="bg-[#091b14] border-2 border-emerald-600/40 rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                    Pôle Grand Sud-Ouest • Mono & Couffo
                  </span>
                  <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping"></span> Flotte Dédiée
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">Agence de Lokossa</h3>
                  <p className="text-emerald-200/80 text-xs sm:text-sm mt-1 font-medium">
                    Toutes vos livraisons de colis à Lokossa et dans les communes environnantes.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs text-slate-200 bg-emerald-950/80 p-3 rounded-2xl border border-emerald-900/60">
                    <MapPin className="w-4 h-4 text-[#22c55e] shrink-0" />
                    <span><strong>Zones couvertes :</strong> Ville de Lokossa, Dogbo, Comè, Athiémé, Mono</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-200 bg-emerald-950/80 p-3 rounded-2xl border border-emerald-900/60">
                    <PhoneCall className="w-4 h-4 text-[#22c55e] shrink-0" />
                    <div className="flex flex-wrap items-center gap-2">
                      <span><strong>Ligne directe :</strong></span>
                      <a href="tel:+2290167510082" className="text-[#22c55e] font-black hover:underline">+229 01 67 51 00 82</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row gap-3 relative z-10">
                <a
                  href="tel:+2290167510082"
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <PhoneCall className="w-4 h-4" /> Appeler Lokossa
                </a>
                <a
                  href="https://wa.me/2290167510082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#25d366] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4 fill-white" /> WhatsApp Lokossa
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 COMMENT ÇA MARCHE */}
      <section id="comment-ca-marche" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-[#15803d] text-xs font-bold border border-emerald-300">
              Comment ça marche
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Simple, rapide et efficace
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              En 4 étapes simples, vos colis sont livrés et votre argent encaissé en toute sécurité au Bénin.
            </p>
          </div>

          {/* 4-Step Process Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center relative group">
                  <div className="relative mb-6">
                    <div className={`w-24 h-24 rounded-3xl ${step.color} text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300`}>
                      <StepIcon className="w-10 h-10 stroke-[2]" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-slate-900 border-2 border-emerald-500 font-black text-xs flex items-center justify-center shadow-md">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 📦 4 SERVICES MAJEURS WITH HD VISUALS */}
      <section id="services" className="py-20 bg-emerald-50/20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-[#15803d] text-xs font-bold border border-emerald-300">
              Nos Piliers
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Tout pour propulser votre e-commerce
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              Une infrastructure complète conçue pour maximiser votre rentabilité et décharger votre quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Closing Téléphonique */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between group transition-all hover:shadow-xl hover:border-emerald-300">
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src="/images/african_closeuse_woman.jpg"
                  alt="Closeuse téléphonique ENO LIVRAISON"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-[#16a34a] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  1. Closing
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold">
                  Appel sous 15 min & Relances
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">1. Closing Téléphonique Pro</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Nos closeuses appellent chaque prospect pour confirmer l&apos;adresse, rassurer le client et fixer le créneau.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">800 F CFA / livraison validée</span>
                  <Link href="/partenaire" className="text-[#16a34a] font-black hover:underline">
                    Détails →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Stockage Sécurisé Gratuit */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between group transition-all hover:shadow-xl hover:border-emerald-300">
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src="/images/istockphoto-1481860080-612x612.jpg"
                  alt="Entrepôt et stockage sécurisé ENO LIVRAISON"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-[#091b14] text-[#86efac] border border-emerald-500 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  2. Stockage
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold">
                  Entrepôts Cotonou & Lokossa
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">2. Stockage Offert & Sécurisé</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Espaces propres sous surveillance vidéo. Inventaire en temps réel et alertes de réapprovisionnement.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-600">100% OFFERT</span>
                  <Link href="/partenaire" className="text-[#16a34a] font-black hover:underline">
                    Détails →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Livraison Express COD */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between group transition-all hover:shadow-xl hover:border-emerald-300">
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src="/images/african_delivery_rider.jpg"
                  alt="Livreur ENO LIVRAISON à moto"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-[#16a34a] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  3. Livraison Express
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold">
                  Livraison sous 2h & Cash COD
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">3. Livraison Express COD (&lt; 2h)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Courses rapides à Cotonou, Calavi, Porto-Novo et Lokossa. Encaissement du cash et reversement MoMo.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">2 000 F CFA / course</span>
                  <Link href="/partenaire" className="text-[#16a34a] font-black hover:underline">
                    Détails →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 4: Dashboard Partenaire */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between group transition-all hover:shadow-xl hover:border-emerald-300">
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <Image
                  src="/images/closing_phone_3d.jpg"
                  alt="Remise colis ENO LIVRAISON"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#091b14] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  4. Espace Dédié
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-slate-900 font-extrabold text-xs bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-slate-200">
                  Dashboard & Synchro E-commerce
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">4. Dashboard & Synchro Boutique</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Connectez vos boutiques Shopify, YouCan ou créez vos commandes en ligne avec suivi direct du coursier.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-600">INCLUS</span>
                  <Link href="/partenaire" className="text-[#16a34a] font-black hover:underline">
                    Accéder →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎵 SECTION: RÉSEAUX SOCIAUX SANS CAPTURES ÉCRAN (CLEAN & PROFESSIONAL) */}
      <section id="communaute" className="py-20 bg-[#07130e] text-white relative overflow-hidden border-b border-emerald-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#22c55e]" /> COMMUNAUTÉ OFFICIELLE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Rejoignez <span className="text-[#22c55e]">ENO LIVRAISON</span> sur les Réseaux Sociaux
            </h2>
            <p className="text-emerald-100/70 text-sm sm:text-base font-normal leading-relaxed">
              Suivez nos livraisons quotidiennes à Cotonou et Lokossa, découvrez nos astuces pour e-commerçants et restez informés de nos offres partenaires.
            </p>
          </div>

          {/* 3 Metric counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6 rounded-3xl bg-emerald-950/50 border border-emerald-900/60 text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <p className="text-3xl font-black text-white">4 350+</p>
              <p className="text-xs text-emerald-300/70 font-semibold uppercase tracking-wider">Mentions J&apos;aime TikTok</p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-950/50 border border-emerald-900/60 text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-[#22c55e]">1 150+</p>
              <p className="text-xs text-emerald-300/70 font-semibold uppercase tracking-wider">Abonnés Actifs</p>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-950/50 border border-emerald-900/60 text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-amber-400">1 AN +</p>
              <p className="text-xs text-emerald-300/70 font-semibold uppercase tracking-wider">Au Service des E-commerçants</p>
            </div>
          </div>

          {/* Social Channels Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@enolivraison"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-3xl bg-[#091b14] border border-emerald-900/80 hover:border-emerald-500 transition-all shadow-xl group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black text-lg border border-emerald-500/40">
                  Tk
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">TikTok Officiel</h4>
                <p className="text-xs text-emerald-400 font-bold mt-0.5">@enolivraison</p>
                <p className="text-xs text-emerald-200/70 mt-2 font-normal">
                  Vidéos quotidiennes des livraisons de colis et conseils pour vos boutiques.
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-900/60 text-xs font-bold text-white flex items-center gap-2">
                <span>Rejoindre 1 150+ abonnés</span>
                <span className="text-[#22c55e]">→</span>
              </div>
            </a>

            {/* WhatsApp Cotonou */}
            <a
              href="https://wa.me/2290164291884"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-3xl bg-[#091b14] border border-emerald-900/80 hover:border-emerald-500 transition-all shadow-xl group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#25d366]/20 text-[#25d366] flex items-center justify-center font-black border border-[#25d366]/40">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">WhatsApp Cotonou</h4>
                <p className="text-xs text-[#25d366] font-bold mt-0.5">+229 01 64 29 18 84</p>
                <p className="text-xs text-emerald-200/70 mt-2 font-normal">
                  Courses et ramassages dans Cotonou, Abomey-Calavi et Porto-Novo.
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-900/60 text-xs font-bold text-white flex items-center gap-2">
                <span>Écrire sur WhatsApp</span>
                <span className="text-[#22c55e]">→</span>
              </div>
            </a>

            {/* WhatsApp Lokossa */}
            <a
              href="https://wa.me/2290167510082"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-3xl bg-[#091b14] border border-emerald-900/80 hover:border-emerald-500 transition-all shadow-xl group flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#25d366]/20 text-[#25d366] flex items-center justify-center font-black border border-[#25d366]/40">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">WhatsApp Lokossa</h4>
                <p className="text-xs text-[#25d366] font-bold mt-0.5">+229 01 67 51 00 82</p>
                <p className="text-xs text-emerald-200/70 mt-2 font-normal">
                  Livraisons directes à Lokossa et dans toute la région du Mono.
                </p>
              </div>
              <div className="pt-2 border-t border-emerald-900/60 text-xs font-bold text-white flex items-center gap-2">
                <span>Écrire sur WhatsApp</span>
                <span className="text-[#22c55e]">→</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 🚀 COMPARATIF VS BATTLE CARDS */}
      <section id="pourquoi" className="py-20 bg-[#091b14] text-white relative overflow-hidden border-b border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-widest border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> INNOVATION & PERFORMANCE LOGISTIQUE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Pourquoi choisir <span className="text-[#22c55e]">ENO LIVRAISON</span> au Bénin ?
            </h2>
            <p className="text-emerald-100/70 text-sm sm:text-base font-normal">
              Découvrez la différence entre les coursiers classiques et le système intégré de closing + livraison ENO LIVRAISON.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto mb-16">
            {/* Left Card: COURSIERS CLASSIQUES */}
            <div className="lg:col-span-5 vs_float_left bg-slate-950/80 border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative group">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Méthode Classique
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">Coursiers Indépendants</h3>
                </div>
                <XCircle className="w-7 h-7 text-rose-500 stroke-[2]" />
              </div>

              <div className="space-y-3 text-xs font-medium">
                <div className="flex items-start gap-2.5 text-slate-300">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Aucun rappel prospect (jusqu&apos;à 40% de commandes perdues)</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Stockage non sécurisé ou à la charge de l&apos;e-commerçant</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Reversement des fonds très lent (7 à 14 jours d&apos;attente)</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Présence limitée à un seul quartier sans agence structurée</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-400">Taux de livraison réussi</span>
                  <span className="text-rose-400">55%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[55%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Center VS Emblem */}
            <div className="lg:col-span-2 flex justify-center py-2">
              <div className="w-14 h-14 rounded-full bg-[#16a34a] text-white font-black text-lg flex items-center justify-center shadow-[0_0_25px_rgba(22,163,74,0.6)] border-4 border-[#091b14] animate-pulse">
                VS
              </div>
            </div>

            {/* Right Card: ENO LIVRAISON */}
            <div className="lg:col-span-5 vs_float_right bg-[#091b14] border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(22,163,74,0.3)] relative group">
              <div className="absolute -top-3.5 right-6 bg-[#16a34a] text-white font-black text-[10px] uppercase tracking-widest px-3.5 py-1 rounded-full shadow-lg">
                Recommandé E-commerce
              </div>

              <div className="flex justify-between items-center border-b border-emerald-900 pb-4">
                <div>
                  <span className="text-[10px] font-black text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
                    Solution Complète
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">ENO LIVRAISON</h3>
                </div>
                <CheckCircle2 className="w-7 h-7 text-[#22c55e] stroke-[2]" />
              </div>

              <div className="space-y-3 text-xs font-semibold">
                <div className="flex items-start gap-2.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>Closing téléphonique pro sous 15 min (Français + Fon/Mina)</span>
                </div>
                <div className="flex items-start gap-2.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>2 Agences physiques : Cotonou & Lokossa (Mono)</span>
                </div>
                <div className="flex items-start gap-2.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Stockage 100% OFFERT dans nos entrepôts sécurisés</span>
                </div>
                <div className="flex items-start gap-2.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>Reversement Cash COD quotidien par MTN MoMo / Moov</span>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-900 space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-emerald-200">Taux de livraison réussi</span>
                  <span className="text-emerald-400 font-black">94% +</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#16a34a] h-full w-[94%] rounded-full shadow-[0_0_10px_#16a34a]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ QUESTIONS FRÉQUENTES (FAQ) */}
      <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#16a34a]">
              TRANSPARENCE TOTALE
            </span>
            <h2 className="text-3xl font-black text-slate-900">Questions Fréquentes</h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Tout ce que vous devez savoir sur nos agences, le closing et nos livraisons.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center gap-4 hover:text-[#16a34a] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      activeFaq === index ? "rotate-90 text-[#16a34a]" : ""
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👑 CTA BANNER */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#091b14] rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-emerald-900">
            <div className="max-w-xl mx-auto space-y-3 relative z-10">
              <span className="px-3.5 py-1 rounded-full bg-[#16a34a] text-white text-[10px] font-black uppercase tracking-wider">
                Rejoignez ENO LIVRAISON
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Booster vos ventes e-commerce au Bénin dès aujourd&apos;hui
              </h2>
              <p className="text-emerald-100/80 text-xs sm:text-sm font-medium">
                Nos agences de Cotonou et Lokossa sont prêtes à prendre en charge vos livraisons. Vos colis, notre priorité.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3.5 relative z-10 pt-2">
              <Link
                href="/partenaire"
                className="px-8 py-4 rounded-full bg-[#16a34a] text-white font-black text-xs hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-xl shadow-emerald-600/30"
              >
                <Users className="w-4 h-4" />
                Accéder à l&apos;Espace Partenaire
              </Link>
              <a
                href="https://wa.me/2290164291884"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-[#25d366] hover:bg-emerald-600 text-white font-black text-xs transition-all flex items-center gap-2 shadow-xl"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                WhatsApp Agence Cotonou
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 👑 FOOTER WITH OFFICIAL ENO LIVRAISON LOGO & REAL CONTACTS */}
      <footer className="bg-[#07130e] text-slate-400 border-t border-emerald-950 pt-12 pb-8 text-[11px] antialiased">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-10 border-b border-emerald-900/60">
            {/* Col 1: Brand & Bio */}
            <div className="md:col-span-4 space-y-3.5">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500 bg-white">
                  <Image
                    src="/images/eno_livraison_logo.png"
                    alt="Logo ENO LIVRAISON"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white tracking-tight">
                    ENO <span className="text-[#22c55e]">LIVRAISON</span>
                  </span>
                  <span className="text-[9px] uppercase font-black text-emerald-400 tracking-wider">
                    Vos colis, notre priorité
                  </span>
                </div>
              </Link>

              <p className="text-[11px] text-slate-400 leading-relaxed font-normal max-w-sm">
                Infrastructure de closing téléphonique, entreposage gratuit et livraison express Cash On Delivery pour e-commerçants au Bénin.
              </p>

              {/* Social links */}
              <div className="pt-2 flex items-center gap-2">
                <a
                  href="https://www.tiktok.com/@enolivraison"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-950 text-white hover:bg-emerald-900 border border-emerald-800 text-[10px] font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-emerald-400 font-black">TikTok :</span> @enolivraison
                </a>
                <a
                  href="https://wa.me/2290164291884"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl bg-[#25d366]/20 text-[#25d366] hover:bg-[#25d366]/30 border border-[#25d366]/40 transition-colors"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>

            {/* Col 2: Agence de Cotonou */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                Agence de Cotonou
              </h4>
              <div className="space-y-2 text-slate-300 font-medium">
                <p className="text-slate-400">Cotonou, Calavi, Porto-Novo</p>
                <p className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                  <a href="tel:+2290164291884" className="hover:text-emerald-300 font-bold">+229 01 64 29 18 84</a>
                </p>
                <p className="flex items-center gap-1.5 text-slate-400">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a href="tel:+2290193837906" className="hover:text-emerald-300">+229 01 93 83 79 06</a>
                </p>
                <p className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#25d366] shrink-0" />
                  <a href="https://wa.me/2290164291884" target="_blank" rel="noopener noreferrer" className="text-[#25d366] hover:underline font-bold">
                    WhatsApp Cotonou
                  </a>
                </p>
              </div>
            </div>

            {/* Col 3: Agence de Lokossa */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                Agence de Lokossa
              </h4>
              <div className="space-y-2 text-slate-300 font-medium">
                <p className="text-slate-400">Lokossa & Région du Mono</p>
                <p className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                  <a href="tel:+2290167510082" className="hover:text-emerald-300 font-bold">+229 01 67 51 00 82</a>
                </p>
                <p className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#25d366] shrink-0" />
                  <a href="https://wa.me/2290167510082" target="_blank" rel="noopener noreferrer" className="text-[#25d366] hover:underline font-bold">
                    WhatsApp Lokossa
                  </a>
                </p>
              </div>
            </div>

            {/* Col 4: Paiements & Heures */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-white text-[11px] font-black uppercase tracking-wider">
                Reversements COD
              </h4>
              <p className="text-slate-400 text-[10px]">
                Reversement des fonds le jour même sur vos comptes :
              </p>
              <div className="flex flex-col gap-1 text-[10px] font-bold">
                <span className="bg-emerald-950 text-yellow-400 px-2 py-1 rounded-md border border-emerald-800">
                  MTN MoMo Bénin
                </span>
                <span className="bg-emerald-950 text-blue-400 px-2 py-1 rounded-md border border-emerald-800">
                  Moov Money Bénin
                </span>
                <span className="bg-emerald-950 text-emerald-400 px-2 py-1 rounded-md border border-emerald-800">
                  Wave / Virement
                </span>
              </div>
            </div>
          </div>

          {/* Copyright Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} ENO LIVRAISON — Cotonou & Lokossa (Bénin). Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <Link href="/partenaire" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Espace Partenaire
              </Link>
              <span className="text-slate-700">•</span>
              <a href="https://www.tiktok.com/@enolivraison" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                TikTok @enolivraison
              </a>
              <span className="text-slate-700">•</span>
              <a href="https://wa.me/2290164291884" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Support WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
