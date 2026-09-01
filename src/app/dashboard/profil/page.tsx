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
    <div className="space-y-6 animate-fade-in-up max-w-4xl">
      {/* HEADER SECTION */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Mon Profil Partenaire</h2>
          <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" /> Compte Vérifié ENO LIVRAISON Bénin
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Gérez vos coordonnées d&apos;entreprise et vos numéros de reversement Mobile Money.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {/* BRAND GRADIENT BANNER */}
        <div className="h-36 bg-gradient-to-r from-emerald-700 via-emerald-600 to-[#16a34a] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* PROFILE HEADER & AVATAR */}
        <div className="px-6 sm:px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-4 border-white flex items-center justify-center text-emerald-700 text-2xl sm:text-3xl font-black shadow-md">
                  {companyName.charAt(0)}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white flex items-center justify-center shadow-md transition-transform active:scale-90"
                  title="Changer le logo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1 pb-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{companyName}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                    Actif
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    Partenaire ENO Vérifié
                  </span>
                </div>
              </div>
            </div>

            {saved && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-xs">
                <Check className="w-4 h-4 text-[#16a34a]" /> Modifications enregistrées !
              </span>
            )}
          </div>

          {/* MAIN FORM */}
          <form onSubmit={handleSave} className="space-y-6">
            {/* SECTION 1: Informations Générales */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Building className="w-4 h-4 text-[#16a34a]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Informations de l&apos;Entreprise
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nom complet */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Nom complet du Gérant</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Nom de l'entreprise */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Nom de l&apos;Enseigne E-commerce</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Adresse Email Officielle</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Téléphone WhatsApp Direct</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Adresse du Siège / Magasin</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Paramètres Mobile Money Payout */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Smartphone className="w-4 h-4 text-[#16a34a]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Numéros de Reversement Mobile Money (Bénin)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-700 uppercase">Numéro MTN Mobile Money</label>
                  <input
                    type="text"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-700 uppercase">Numéro Moov Money</label>
                  <input
                    type="text"
                    value={moovNumber}
                    onChange={(e) => setMoovNumber(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Sécurité */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Lock className="w-4 h-4 text-[#16a34a]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Sécurité & Mot de Passe</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Ancien Mot de Passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Nouveau Mot de Passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#16a34a] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-95"
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
