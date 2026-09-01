"use client";

import React, { useState } from "react";
import {
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  KeyRound,
  Link2,
  ShieldCheck,
  ArrowUpRight,
  X,
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

      if (isShopify) {
        setShopifyConnected(true);
      } else {
        setYoucanConnected(true);
      }

      setConnectedShopName(data.shopName || shopUrl);
      setShowConfigModal(null);
      setShopUrl("");
      setApiKey("");
    } catch {
      setErrorMsg("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up w-full max-w-4xl min-w-0">
      {/* 🏛️ HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-2 border-b border-[#EAE6DD] min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-[#787163] truncate">
            <span>Passerelle E-Commerce</span>
            <span>•</span>
            <span className="text-[#0D5940]">Synchronisation Automatique</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#141A17] tracking-tight mt-1 truncate">
            Connexion E-Commerce
          </h2>
          <p className="text-xs text-[#787163] mt-1 leading-normal">
            Reliez votre boutique en ligne pour importer automatiquement vos commandes vers ENO LIVRAISON.
          </p>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      {(shopifyConnected || youcanConnected) && connectedShopName && (
        <div className="p-4 rounded-2xl bg-white border border-[#0D5940] text-[#0D5940] text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0D5940] shrink-0" />
            <span>
              Boutique &quot;{connectedShopName}&quot; reliée avec succès ! Les nouvelles commandes COD seront importées automatiquement.
            </span>
          </div>
          <span className="text-[10px] bg-[#FAF9F5] border border-[#EAE6DD] text-[#0D5940] px-2.5 py-0.5 rounded-full uppercase font-bold shrink-0">
            Synchronisé
          </span>
        </div>
      )}

      {/* 2 MAIN PLATFORMS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* SHOPIFY CARD */}
        <div
          onClick={() => {
            if (!shopifyConnected) {
              setShowConfigModal("Shopify");
              setErrorMsg("");
            }
          }}
          className={`bg-white border ${
            shopifyConnected ? "border-[#0D5940] shadow-xs" : "border-[#EAE6DD] hover:border-[#0D5940]/50"
          } rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer transition-all shadow-2xs group`}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FAF9F5] border border-[#EAE6DD] flex items-center justify-center p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/shopify-logo.png" alt="Shopify" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-[#141A17] text-base">Shopify</h4>
            <p className="text-xs text-[#787163]">
              {shopifyConnected ? (
                <span className="text-[#0D5940] font-bold flex items-center gap-1 justify-center">
                  <Check className="w-3.5 h-3.5" /> Boutique reliée & active
                </span>
              ) : (
                "Connecter avec une clé Admin API"
              )}
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-[#141A17] group-hover:bg-[#0D5940] text-white text-xs font-bold transition-colors"
          >
            {shopifyConnected ? "Paramètres" : "Relier Shopify"}
          </button>
        </div>

        {/* YOUCAN CARD */}
        <div
          onClick={() => {
            if (!youcanConnected) {
              setShowConfigModal("Youcan");
              setErrorMsg("");
            }
          }}
          className={`bg-white border ${
            youcanConnected ? "border-[#0D5940] shadow-xs" : "border-[#EAE6DD] hover:border-[#0D5940]/50"
          } rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer transition-all shadow-2xs group`}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#0066ff] flex items-center justify-center text-white font-black text-2xl shadow-xs">
            Y
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-[#141A17] text-base">YouCan Shop</h4>
            <p className="text-xs text-[#787163]">
              {youcanConnected ? (
                <span className="text-[#0D5940] font-bold flex items-center gap-1 justify-center">
                  <Check className="w-3.5 h-3.5" /> Boutique reliée & active
                </span>
              ) : (
                "Connecter avec un token d'accès"
              )}
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-[#141A17] group-hover:bg-[#0D5940] text-white text-xs font-bold transition-colors"
          >
            {youcanConnected ? "Paramètres" : "Relier YouCan"}
          </button>
        </div>
      </div>

      {/* CUSTOM INTEGRATION NOTE */}
      <div className="p-4 rounded-2xl bg-white border border-[#EAE6DD] text-xs text-[#5C5649] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full min-w-0">
        <p>
          Vous utilisez <strong className="text-[#141A17]">WooCommerce</strong>, <strong className="text-[#141A17]">PrestaShop</strong> ou un système sur-mesure ?
        </p>
        <a
          href="https://wa.me/2290164291884"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0D5940] font-bold hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Intégration API personnalisée</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* GUIDE ACCORDÉON SHOPIFY */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-white border border-[#EAE6DD] rounded-3xl shadow-2xs overflow-hidden">
        <button
          onClick={() => setShowGuide(showGuide === "shopify" ? null : "shopify")}
          className="w-full p-6 flex items-center justify-between hover:bg-[#FAF9F5] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[#EAE6DD] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#0D5940]" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black text-[#141A17]">Guide pas-à-pas : Obtenir votre clé API Shopify</h4>
              <p className="text-xs text-[#787163]">Configuration rapide en 4 étapes dans votre panneau Shopify</p>
            </div>
          </div>
          {showGuide === "shopify" ? (
            <ChevronUp className="w-4 h-4 text-[#8C8474]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#8C8474]" />
          )}
        </button>

        {showGuide === "shopify" && (
          <div className="px-6 pb-6 space-y-4 border-t border-[#EAE6DD] pt-5 text-xs text-[#5C5649]">
            <div className="bg-[#FAF9F5] border border-[#EAE6DD] rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-[#0D5940] uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Ce dont vous avez besoin
              </h5>
              <p>
                1. <strong>URL de votre boutique</strong> (ex : <code className="bg-white border border-[#EAE6DD] px-1.5 py-0.5 rounded text-[11px] text-[#141A17]">votre-boutique.myshopify.com</code>)
              </p>
              <p>
                2. <strong>Jeton Admin API</strong> (commençant par <code className="bg-white border border-[#EAE6DD] px-1.5 py-0.5 rounded text-[11px] text-[#0D5940]">shpat_...</code>)
              </p>
            </div>

            <ol className="space-y-2.5 list-decimal list-inside leading-relaxed">
              <li>Connectez-vous à votre administration Shopify ➔ <strong>Paramètres</strong> ➔ <strong>Applications et canaux de vente</strong>.</li>
              <li>Cliquez sur <strong>Développer des applications</strong> puis <strong>Créer une application</strong> (nommez-la &quot;ENO LIVRAISON&quot;).</li>
              <li>Dans <strong>Étendue de l&apos;API Admin</strong>, cochez les autorisations en lecture : <code className="bg-[#FAF9F5] px-1 py-0.5 rounded text-[11px]">read_orders</code> et <code className="bg-[#FAF9F5] px-1 py-0.5 rounded text-[11px]">read_products</code>.</li>
              <li>Cliquez sur <strong>Installer l&apos;application</strong> et copiez votre <strong>Jeton d&apos;accès à l&apos;API Admin</strong>.</li>
            </ol>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* MODAL DE CONNEXION */}
      {/* ═══════════════════════════════════════════ */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-[#141A17]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE6DD] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DD]">
              <div>
                <h3 className="text-base font-black text-[#141A17]">Relier {showConfigModal}</h3>
                <p className="text-xs text-[#787163] mt-0.5">Import automatique et sécurisé</p>
              </div>
              <button
                onClick={() => { setShowConfigModal(null); setErrorMsg(""); }}
                className="w-8 h-8 rounded-xl bg-[#FAF9F5] border border-[#EAE6DD] text-[#8C8474] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#A84232]/30 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#A84232] shrink-0 mt-0.5" />
                <p className="text-xs text-[#A84232] font-bold">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#141A17] uppercase flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#0D5940]" />
                  URL de la boutique
                </label>
                <input
                  type="text"
                  required
                  placeholder={showConfigModal === "Shopify" ? "ma-boutique.myshopify.com" : "ma-boutique.youcan.shop"}
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#EAE6DD] rounded-xl text-xs text-[#141A17] focus:outline-none focus:border-[#0D5940] focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#141A17] uppercase flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#C5A059]" />
                  {showConfigModal === "Shopify" ? "Token Admin API (shpat_...)" : "Token API YouCan"}
                </label>
                <input
                  type="password"
                  required
                  placeholder={showConfigModal === "Shopify" ? "shpat_xxxxxxxxxxxxxxxxxxxxxxxx" : "votre-token-api-youcan"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF9F5] border border-[#EAE6DD] rounded-xl text-xs text-[#141A17] focus:outline-none focus:border-[#0D5940] focus:bg-white font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setShowConfigModal(null); setErrorMsg(""); }}
                  className="px-4 py-2.5 rounded-xl border border-[#EAE6DD] text-[#5C5649] text-xs font-bold hover:bg-[#FAF9F5]"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#141A17] hover:bg-[#0D5940] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Connexion en cours...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#C5A059]" /> Valider la connexion
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
