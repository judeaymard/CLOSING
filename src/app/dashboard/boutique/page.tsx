"use client";

import React, { useState } from "react";
import {
  Globe,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ExternalLink,
  Copy,
  KeyRound,
  Link2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function BoutiquePage() {
  const [shopifyConnected, setShopifyConnected] = useState(false);
  const [youcanConnected, setYoucanConnected] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState<string | null>(null);

  // Form state
  const [shopUrl, setShopUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Connection state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [connectedShopName, setConnectedShopName] = useState("");

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const isShopify = showConfigModal === "Shopify";
      const endpoint = isShopify
        ? "/api/integrations/shopify/connect"
        : "/api/integrations/youcan/connect";

      const payload = isShopify
        ? { shopUrl, accessToken: apiKey }
        : { storeUrl: shopUrl, apiToken: apiKey };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Échec de la connexion. Vérifiez vos identifiants.");
        setIsLoading(false);
        return;
      }

      // Success
      const name = data.shop?.name || data.store?.name || showConfigModal;
      setConnectedShopName(name);

      if (isShopify) {
        setShopifyConnected(true);
      } else {
        setYoucanConnected(true);
      }

      setShowConfigModal(null);
      setShopUrl("");
      setApiKey("");
    } catch {
      setErrorMsg("Impossible de joindre le serveur. Vérifiez votre connexion internet.");
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Boutique en ligne</h2>
        <p className="text-xs text-slate-400 mt-1">
          Reliez votre boutique (Shopify, Youcan...) pour recevoir automatiquement les commandes de vos produits reliés.
        </p>
      </div>

      {/* SUCCESS TOAST */}
      {(shopifyConnected || youcanConnected) && connectedShopName && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg max-w-4xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Boutique &quot;{connectedShopName}&quot; reliée avec succès ! Les nouvelles commandes COD seront importées automatiquement.
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full uppercase font-bold shrink-0">Actif</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="bg-[#0b1322] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6 max-w-4xl shadow-xl">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Reliez votre boutique en ligne</h3>
          <p className="text-xs text-slate-400 mt-1">
            Choisissez votre plateforme. Vos produits seront importés (lecture seule) puis reliés à vos stocks.
          </p>
        </div>

        {/* 4 PLATFORMS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* SHOPIFY CARD */}
          <div
            onClick={() => {
              if (!shopifyConnected) {
                setShowConfigModal("Shopify");
                setErrorMsg("");
              }
            }}
            className={`bg-[#121c33] border ${
              shopifyConnected ? "border-emerald-500 bg-emerald-950/20" : "border-emerald-500/60 hover:border-emerald-400"
            } rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all duration-200 group shadow-md`}
          >
            <div className="w-14 h-16 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/shopify-logo.png" alt="Shopify" className="w-14 h-16 object-contain drop-shadow-md" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-white text-base">Shopify</h4>
              <p className="text-xs text-slate-400 font-normal group-hover:text-slate-300 transition-colors">
                {shopifyConnected ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 justify-center">
                    <Check className="w-3.5 h-3.5" /> Boutique reliée
                  </span>
                ) : (
                  "Relier ma boutique Shopify"
                )}
              </p>
            </div>
          </div>

          {/* YOUCAN CARD */}
          <div
            onClick={() => {
              if (!youcanConnected) {
                setShowConfigModal("Youcan");
                setErrorMsg("");
              }
            }}
            className={`bg-[#121c33] border ${
              youcanConnected ? "border-blue-500 bg-blue-950/20" : "border-slate-800/80 hover:border-blue-500/50"
            } rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all duration-200 group shadow-md`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#0066ff] flex items-center justify-center text-white font-black text-xl shadow-md">
              Y
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-white text-base">Youcan</h4>
              <p className="text-xs text-slate-400 font-normal group-hover:text-slate-300 transition-colors">
                {youcanConnected ? (
                  <span className="text-blue-400 font-bold flex items-center gap-1 justify-center">
                    <Check className="w-3.5 h-3.5" /> Boutique reliée
                  </span>
                ) : (
                  "Relier ma boutique Youcan"
                )}
              </p>
            </div>
          </div>

          {/* WOOCOMMERCE CARD */}
          <div className="bg-[#121c33] border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 cursor-not-allowed opacity-90">
            <div className="w-12 h-12 rounded-xl bg-[#2e3748] flex items-center justify-center text-slate-300 font-extrabold text-xl">
              W
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-base">WooCommerce</h4>
              <span className="px-3 py-0.5 rounded-full bg-[#3d2a08] text-[#e59b12] text-[10px] font-bold uppercase inline-block">Bientôt</span>
            </div>
          </div>

          {/* AUTRE CARD */}
          <div className="bg-[#121c33] border border-slate-800/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 cursor-not-allowed opacity-90">
            <div className="w-12 h-12 rounded-xl bg-[#2e3748] flex items-center justify-center text-slate-300">
              <Globe className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-base">Autre plateforme</h4>
              <span className="px-3 py-0.5 rounded-full bg-[#3d2a08] text-[#e59b12] text-[10px] font-bold uppercase inline-block">Bientôt</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 pt-1">
          Vous n&apos;avez pas Shopify ? Reliez librement Youcan. D&apos;autres plateformes arrivent bientôt.
        </p>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* GUIDE DE CONNEXION SHOPIFY */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-[#0b1322] border border-slate-800/80 rounded-2xl max-w-4xl shadow-xl overflow-hidden">
        <button
          onClick={() => setShowGuide(showGuide === "shopify" ? null : "shopify")}
          className="w-full p-5 flex items-center justify-between hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Guide : Comment connecter Shopify ?</h4>
              <p className="text-[11px] text-slate-400">Étapes détaillées pour obtenir votre clé API</p>
            </div>
          </div>
          {showGuide === "shopify" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showGuide === "shopify" && (
          <div className="px-5 pb-6 space-y-4 border-t border-slate-800/80 pt-5">
            {/* Ce dont vous avez besoin */}
            <div className="bg-[#121c33] border border-slate-800/60 rounded-xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-[#06b6d4] uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Ce dont vous avez besoin
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none">
                <li className="flex items-start gap-2">
                  <Link2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><span className="font-bold text-white">URL de votre boutique</span> — ex : <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px] text-emerald-400">ma-boutique.myshopify.com</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="font-bold text-white">Clé API Admin</span> — Un token d&apos;accès commençant par <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px] text-amber-400">shpat_</code></span>
                </li>
              </ul>
            </div>

            {/* Étapes */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-white uppercase">Étapes pour obtenir votre clé API Shopify :</h5>

              <div className="space-y-2.5">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">1</div>
                  <div className="text-xs text-slate-300">
                    Connectez-vous à votre <span className="font-bold text-white">tableau de bord Shopify</span> sur <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px]">admin.shopify.com</code>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">2</div>
                  <div className="text-xs text-slate-300">
                    Allez dans <span className="font-bold text-white">Paramètres</span> (en bas à gauche) <ArrowRight className="w-3 h-3 inline text-slate-500" /> <span className="font-bold text-white">Apps et canaux de vente</span> <ArrowRight className="w-3 h-3 inline text-slate-500" /> <span className="font-bold text-white">Développer des apps</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">3</div>
                  <div className="text-xs text-slate-300">
                    Cliquez sur <span className="font-bold text-white">&quot;Créer une app&quot;</span>, nommez-la <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px] text-[#06b6d4]">scmslivraison</code>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">4</div>
                  <div className="text-xs text-slate-300">
                    Dans <span className="font-bold text-white">&quot;Configuration de l&apos;API Admin&quot;</span>, cochez les permissions : <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px]">read_orders</code>, <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px]">read_products</code> puis cliquez <span className="font-bold text-white">&quot;Enregistrer&quot;</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">5</div>
                  <div className="text-xs text-slate-300">
                    Cliquez <span className="font-bold text-white">&quot;Installer l&apos;app&quot;</span>, puis copiez le <span className="font-bold text-amber-400">Token d&apos;accès Admin API</span> (il commence par <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px] text-amber-400">shpat_</code>)
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#06b6d4]/20 text-[#06b6d4] text-xs font-bold flex items-center justify-center shrink-0">6</div>
                  <div className="text-xs text-slate-300">
                    <span className="font-bold text-[#06b6d4]">Collez votre URL et votre Token</span> dans le formulaire de connexion scmslivraison ci-dessus. C&apos;est terminé ! 🎉
                  </div>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200">
                <span className="font-bold">Important :</span> Ne partagez jamais votre Token avec un tiers. Seul scmslivraison en a besoin pour importer vos commandes COD.
              </p>
            </div>

            <a
              href="https://help.shopify.com/fr/manual/apps/app-types/custom-apps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#06b6d4] font-bold hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Documentation officielle Shopify
            </a>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* GUIDE DE CONNEXION YOUCAN */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-[#0b1322] border border-slate-800/80 rounded-2xl max-w-4xl shadow-xl overflow-hidden">
        <button
          onClick={() => setShowGuide(showGuide === "youcan" ? null : "youcan")}
          className="w-full p-5 flex items-center justify-between hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Guide : Comment connecter Youcan ?</h4>
              <p className="text-[11px] text-slate-400">Étapes détaillées pour obtenir votre clé API</p>
            </div>
          </div>
          {showGuide === "youcan" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showGuide === "youcan" && (
          <div className="px-5 pb-6 space-y-4 border-t border-slate-800/80 pt-5">
            {/* Ce dont vous avez besoin */}
            <div className="bg-[#121c33] border border-slate-800/60 rounded-xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-[#06b6d4] uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Ce dont vous avez besoin
              </h5>
              <ul className="text-xs text-slate-300 space-y-1.5 list-none">
                <li className="flex items-start gap-2">
                  <Link2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><span className="font-bold text-white">URL de votre boutique</span> — ex : <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px] text-blue-400">ma-boutique.youcan.shop</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="font-bold text-white">Token API</span> — Clé d&apos;accès générée dans les paramètres de votre boutique</span>
                </li>
              </ul>
            </div>

            {/* Étapes */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-white uppercase">Étapes pour obtenir votre clé API Youcan :</h5>

              <div className="space-y-2.5">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">1</div>
                  <div className="text-xs text-slate-300">
                    Connectez-vous à votre <span className="font-bold text-white">tableau de bord YouCan</span> sur <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px]">seller-area.youcan.shop</code>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">2</div>
                  <div className="text-xs text-slate-300">
                    Allez dans <span className="font-bold text-white">Paramètres</span> <ArrowRight className="w-3 h-3 inline text-slate-500" /> <span className="font-bold text-white">API &amp; Intégrations</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">3</div>
                  <div className="text-xs text-slate-300">
                    Cliquez <span className="font-bold text-white">&quot;Générer un nouveau token&quot;</span> et donnez-lui le nom <code className="bg-slate-900 px-1.5 py-0.5 rounded text-[11px] text-[#06b6d4]">scmslivraison</code>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">4</div>
                  <div className="text-xs text-slate-300">
                    <span className="font-bold text-amber-400">Copiez le token</span> affiché (il ne sera plus visible ensuite)
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#06b6d4]/20 text-[#06b6d4] text-xs font-bold flex items-center justify-center shrink-0">5</div>
                  <div className="text-xs text-slate-300">
                    <span className="font-bold text-[#06b6d4]">Collez votre URL et votre Token</span> dans le formulaire de connexion scmslivraison ci-dessus. C&apos;est terminé ! 🎉
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200">
                <span className="font-bold">Important :</span> Votre token ne sera affiché qu&apos;une seule fois sur YouCan. Copiez-le immédiatement et conservez-le en lieu sûr.
              </p>
            </div>

            <a
              href="https://developer.youcan.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#06b6d4] font-bold hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Documentation officielle YouCan
            </a>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* COMMENT ÇA MARCHE (FLUX) */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-[#0b1322] border border-slate-800/80 rounded-2xl max-w-4xl shadow-xl overflow-hidden">
        <button
          onClick={() => setShowGuide(showGuide === "flow" ? null : "flow")}
          className="w-full p-5 flex items-center justify-between hover:bg-slate-900/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center">
              <Copy className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white">Comment ça marche après la connexion ?</h4>
              <p className="text-[11px] text-slate-400">Le parcours complet de votre commande</p>
            </div>
          </div>
          {showGuide === "flow" ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {showGuide === "flow" && (
          <div className="px-5 pb-6 space-y-4 border-t border-slate-800/80 pt-5">
            <div className="space-y-3">
              {[
                { step: "1", color: "bg-blue-500/20 text-blue-400", title: "Commande reçue", desc: "Un client passe une commande Cash on Delivery sur votre boutique en ligne." },
                { step: "2", color: "bg-[#06b6d4]/20 text-[#06b6d4]", title: "Import automatique", desc: "La commande apparaît instantanément dans votre espace scmslivraison (onglet Commandes)." },
                { step: "3", color: "bg-amber-500/20 text-amber-400", title: "Closing téléphonique", desc: "Notre équipe de closeuses appelle le client pour confirmer la commande et l'adresse de livraison." },
                { step: "4", color: "bg-purple-500/20 text-purple-400", title: "Préparation & Livraison", desc: "Le colis est préparé depuis l'entrepôt et livré au client. Le livreur encaisse le montant en cash." },
                { step: "5", color: "bg-emerald-500/20 text-emerald-400", title: "Reversement Mobile Money", desc: "Le montant encaissé moins 2 800 F CFA de frais (800 F Closing + 2 000 F Livraison) est viré sur votre MoMo." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3 items-start">
                  <div className={`w-7 h-7 rounded-full ${item.color} text-xs font-bold flex items-center justify-center shrink-0`}>
                    {item.step}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{item.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* CONFIG MODAL */}
      {/* ═══════════════════════════════════════════ */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1322] border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base ${
                  showConfigModal === "Shopify"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}>
                  {showConfigModal === "Shopify" ? "S" : "Y"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Relier {showConfigModal}</h3>
                  <p className="text-xs text-slate-400">Importation automatique des commandes COD</p>
                </div>
              </div>
              <button
                onClick={() => { setShowConfigModal(null); setErrorMsg(""); }}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-300 font-semibold">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#06b6d4]" />
                  URL de la boutique
                </label>
                <input
                  type="text"
                  required
                  placeholder={showConfigModal === "Shopify" ? "ma-boutique.myshopify.com" : "ma-boutique.youcan.shop"}
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#06b6d4] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  {showConfigModal === "Shopify" ? "Token Admin API (shpat_...)" : "Token API YouCan"}
                </label>
                <input
                  type="password"
                  required
                  placeholder={showConfigModal === "Shopify" ? "shpat_xxxxxxxxxxxxxxxxxxxxxxxx" : "votre-token-api-youcan"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#06b6d4] font-mono"
                />
              </div>

              {/* Info box */}
              <div className="bg-[#121c33] border border-slate-800/60 rounded-xl p-3 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#06b6d4] shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400">
                  Vos identifiants sont transmis de manière sécurisée. Consultez le guide ci-dessous pour obtenir votre clé API.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setShowConfigModal(null); setErrorMsg(""); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#06b6d4] hover:bg-cyan-600 text-white text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Connexion en cours...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Valider la connexion
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
