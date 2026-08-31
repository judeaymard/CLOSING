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
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const steps = [
    {
      number: "01",
      icon: PhoneCall,
      title: "Contactez-nous",
      desc: "Inscrivez-vous sur l'Espace Partenaire ou envoyez un message WhatsApp pour nous confier vos produits.",
      color: "bg-[#16a34a]",
    },
    {
      number: "02",
      icon: Package,
      title: "Stockage & Prise en charge",
      desc: "Notre coursier récupère vos articles ou vous les déposez dans nos entrepôts sécurisés à Cotonou & Calavi.",
      color: "bg-[#0f291e]",
    },
    {
      number: "03",
      icon: Truck,
      title: "Closing & Livraison rapide",
      desc: "Nos closeuses confirment vos prospects sous 15 min et le colis est livré à destination en toute sécurité.",
      color: "bg-[#16a34a]",
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Reversement du Cash",
      desc: "Vous recevez une confirmation dès la remise du colis et votre argent est reversé par Mobile Money.",
      color: "bg-[#22c55e]",
    },
  ];

  const faqs = [
    {
      q: "Comment s'effectue le reversement de mon argent encaissé (Cash On Delivery) ?",
      a: "Tous les soirs ou à chaque livraison validée, l'argent collecté par nos livreurs vous est reversé directement par MTN Mobile Money, Moov Money, Wave ou Virement Bancaire selon votre choix.",
    },
    {
      q: "Que se passe-t-il si un client annule au moment de la livraison ?",
      a: "Grâce à notre service de closing téléphonique préalable, notre taux d'annulation chute en dessous de 8%. Si une annulation survient malgré tout, le produit retourne immédiatement à l'entrepôt sans aucun frais de pénalité.",
    },
    {
      q: "Où sont situés vos entrepôts de stockage au Bénin ?",
      a: "Nos hubs principaux de stockage sécurisé sont implantés à Cotonou (quartier Cadjehoun / Haie-Vive) et à Abomey-Calavi (zone Zogbadjè). Le stockage est 100% offert pour tous nos partenaires.",
    },
    {
      q: "Quelles sont les villes couvertes par le service de livraison ?",
      a: "Nous assurons la livraison express directe (< 2h) sur Cotonou, Abomey-Calavi et Porto-Novo, ainsi que des expéditions quotidiennes sécurisées vers Parakou, Bohicon, Natitingou et toutes les grandes villes du Bénin.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#16a34a] selection:text-white">
      {/* 🚀 TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#0f291e] text-white py-2 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2 border-b border-emerald-950">
        <span className="bg-[#16a34a]/30 text-[#86efac] border border-[#16a34a]/50 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider animate-pulse">
          BÉNIN N°1
        </span>
        <span className="font-medium">
          <strong className="text-white font-black">ENO LIVRAISON</strong> : Closing Téléphonique, Stockage Offert & Livraison Express COD au Bénin — <em className="text-emerald-300 not-italic">« Vos colis, notre priorité »</em>
        </span>
        <Link href="/partenaire" className="underline hover:text-emerald-300 ml-1 hidden sm:inline-flex items-center gap-1 font-bold">
          Espace Partenaire <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* 💎 NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform bg-white">
                <Image
                  src="/images/eno_livraison_logo.png"
                  alt="Logo ENO LIVRAISON"
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
              <a href="#comment-ca-marche" className="hover:text-[#16a34a] transition-colors">
                Comment ça marche
              </a>
              <a href="#closing" className="hover:text-[#16a34a] transition-colors">
                Closing Téléphonique
              </a>
              <a href="#pourquoi" className="hover:text-[#16a34a] transition-colors">
                Pourquoi ENO
              </a>
              <a href="#faq" className="hover:text-[#16a34a] transition-colors">
                FAQ
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://wa.me/2290197362906"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25d366] hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                WhatsApp
              </a>
              <Link
                href="/partenaire"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0f291e] hover:bg-[#16a34a] text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all active:scale-95"
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
            <a href="#comment-ca-marche" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-[#16a34a]">
              Comment ça marche
            </a>
            <a href="#closing" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-[#16a34a]">
              Closing Téléphonique
            </a>
            <a href="#pourquoi" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-900">
              Pourquoi ENO LIVRAISON
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-slate-900">
              FAQ
            </a>
            <Link href="/partenaire" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-black text-[#16a34a]">
              Espace Partenaire / Connexion
            </Link>
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href="https://wa.me/2290197362906"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25d366] text-white font-bold text-xs shadow-md"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Bénin
              </a>
              <a
                href="tel:+2290197362906"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#0f291e] text-white font-bold text-xs shadow-md"
              >
                <PhoneCall className="w-4 h-4 text-[#86efac]" /> Appeler l&apos;Agence
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* 🌟 HERO SECTION WITH 3D ROTATING PHOTO CAROUSEL */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white py-12 lg:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy (6 cols) */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 text-[#15803d] text-xs font-bold border border-emerald-300 shadow-sm">
                <Sparkles className="w-4 h-4 animate-pulse text-[#16a34a]" />
                CLOSING & LOGISTIQUE E-COMMERCE AU BÉNIN
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                Vos colis, notre priorité avec <span className="text-[#16a34a]">ENO LIVRAISON</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                <strong>ENO LIVRAISON</strong> prend en charge vos confirmations téléphoniques par des closeuses professionnelles sous 15 minutes, stocke gratuitement vos produits dans nos entrepôts sécurisés à Cotonou et assure vos livraisons express Cash On Delivery à Cotonou, Calavi, Porto-Novo et Parakou.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/partenaire"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Users className="w-5 h-5 text-emerald-100" />
                  Rejoindre l&apos;Espace Partenaire
                </Link>

                <a
                  href="https://wa.me/2290197362906"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25d366] hover:bg-emerald-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <MessageSquare className="w-5 h-5 fill-white" />
                  WhatsApp Direct
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-black text-slate-900">92%+</p>
                  <p className="text-xs text-slate-500 font-semibold">Taux de livraison réussi</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-[#16a34a]">&lt; 2h</p>
                  <p className="text-xs text-slate-500 font-semibold">Cotonou & Calavi</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-700">100%</p>
                  <p className="text-xs text-slate-500 font-semibold">Reversement COD Daily</p>
                </div>
              </div>
            </div>

            {/* Right Side: 3D ROTATING PHOTO CARD STACK */}
            <div className="lg:col-span-6 relative py-6">
              <div className="wrap_3d_card">
                {/* 3D Card 1 */}
                <div className="rotating_card group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/jeune-africain-accepte-commande-par-telephone-ecrit-dans-boites-moto-pizza_496169-2171.avif"
                      alt="Livreur ENO LIVRAISON au téléphone à moto"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#16a34a] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow">
                      LIVREUR ENO À MOTO
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 text-white">
                      <p className="text-xs font-black">Cotonou, Calavi & Porto-Novo</p>
                      <p className="text-[10px] text-emerald-300 font-bold mt-0.5">Prise de commande en direct</p>
                    </div>
                  </div>
                </div>

                {/* 3D Card 2 */}
                <div className="rotating_card group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/femme-afro-americaine-travaille-dans-operateur-centre-appels-agent-du-service-client-portant-casques-microphone-travaillant-ordinateur-portable_627829-586.avif"
                      alt="Closeuse professionnelle ENO LIVRAISON"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#0f291e] text-[#86efac] border border-emerald-600 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow">
                      CLOSING 15 MIN
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 text-white">
                      <p className="text-xs font-black">Centre de Closing Cotonou</p>
                      <p className="text-[10px] text-emerald-400 font-bold mt-0.5">Relance & Confirmation</p>
                    </div>
                  </div>
                </div>

                {/* 3D Card 3 */}
                <div className="rotating_card group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/cycliste-africain-heureux-se-prepare-livrer-nourriture-son-velo-dans-quartier-residentiel_198115-4821.avif"
                      alt="Livreur ENO souriant prêt pour expédition"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#16a34a] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow">
                      LIVRAISON &lt; 2H
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 text-white">
                      <p className="text-xs font-black">Service Courtois & Rapide</p>
                      <p className="text-[10px] text-emerald-300 font-bold mt-0.5">Taux de réussite +92%</p>
                    </div>
                  </div>
                </div>

                {/* 3D Card 4 */}
                <div className="rotating_card group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/gros-plan-livreur-colis_23-2149095905.avif"
                      alt="Remise du colis et paiement cash COD"
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow">
                      CASH COD
                    </div>
                    <div className="absolute bottom-4 left-3 right-3 text-white">
                      <p className="text-xs font-black">Remise du Colis Client</p>
                      <p className="text-[10px] text-emerald-300 font-bold mt-0.5">Reversement Mobile Money</p>
                    </div>
                  </div>
                </div>
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

          {/* 4-Step Process Grid with Arrows */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center relative group">
                  {/* Icon Box with Number Badge */}
                  <div className="relative mb-6">
                    <div className={`w-24 h-24 rounded-3xl ${step.color} text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300`}>
                      <StepIcon className="w-10 h-10 stroke-[2]" />
                    </div>
                    {/* Number Badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0f291e] text-white font-black text-xs flex items-center justify-center border-2 border-white shadow">
                      {step.number}
                    </div>
                  </div>

                  {/* Step Title & Description */}
                  <h3 className="text-lg font-black text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal max-w-xs">{step.desc}</p>

                  {/* Arrow pointing to next step */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-10 -right-6 text-emerald-300 z-10">
                      <ArrowRight className="w-6 h-6 stroke-[2]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔮 CLOSING SECTION */}
      <section id="closing" className="py-20 bg-emerald-50/40 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Photo */}
            <div className="lg:col-span-5 relative holo_wobble_container py-6">
              <div className="holo_wobble_card bg-white border-4 border-white overflow-hidden group">
                <div className="relative rounded-2xl overflow-hidden h-[380px]">
                  <Image
                    src="/images/femme-afro-americaine-travaille-dans-operateur-centre-appels-agent-du-service-client-portant-casques-microphone-travaillant-ordinateur-portable_627829-586.avif"
                    alt="Opératrice téléconseillère ENO LIVRAISON au centre d'appel"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="px-3 py-1 rounded-full bg-[#16a34a] text-white text-[10px] font-black uppercase tracking-wider shadow">
                      Centre Closing ENO Cotonou
                    </span>
                    <p className="text-xs font-bold text-slate-100 mt-1">
                      Une équipe locale dédiée à la conversion de vos prospects indécis.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Explanation */}
            <div className="lg:col-span-7 space-y-6 kinetic_text_panel py-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f291e] text-white text-xs font-bold shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <Headphones className="w-3.5 h-3.5 text-[#86efac]" />
                <span>POURQUOI LE CLOSING CHANGE TOUT</span>
                <span className="bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                  CENTRE ACTIF COTONOU
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text_gradient_shimmer tracking-tight leading-tight">
                Ne perdez plus 40% de vos ventes à cause du manque de confirmation
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                En Afrique, l&apos;achat en ligne repose d&apos;abord sur la confiance humaine. Chez <strong>ENO LIVRAISON</strong>, nos opératrices téléphoniques à Cotonou appellent vos prospects sous 15 minutes pour valider leur commande, préciser l&apos;adresse exacte et garantir leur disponibilité.
              </p>

              {/* 2 Pro Interactive Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      98% de Réponse
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">Appels en Français & Langues Locales</h4>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                    Échanges courtois et rassurants adaptés aux clients de Cotonou, Calavi, Porto-Novo et Parakou.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <Activity className="w-5 h-5 text-[#16a34a]" />
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Synchro Dashboard
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900">Suivi en Direct & Notes Closeuses</h4>
                  <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                    Chaque appel est consigné avec l&apos;adresse validée et le statut de livraison réactualisé.
                  </p>
                </div>
              </div>

              {/* Live Stat Footer Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0f291e] text-white text-xs border border-emerald-900 shadow-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Taux de Conversion Moyen</p>
                    <p className="font-black text-emerald-400">92.4% d&apos;achats confirmés</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-300" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Délai moyen d&apos;appel</p>
                    <p className="font-black text-white">&lt; 15 minutes chrono</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 NOS SERVICES */}
      <section id="services" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Des solutions de closing & logistique adaptées aux e-commerçants
            </h2>
            <p className="text-slate-600 text-sm">
              Du premier appel du client jusqu&apos;à l&apos;encaissement du cash et son reversement dans vos mains.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Closing Téléphonique Pro */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between group transition-all hover:shadow-xl hover:border-emerald-300">
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src="/images/femme-afro-americaine-travaille-dans-operateur-centre-appels-agent-du-service-client-portant-casques-microphone-travaillant-ordinateur-portable_627829-586.avif"
                  alt="Opératrice Téléphonique Closeuse"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-[#16a34a] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  1. Closing Téléphonique
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold">
                  Validation prospect en 15 min
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">1. Closing Téléphonique Pro</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Nos opératrices béninoises qualifiées appellent vos prospects sous 15 min pour valider l&apos;achat et l&apos;adresse exacte.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">800 F CFA / commande</span>
                  <Link href="/partenaire" className="text-[#16a34a] font-black hover:underline">
                    Détails →
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Stockage & Entrepôt Cotonou */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between group transition-all hover:shadow-xl hover:border-emerald-300">
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src="/images/jeune-africain-accepte-commande-par-telephone-ecrit-dans-boites-moto-pizza_496169-2171.avif"
                  alt="Stockage entrepôt et préparation colis"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-[#0f291e] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  2. Stockage Gratuit
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold">
                  Hubs Cotonou & Abomey-Calavi
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">2. Stockage & Entrepôt</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Entreposage gratuit et sécurisé de vos marchandises dans nos hubs sous surveillance 24h/24.
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
                  src="/images/gros-plan-livreur-colis_23-2149095905.avif"
                  alt="Remise colis livreur ENO LIVRAISON"
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
                    Livraison directe à domicile avec encaissement du cash et reversement Mobile Money garanti.
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

            {/* Card 4: Dashboard & Synchro E-commerce */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between group transition-all hover:shadow-xl hover:border-emerald-300">
              <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                <Image
                  src="/images/istockphoto-1481860080-612x612.jpg"
                  alt="Expédition colis et gestion entrepôt ENO"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover brightness-110 contrast-105 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#0f291e] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                  4. Suivi Dashboard
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-slate-900 font-extrabold text-xs bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-slate-200">
                  Synchro Shopify & Suivi Réel
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">4. Dashboard & Synchro E-commerce</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Pilotez vos ventes, suivez chaque coursier et consultez vos bilans financiers en temps réel.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-600">GRATUIT</span>
                  <Link href="/partenaire" className="text-[#16a34a] font-black hover:underline">
                    Accéder →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 COMPARATIF VS BATTLE CARDS */}
      <section id="pourquoi" className="py-20 bg-[#0f291e] text-white relative overflow-hidden border-b border-emerald-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

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

          {/* 🌟 2 HIGH-TECH DUAL LEVITATING VS BATTLE CARDS */}
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

              {/* Points Negative */}
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
                  <span>Aucun tableau de bord ni suivi d&apos;avancement en temps réel</span>
                </div>
              </div>

              {/* Progress Metric */}
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
              <div className="w-14 h-14 rounded-full bg-[#16a34a] text-white font-black text-lg flex items-center justify-center shadow-[0_0_25px_rgba(22,163,74,0.6)] border-4 border-[#0f291e] animate-pulse">
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

              {/* Points Positive */}
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex items-start gap-2.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>Closing téléphonique pro sous 15 min (Français + Langues)</span>
                </div>
                <div className="flex items-start gap-2.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>Stockage 100% OFFERT dans nos entrepôts Cotonou & Calavi</span>
                </div>
                <div className="flex items-start gap-2.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Reversement Cash COD quotidien par MTN MoMo / Moov</span>
                </div>
                <div className="flex items-start gap-2.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                  <span>Dashboard e-commerçant complet & synchro automatique</span>
                </div>
              </div>

              {/* Progress Metric */}
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

          {/* 📋 DETAILED COMPARISON TABLE */}
          <div className="max-w-4xl mx-auto bg-slate-950 border border-emerald-900/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 bg-[#091b14] border-b border-emerald-900 font-black text-xs uppercase tracking-widest text-emerald-400 flex items-center justify-between">
              <span>Tableau de Synthèse des Performances</span>
              <span className="text-[10px] text-emerald-200 font-normal">Mise à jour Bénin</span>
            </div>

            <div className="divide-y divide-emerald-950 text-xs font-semibold">
              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-black text-white">Confirmation & Relance Client</div>
                <div className="col-span-3 text-center text-slate-400 flex items-center justify-center gap-1 font-normal">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" /> Inexistante
                </div>
                <div className="col-span-4 text-center text-emerald-400 font-black flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Closeuses dédiées (15 min)
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-black text-white">Frais d&apos;Entreposage / Stock</div>
                <div className="col-span-3 text-center text-slate-400 font-normal">À votre charge</div>
                <div className="col-span-4 text-center text-emerald-400 font-black">100% Gratuit à Cotonou</div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-black text-white">Délai de Reversement COD</div>
                <div className="col-span-3 text-center text-rose-400 font-normal">7 à 14 jours</div>
                <div className="col-span-4 text-center text-white font-black bg-emerald-900/40 py-1 rounded-lg border border-emerald-700/50">
                  Quotidien (MTN / Moov)
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 font-black text-white">Couverture géographique</div>
                <div className="col-span-3 text-center text-slate-400 font-normal">Cotonou uniquement</div>
                <div className="col-span-4 text-center text-emerald-100 font-black">
                  Cotonou, Calavi, Porto-Novo, Parakou
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
              Tout ce que vous devez savoir sur nos services de closing et livraison.
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
          <div className="bg-[#0f291e] rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-emerald-900">
            <div className="max-w-xl mx-auto space-y-3 relative z-10">
              <span className="px-3.5 py-1 rounded-full bg-[#16a34a] text-white text-[10px] font-black uppercase tracking-wider">
                Rejoignez ENO LIVRAISON
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Booster vos ventes e-commerce au Bénin dès aujourd&apos;hui
              </h2>
              <p className="text-emerald-100/80 text-xs sm:text-sm font-medium">
                Création de compte gratuite en 2 minutes. Vos colis, notre priorité.
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
                href="https://wa.me/2290197362906"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-[#25d366] hover:bg-emerald-600 text-white font-black text-xs transition-all flex items-center gap-2 shadow-xl"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                WhatsApp Direct
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 👑 FOOTER WITH OFFICIAL ENO LIVRAISON LOGO */}
      <footer className="bg-[#091b14] text-slate-400 border-t border-emerald-950 pt-12 pb-8 text-[11px] antialiased">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-10 border-b border-emerald-900/60">
            {/* Col 1: Brand & Bio */}
            <div className="md:col-span-4 space-y-3.5">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500 bg-white">
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
                Infrastructures de closing téléphonique professionnel, entreposage gratuit et livraison express Cash On Delivery pour e-commerçants au Bénin.
              </p>

              <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-200 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60 w-fit">
                <MapPin className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                <span>Cotonou (Cadjehoun & Haie-Vive), Bénin</span>
              </div>
            </div>

            {/* Col 2: Navigation Rapide */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-white text-[11px] font-black uppercase tracking-wider">
                Navigation
              </h4>
              <ul className="space-y-2 text-slate-400 font-normal">
                <li>
                  <a href="#services" className="hover:text-emerald-300 transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#comment-ca-marche" className="hover:text-emerald-300 transition-colors">
                    Comment ça marche
                  </a>
                </li>
                <li>
                  <a href="#closing" className="hover:text-emerald-300 transition-colors">
                    Centre de Closing
                  </a>
                </li>
                <li>
                  <a href="#pourquoi" className="hover:text-emerald-300 transition-colors">
                    Pourquoi ENO
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Nos Solutions */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-white text-[11px] font-black uppercase tracking-wider">
                Nos Solutions E-commerce
              </h4>
              <ul className="space-y-2 text-slate-400 font-normal">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                  <span>Closing Téléphonique 15 min</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                  <span>Entrepôt & Stockage Gratuit</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Livraison Express COD (&lt; 2h)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                  <span>Reversement Daily Mobile Money</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & MoMo */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-white text-[11px] font-black uppercase tracking-wider">
                Contact & Support
              </h4>
              <div className="space-y-2 text-slate-300 font-medium">
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                  <span>+229 01 97 36 29 06</span>
                </p>
                <p className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#25d366] shrink-0" />
                  <span>+229 01 97 36 29 06 (WhatsApp)</span>
                </p>
                <p className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Globe className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                  <span>contact@enolivraison.bj</span>
                </p>
              </div>

              {/* Payment Methods */}
              <div className="pt-1">
                <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
                  <span className="bg-emerald-950 text-yellow-400 px-2 py-0.5 rounded-md border border-emerald-800">
                    MTN MoMo
                  </span>
                  <span className="bg-emerald-950 text-blue-400 px-2 py-0.5 rounded-md border border-emerald-800">
                    Moov Money
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-800">
                    Wave / Cash
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} ENO LIVRAISON (Bénin). Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <Link href="/partenaire" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Espace Partenaire
              </Link>
              <span className="text-slate-700">•</span>
              <a href="https://wa.me/2290197362906" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Support Client
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
