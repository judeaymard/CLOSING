"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Users,
  Send,
  Lock,
  Headset,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Package,
  Wallet,
  Phone,
  Store,
  Sparkles,
  UserCheck,
  Shield,
  ArrowRight,
  Tag,
  Paperclip,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";

export default function CommunicationHubPage() {
  const {
    conversations,
    orders,
    partners,
    closeuses,
    sendConversationMessage,
    assignConversation,
  } = useOperations();

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || "");
  const [filterTab, setFilterTab] = useState<"ALL" | "URGENT" | "WAITING" | "RESOLVED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];
  const activePartner = partners.find((p) => p.id === activeConversation?.partnerId) || partners[0];
  const partnerOrders = orders.filter((o) => o.partnerId === activePartner?.id || o.partnerName === activeConversation?.companyName);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (filterTab === "URGENT" && c.status !== "URGENT" && c.priority !== "HIGH") return false;
    if (filterTab === "WAITING" && c.status !== "WAITING") return false;
    if (filterTab === "RESOLVED" && c.status !== "RESOLVED") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.partnerName.toLowerCase().includes(q) ||
        c.companyName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;
    sendConversationMessage(activeConversation.id, messageInput.trim(), isInternalNote);
    setMessageInput("");
  };

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col font-sans max-w-7xl mx-auto space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Communication Hub</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold">
              {conversations.length} fils actifs
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Messagerie unifiée marchands, support automatisé et télévente
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-center">
          {(
            [
              { id: "ALL", label: "Toutes" },
              { id: "URGENT", label: "Urgentes" },
              { id: "WAITING", label: "En Attente" },
              { id: "RESOLVED", label: "Résolues" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterTab(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterTab === t.id
                  ? "bg-slate-900 text-white shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-Column Communication Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-0 bg-white rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* 1. Left List of Conversations (4 Cols) */}
        <div className="lg:col-span-4 border-r border-slate-200/80 flex flex-col min-h-0">
          {/* Search Box */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une boutique..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          {/* Conversation List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((c) => {
              const isSelected = c.id === activeConversation?.id;
              const isUrgent = c.status === "URGENT" || c.priority === "HIGH";

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                    isSelected ? "bg-slate-100/80 border-l-4 border-l-slate-900" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                    {c.companyName.charAt(0)}
                    {c.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{c.companyName}</h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">{c.lastMessageAt}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mb-1.5">{c.lastMessage}</p>

                    <div className="flex items-center gap-1.5">
                      {isUrgent && (
                        <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 text-[9px] font-bold">
                          Urgent
                        </span>
                      )}
                      {c.assignedAgentName && (
                        <span className="px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[9px] font-medium truncate">
                          {c.assignedAgentName}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Middle Chat Thread (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col min-h-0 bg-slate-50/40">
          {/* Thread Header */}
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-slate-200/80 bg-white flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeConversation.companyName}</h3>
                  <p className="text-[11px] text-slate-400">
                    Contact : {activeConversation.partnerName} • {activeConversation.phone}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {activeConversation.assignedAgentName ? `Agent : ${activeConversation.assignedAgentName}` : "Non assigné"}
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {activeConversation.messages.map((m) => {
                  const isPartner = m.sender === "PARTNER";
                  const isBot = m.sender === "BOT";
                  const isInternal = m.isInternalNote;

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isPartner ? "items-start" : "items-end"}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-1 px-1">
                        {m.senderName} • {m.sentAt}
                      </span>
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          isInternal
                            ? "bg-amber-50 border-2 border-amber-200 text-amber-900 rounded-br-xs font-medium"
                            : isPartner
                            ? "bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs"
                            : isBot
                            ? "bg-slate-100 border border-slate-200 text-slate-800 rounded-br-xs"
                            : "bg-slate-900 text-white rounded-br-xs shadow-xs"
                        }`}
                      >
                        {isInternal && (
                          <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-amber-700 mb-1">
                            <Lock className="w-3 h-3" />
                            <span>Note Interne Direction</span>
                          </div>
                        )}
                        <p>{m.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(false)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md cursor-pointer ${
                        !isInternalNote ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Réponse Marchand
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(true)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer ${
                        isInternalNote ? "bg-amber-100 text-amber-800" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Note Interne</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      isInternalNote
                        ? "Rédiger une note confidentielle pour l'équipe..."
                        : `Répondre à ${activeConversation.companyName}...`
                    }
                    className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isInternalNote
                        ? "bg-amber-50/50 border-amber-300 text-amber-900 placeholder:text-amber-400"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-800 focus:bg-white"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className={`p-2.5 rounded-xl text-white font-bold transition-all disabled:opacity-40 cursor-pointer ${
                      isInternalNote ? "bg-amber-600 hover:bg-amber-500" : "bg-slate-900 hover:bg-slate-800"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
              Sélectionnez une conversation pour afficher le fil.
            </div>
          )}
        </div>

        {/* 3. Right Contextual Panel (3 Cols) — Fiche Marchand Intelligente */}
        <div className="lg:col-span-3 border-l border-slate-200/80 p-5 overflow-y-auto space-y-6 bg-white">
          {activeConversation && activePartner ? (
            <>
              {/* Partner Card */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Fiche E-commerçant
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    {activeConversation.companyName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {activeConversation.companyName}
                    </h4>
                    <p className="text-[11px] text-slate-400">{activeConversation.partnerName}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      Partenaire Certifié
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-1">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeConversation.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activePartner.city || "Cotonou"}</span>
                  </p>
                </div>
              </div>

              {/* Assignment Control */}
              <div className="space-y-2 pb-4 border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Attribuer la Conversation
                </span>
                <div className="space-y-1">
                  {closeuses.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => assignConversation(activeConversation.id, cls.name, "Closeuse")}
                      className={`w-full p-2 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        activeConversation.assignedAgentName === cls.name
                          ? "bg-slate-100 text-slate-900 font-bold"
                          : "hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Headset className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cls.name}</span>
                      </div>
                      {activeConversation.assignedAgentName === cls.name && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Orders linked */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Dernières Commandes ({partnerOrders.length})
                  </span>
                  <Link href="/admin/commandes" className="text-[10px] font-bold text-slate-900 hover:underline">
                    Voir tout
                  </Link>
                </div>

                <div className="space-y-2">
                  {partnerOrders.slice(0, 3).map((ord) => (
                    <div key={ord.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-900">
                        <span>{ord.orderNumber}</span>
                        <span className="text-emerald-600">{formatCFA(ord.totalPrice)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{ord.clientName} • {ord.city}</p>
                      <span className="inline-block px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-800 text-[9px] font-bold uppercase">
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
