"use client";

import React, { useState } from "react";
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Camera,
  Check,
  Smartphone,
  ShieldCheck,
  Lock,
  Bell,
  Sparkles,
} from "lucide-react";
import { currentPartner } from "@/lib/mock-data";

export default function ProfilPage() {
  const [fullName, setFullName] = useState(currentPartner.fullName);
  const [companyName, setCompanyName] = useState(currentPartner.companyName);
  const [email, setEmail] = useState(currentPartner.email);
  const [phone, setPhone] = useState(currentPartner.phone);
  const [address, setAddress] = useState(currentPartner.address);

  // Mobile Money Numbers
  const [momoNumber, setMomoNumber] = useState("+229 01 97 36 29 06");
  const [moovNumber, setMoovNumber] = useState("+229 97 12 34 56");
  const [preferredPayout, setPreferredPayout] = useState("MTN");

  // Passwords
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in-up max-w-5xl">
      {/* HEADER SECTION */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Mon Profil Partenaire</h2>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Compte Vérifié ENO LIVRAISON Bénin
          </span>
        </div>
        <p className="text-xs text-emerald-300/70 mt-1">
          Gérez vos coordonnées d&apos;entreprise et vos numéros de reversement Mobile Money.
        </p>
      </div>

      <div className="bg-[#091b14] border border-emerald-900/60 rounded-3xl overflow-hidden shadow-2xl">
        {/* BRAND GRADIENT BANNER */}
        <div className="h-40 bg-gradient-to-r from-[#091b14] via-[#0d261c] to-[#15803d] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* PROFILE HEADER & AVATAR */}
        <div className="px-6 sm:px-10 pb-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-8">
            <div className="flex items-end gap-5">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-emerald-950 border-4 border-[#091b14] flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                  {companyName.charAt(0)}
                </div>
                <button
                  type="button"
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-transform active:scale-90"
                  title="Changer le logo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 pb-1">
                <h3 className="text-2xl sm:text-3xl font-black text-white">{companyName}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                    Actif
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[#22c55e] text-[10px] font-black uppercase tracking-wider">
                    Partenaire ENO Vérifié
                  </span>
                </div>
              </div>
            </div>

            {saved && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold animate-bounce">
                <Check className="w-4 h-4" /> Modifications enregistrées !
              </span>
            )}
          </div>

          {/* MAIN FORM */}
          <form onSubmit={handleSave} className="space-y-8">
            {/* SECTION 1: Informations Générales */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-3">
                <Building className="w-4 h-4 text-[#22c55e]" />
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Informations de l&apos;Entreprise
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nom complet */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200/80 uppercase">Nom complet du Gérant</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                {/* Nom de l'entreprise */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200/80 uppercase">Nom de l&apos;Enseigne E-commerce</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200/80 uppercase">Adresse Email Officielle</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200/80 uppercase">Téléphone WhatsApp Direct</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-200/80 uppercase">Adresse du Siège / Magasin</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Paramètres Mobile Money Payout */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-3">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Numéros de Reversement Mobile Money (Bénin)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-yellow-400 uppercase">Numéro MTN Mobile Money</label>
                  <input
                    type="text"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-blue-400 uppercase">Numéro Moov Money</label>
                  <input
                    type="text"
                    value={moovNumber}
                    onChange={(e) => setMoovNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Sécurité */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-3">
                <Lock className="w-4 h-4 text-[#22c55e]" />
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Sécurité & Mot de Passe</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200/80 uppercase">Ancien Mot de Passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-emerald-200/80 uppercase">Nouveau Mot de Passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-4 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
              >
                Enregistrer les Modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
