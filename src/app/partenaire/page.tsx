"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  BarChart3,
  Truck,
  Star,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Shield,
  User,
  Phone,
  Store,
  MapPin,
  CheckCircle2,
} from "lucide-react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<"partenaire" | "agence">("partenaire");

  useEffect(() => {
    const mode = searchParams.get("mode") || searchParams.get("tab");
    if (mode === "register" || mode === "signup" || mode === "inscription") {
      setIsRegister(true);
    }
  }, [searchParams]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("judesinaberogui@gmail.com");
  const [loginPassword, setLoginPassword] = useState("Mercredi12@");

  // Signup form state
  const [fullName, setFullName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [city, setCity] = useState("Cotonou");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (role === "agence") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Compte créé avec succès ! Redirection en cours...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }, 700);
  };

  return (
    <div className="max-w-[420px] w-full mx-auto space-y-6">
      {/* Mobile Back Link */}
      <div className="lg:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#06b6d4] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Retour à l&apos;accueil
        </Link>
      </div>

      {/* 🔘 TOP ROLE SWITCHER (STYLE ÉPURÉ DE L'IMAGE 1 + COULEURS SCMSLIVRAISON) */}
      <div className="bg-[#eef2f6] p-1.5 rounded-2xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            setRole("partenaire");
            setSuccessMsg("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold transition-all ${
            role === "partenaire"
              ? "bg-white text-[#06b6d4] shadow-sm font-extrabold"
              : "text-slate-500 hover:text-slate-800 font-semibold"
          }`}
        >
          <Truck className="w-4 h-4" /> Partenaire
        </button>

        <button
          type="button"
          onClick={() => {
            setRole("agence");
            setIsRegister(false);
            setSuccessMsg("");
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold transition-all ${
            role === "agence"
              ? "bg-[#090e22] text-white shadow-sm font-extrabold"
              : "text-slate-500 hover:text-slate-800 font-semibold"
          }`}
        >
          <Shield className="w-4 h-4" /> Agence
        </button>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* FORM TITLE & SUBTITLE */}
      <div className="space-y-1.5 pt-2">
        <h2 className="text-3xl font-black text-[#090e22] tracking-tight">
          {isRegister ? "Créer un compte" : "Bon retour !"}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {isRegister
            ? "Inscrivez-vous à votre espace partenaire"
            : role === "partenaire"
            ? "Connectez-vous à votre espace partenaire"
            : "Connectez-vous à votre espace agence"}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 📝 FORMULAIRE D'INSCRIPTION (CRÉER UN COMPTE) */}
      {/* ══════════════════════════════════════════════════════ */}
      {isRegister ? (
        <form onSubmit={handleSignup} className="space-y-3.5">
          {/* Nom complet */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nom et prénom du gérant"
              className="w-full pl-11 pr-4 py-3.5 bg-[#eef4fc] border border-transparent hover:border-slate-200 focus:border-[#06b6d4]/40 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
            />
          </div>

          {/* Nom de la boutique */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Store className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Nom de votre boutique e-commerce"
              className="w-full pl-11 pr-4 py-3.5 bg-[#eef4fc] border border-transparent hover:border-slate-200 focus:border-[#06b6d4]/40 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
            />
          </div>

          {/* Téléphone WhatsApp */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4 text-[#25d366]" />
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Numéro WhatsApp (+229...)"
              className="w-full pl-11 pr-4 py-3.5 bg-[#eef4fc] border border-transparent hover:border-slate-200 focus:border-[#06b6d4]/40 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
            />
          </div>

          {/* Ville */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-[#eef4fc] border border-transparent hover:border-slate-200 focus:border-[#06b6d4]/40 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:bg-white transition-all"
            >
              <option value="Cotonou">Cotonou</option>
              <option value="Abomey-Calavi">Abomey-Calavi</option>
              <option value="Porto-Novo">Porto-Novo</option>
              <option value="Parakou">Parakou</option>
              <option value="Autre">Autre ville</option>
            </select>
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <input
              type="email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              placeholder="Adresse email"
              className="w-full pl-11 pr-4 py-3.5 bg-[#eef4fc] border border-transparent hover:border-slate-200 focus:border-[#06b6d4]/40 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
            />
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full pl-11 pr-11 py-3.5 bg-[#eef4fc] border border-transparent hover:border-slate-200 focus:border-[#06b6d4]/40 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Bouton de soumission Cyan */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#06b6d4] hover:bg-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 mt-3"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Créer un compte"
            )}
          </button>

          {/* Switch vers connexion */}
          <p className="text-center text-xs text-slate-500 font-medium pt-3">
            Déjà un compte ?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className="font-bold text-[#06b6d4] hover:underline"
            >
              Se connecter
            </button>
          </p>
        </form>
      ) : (
        /* ══════════════════════════════════════════════════════ */
        /* 🔐 FORMULAIRE DE CONNEXION (FORME IMAGE 1 + CYAN SCMS) */
        /* ══════════════════════════════════════════════════════ */
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Champ Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Adresse email"
              className="w-full pl-11 pr-4 py-3.5 bg-[#eef4fc] border border-transparent hover:border-slate-200 focus:border-[#06b6d4]/40 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
            />
          </div>

          {/* Champ Mot de passe */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4 text-[#06b6d4]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full pl-11 pr-11 py-3.5 bg-[#eef4fc] border border-transparent hover:border-slate-200 focus:border-[#06b6d4]/40 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Mot de passe oublié */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="text-xs font-medium text-slate-500 hover:text-[#06b6d4] transition-colors"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton Se connecter Cyan scmslivraison */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#06b6d4] hover:bg-cyan-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Se connecter"
            )}
          </button>

          {/* Séparateur OU */}
          <div className="relative flex items-center justify-center pt-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400 relative">
              OU
            </span>
          </div>

          {/* Bouton Google */}
          <button
            type="button"
            onClick={() => {
              if (role === "agence") router.push("/admin");
              else router.push("/dashboard");
            }}
            className="w-full py-3.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            Continuer avec Google
          </button>

          {/* Lien bas de page : Pas encore de compte ? Créer un compte */}
          <p className="text-center text-xs text-slate-500 font-medium pt-3">
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className="font-bold text-[#06b6d4] hover:underline"
            >
              Créer un compte
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-[#06b6d4] selection:text-white font-sans">
      {/* LEFT COLUMN (Dark Feature Showcase) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[#090e22] text-white overflow-hidden border-r border-slate-800">
        {/* Glow ambient */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#06b6d4]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="relative z-10 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#06b6d4] hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#06b6d4] shadow-lg shadow-cyan-500/10">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black text-white block tracking-tight">
                scms<span className="text-[#06b6d4]">livraison</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                ESPACE PARTENAIRES & LOGISTIQUE BÉNIN
              </span>
            </div>
          </div>
        </div>

        {/* Main Pitch */}
        <div className="relative z-10 my-8 space-y-6 max-w-lg">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
              Gérez votre activité <br />
              <span className="text-[#06b6d4]">en toute simplicité</span>
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed font-normal">
              Rejoignez le réseau scmslivraison et accédez à des outils puissants pour développer et automatiser votre commerce en ligne au Bénin.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur">
              <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/20 text-[#06b6d4] flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Gestion des commandes</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">
                  Suivez toutes vos commandes en temps réel depuis votre espace dédié.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Statistiques détaillées</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">
                  Taux de livraison, chiffre d&apos;affaires, performances journalières.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Suivi des livraisons</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">
                  scmslivraison gère la logistique et le closing, vous gérez votre business.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Commissions transparentes</h4>
                <p className="text-xs text-slate-400 mt-0.5 font-normal">
                  Reversements Mobile Money instantanés et bilans clairs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-slate-800">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#06b6d4] text-white text-xs font-black flex items-center justify-center border-2 border-[#090e22]">
              F
            </div>
            <div className="w-8 h-8 rounded-full bg-[#090e22] text-[#06b6d4] text-xs font-black flex items-center justify-center border-2 border-white">
              M
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center border-2 border-[#090e22]">
              A
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-cyan-300 text-xs font-black flex items-center justify-center border-2 border-[#090e22]">
              S
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-400">
            <span className="text-white font-bold">+200 e-commerçants béninois</span> nous font déjà confiance
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN (Auth Form) */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 overflow-y-auto">
        <Suspense fallback={<div className="text-center text-slate-400 text-xs">Chargement...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
