"use client";

import React, { useState, useMemo } from "react";
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
  X,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Bot,
  Zap,
  RotateCcw,
  Check,
  SlidersHorizontal,
  Mail,
  UserPlus,
  Layers,
  Flame,
  Clock4,
  Eye,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";
import {
  Conversation,
  ChatMessage,
  ConversationStatus,
  ConversationPriority,
} from "@/lib/types";

export default function CommunicationHubPage() {
  const {
    conversations,
    orders,
    partners,
    closeuses,
    treasuryManagers,
    sendConversationMessage,
    assignConversation,
    transferConversation,
    takeoverConversation,
    resolveConversation,
    reopenConversation,
    escalateConversation,
    smartAutoAssignConversation,
  } = useOperations();

  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || "conv-1");
  const [filterQuick, setFilterQuick] = useState<"ALL" | "UNREAD" | "WAITING" | "URGENT" | "UNANSWERED" | "MY_CONVS">("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterAgent, setFilterAgent] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Composer states
  const [messageInput, setMessageInput] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: "IMAGE" | "PDF" | "DOC";
    size: string;
  } | null>(null);

  // Mobile active tab: 'LIST' | 'CHAT' | 'DETAILS'
  const [mobileView, setMobileView] = useState<"LIST" | "CHAT" | "DETAILS">("LIST");

  // Transfer modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTargetAgent, setTransferTargetAgent] = useState<string>("Jude S. (PDG)");
  const [transferTargetRole, setTransferTargetRole] = useState<string>("Direction Générale");
  const [transferReasonInput, setTransferReasonInput] = useState("");

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConvId) || conversations[0];
  }, [conversations, activeConvId]);

  const activePartner = useMemo(() => {
    return partners.find((p) => p.id === activeConversation?.partnerId) || partners[0];
  }, [partners, activeConversation]);

  const partnerOrders = useMemo(() => {
    return orders.filter(
      (o) => o.partnerId === activePartner?.id || o.partnerName === activeConversation?.companyName
    );
  }, [orders, activePartner, activeConversation]);

  // Global KPIs Calculation
  const openCount = useMemo(() => {
    return conversations.filter((c) => c.status !== "RESOLVED").length;
  }, [conversations]);

  const unreadCount = useMemo(() => {
    return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [conversations]);

  const urgentCount = useMemo(() => {
    return conversations.filter((c) => c.status === "URGENT" || c.priority === "URGENT" || c.priority === "HIGH").length;
  }, [conversations]);

  const waitingCount = useMemo(() => {
    return conversations.filter((c) => c.status === "WAITING").length;
  }, [conversations]);

  const unansweredCount = useMemo(() => {
    return conversations.filter((c) => c.unreadCount > 0 || c.status === "WAITING").length;
  }, [conversations]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // 1. Quick Filters
      if (filterQuick === "UNREAD" && (!c.unreadCount || c.unreadCount === 0)) return false;
      if (filterQuick === "WAITING" && c.status !== "WAITING") return false;
      if (filterQuick === "URGENT" && c.status !== "URGENT" && c.priority !== "URGENT" && c.priority !== "HIGH") return false;
      if (filterQuick === "UNANSWERED" && c.unreadCount === 0 && c.status !== "WAITING") return false;
      if (filterQuick === "MY_CONVS" && c.assignedAgentName !== "Jude S. (PDG)" && c.assignedAgentName !== "Jude (PDG)") return false;

      // 2. Dropdown Filters
      if (filterStatus !== "ALL" && c.status !== filterStatus) return false;
      if (filterPriority !== "ALL" && c.priority !== filterPriority) return false;
      if (filterAgent !== "ALL" && c.assignedAgentName !== filterAgent) return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          c.partnerName.toLowerCase().includes(q) ||
          c.companyName.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.relatedOrderNumber && c.relatedOrderNumber.toLowerCase().includes(q));

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [conversations, filterQuick, filterStatus, filterPriority, filterAgent, searchQuery]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && !attachedFile) || !activeConversation) return;

    sendConversationMessage(
      activeConversation.id,
      messageInput.trim() || (attachedFile ? `Pièce jointe : ${attachedFile.name}` : ""),
      isInternalNote,
      attachedFile || undefined
    );

    setMessageInput("");
    setAttachedFile(null);
  };

  // Handle transfer
  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !transferReasonInput.trim()) return;

    transferConversation(
      activeConversation.id,
      transferTargetAgent,
      transferTargetRole,
      transferReasonInput.trim()
    );

    setShowTransferModal(false);
    setTransferReasonInput("");
  };

  // Helper for simulated attachment
  const handleAttachDemoFile = (type: "IMAGE" | "PDF" | "DOC") => {
    if (type === "PDF") {
      setAttachedFile({
        name: `Bordereau_Livraison_${Date.now().toString().slice(-4)}.pdf`,
        type: "PDF",
        size: "340 KB",
      });
    } else if (type === "IMAGE") {
      setAttachedFile({
        name: `Preuve_Paiement_${Date.now().toString().slice(-4)}.jpg`,
        type: "IMAGE",
        size: "1.2 MB",
      });
    }
  };

  // Helper status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "URGENT":
      case "ESCALATED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            🔴 Escaladée / Urgent
          </span>
        );
      case "WAITING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            🟡 En attente
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            🔵 En cours
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            ⚫ Résolue
          </span>
        );
      case "OPEN":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            🟢 Ouverte
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 font-sans max-w-[1600px] mx-auto pb-16">
      {/* 1. TOP EXECUTIVE HEADER & KPIS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>ENO LIVRAISON</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-700">Centre de Communication &amp; Support CRM</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            <MessageSquare className="w-6 h-6 text-slate-900" />
            <span>Conversations &amp; Support Marchands</span>
          </h1>
          <p className="text-xs text-slate-500">
            Centralisez les échanges avec vos e-commerçants et gardez une visibilité complète sur le support de l&apos;agence.
          </p>
        </div>

        {/* 6 Executive Metric Badges */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 shrink-0">
          <div className="px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Ouvertes</span>
            <span className="text-sm font-black text-slate-900">{openCount}</span>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-blue-50 border border-blue-200/70 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase block">Non lues</span>
            <span className="text-sm font-black text-blue-700">{unreadCount}</span>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-rose-50 border border-rose-200/70 text-center">
            <span className="text-[10px] font-bold text-rose-600 uppercase block">Urgentes</span>
            <span className="text-sm font-black text-rose-700">{urgentCount}</span>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-amber-50 border border-amber-200/70 text-center">
            <span className="text-[10px] font-bold text-amber-600 uppercase block">En attente</span>
            <span className="text-sm font-black text-amber-700">{waitingCount}</span>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-purple-50 border border-purple-200/70 text-center">
            <span className="text-[10px] font-bold text-purple-600 uppercase block">Sans réponse</span>
            <span className="text-sm font-black text-purple-700">{unansweredCount}</span>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase block">Temps moyen</span>
            <span className="text-sm font-black text-emerald-700">8 min</span>
          </div>
        </div>
      </div>

      {/* Mobile Switcher (Visible on small screens) */}
      <div className="lg:hidden flex items-center justify-between bg-white p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => setMobileView("LIST")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileView === "LIST" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          Conversations ({filteredConversations.length})
        </button>
        <button
          onClick={() => setMobileView("CHAT")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileView === "CHAT" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          Fil Actif
        </button>
        <button
          onClick={() => setMobileView("DETAILS")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileView === "DETAILS" ? "bg-slate-900 text-white" : "text-slate-600"
          }`}
        >
          Fiche Marchand
        </button>
      </div>

      {/* 2. MAIN 3-PANEL SAAS CRM WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-[calc(100vh-250px)] min-h-[640px] bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* ======================================================== */}
        {/* 1. LEFT PANEL: CONVERSATIONS LIST (4 Columns)            */}
        {/* ======================================================== */}
        <div
          className={`lg:col-span-4 border-r border-slate-200/80 flex flex-col min-h-0 bg-white ${
            mobileView !== "LIST" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Search Box */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher boutique, contact, commande (#CMD)..."
                className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "ALL", label: "Toutes" },
                { id: "UNREAD", label: "Non lues" },
                { id: "WAITING", label: "À traiter" },
                { id: "URGENT", label: "🔥 Urgentes" },
                { id: "MY_CONVS", label: "Mes fils" },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setFilterQuick(pill.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    filterQuick === pill.id
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Dropdown Filters Row */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Tous statuts</option>
                <option value="OPEN">🟢 Ouverte</option>
                <option value="WAITING">🟡 En attente</option>
                <option value="IN_PROGRESS">🔵 En cours</option>
                <option value="ESCALATED">🔴 Escaladée</option>
                <option value="RESOLVED">⚫ Résolue</option>
              </select>

              <select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-[10px] font-semibold text-slate-700 focus:outline-none"
              >
                <option value="ALL">Tous les agents</option>
                <option value="Jude S. (PDG)">Jude S. (PDG)</option>
                {closeuses.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} (Closeuse)
                  </option>
                ))}
                {treasuryManagers.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} (Trésorier)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conversation Items Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((c) => {
              const isSelected = c.id === activeConversation?.id;
              const isUrgent = c.status === "URGENT" || c.priority === "URGENT" || c.priority === "HIGH";

              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveConvId(c.id);
                    setMobileView("CHAT");
                  }}
                  className={`w-full p-3.5 text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-slate-50/90 border-l-4 border-l-slate-900 shadow-2xs"
                      : "hover:bg-slate-50/50"
                  }`}
                >
                  {/* Avatar with unread indicator */}
                  <div className="relative w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                    {c.companyName.charAt(0)}
                    {c.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{c.companyName}</h4>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                        {c.lastMessageAt}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mb-1.5 font-normal">
                      {c.lastMessage}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {getStatusBadge(c.status)}

                      {c.assignedAgentName && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-semibold truncate flex items-center gap-1">
                          <UserCheck className="w-2.5 h-2.5 text-slate-500" />
                          <span>{c.assignedAgentName}</span>
                        </span>
                      )}

                      {c.relatedOrderNumber && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[9px] font-mono font-bold">
                          {c.relatedOrderNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs space-y-1">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-bold text-slate-600">Aucune conversation trouvée</p>
                <p className="text-[11px]">Modifiez vos filtres ou effectuez une autre recherche.</p>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MIDDLE PANEL: CHAT THREAD (5 Columns)                 */}
        {/* ======================================================== */}
        <div
          className={`lg:col-span-5 flex flex-col min-h-0 bg-slate-50/40 border-r border-slate-200/80 ${
            mobileView !== "CHAT" ? "hidden lg:flex" : "flex"
          }`}
        >
          {activeConversation ? (
            <>
              {/* Thread Top Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {activeConversation.companyName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {activeConversation.companyName}
                      </h3>
                      {getStatusBadge(activeConversation.status)}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      Contact : {activeConversation.partnerName} • {activeConversation.phone}
                    </p>
                  </div>
                </div>

                {/* Top Action Buttons (Takeover, Transfer, Resolve) */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => takeoverConversation(activeConversation.id)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1"
                    title="Prendre en charge immédiatement cette conversation"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Prendre (PDG)</span>
                  </button>

                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1"
                    title="Transférer à une closeuse ou au trésorier"
                  >
                    <UserPlus className="w-3 h-3 text-slate-500" />
                    <span>Transférer</span>
                  </button>

                  {activeConversation.status === "RESOLVED" ? (
                    <button
                      onClick={() => reopenConversation(activeConversation.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1"
                      title="Réouvrir la conversation"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Réouvrir</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => resolveConversation(activeConversation.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1"
                      title="Clôturer et marquer comme résolue"
                    >
                      <Check className="w-3 h-3" />
                      <span>Résoudre</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {activeConversation.messages.map((m) => {
                  const isPartner = m.sender === "PARTNER";
                  const isBot = m.sender === "BOT";
                  const isTreasury = m.sender === "TREASURY";
                  const isInternal = m.isInternalNote;

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${
                        isInternal
                          ? "items-center my-2"
                          : isPartner
                          ? "items-start"
                          : isBot
                          ? "items-center my-1"
                          : "items-end"
                      }`}
                    >
                      {!isInternal && !isBot && (
                        <span className="text-[10px] text-slate-400 mb-1 px-1 font-medium">
                          {m.senderName} • {m.sentAt}
                        </span>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          isInternal
                            ? "w-full bg-amber-50/90 border-2 border-amber-300 text-amber-950 font-medium shadow-xs"
                            : isPartner
                            ? "bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-2xs"
                            : isBot
                            ? "bg-slate-100 text-slate-600 rounded-xl text-center py-2 px-4 max-w-sm text-[11px]"
                            : isTreasury
                            ? "bg-emerald-900 text-emerald-50 rounded-br-xs shadow-xs"
                            : "bg-slate-900 text-white rounded-br-xs shadow-xs"
                        }`}
                      >
                        {isInternal && (
                          <div className="flex items-center justify-between border-b border-amber-200 pb-1.5 mb-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-900">
                              <Lock className="w-3 h-3 text-amber-700" />
                              <span>NOTE INTERNE DIRECTION (Invisible pour le marchand)</span>
                            </div>
                            <span className="text-[10px] text-amber-700 font-bold">{m.sentAt}</span>
                          </div>
                        )}

                        <p className="whitespace-pre-wrap">{m.text}</p>

                        {/* Attachments rendering */}
                        {m.attachmentName && (
                          <div
                            className={`mt-2.5 p-2.5 rounded-xl flex items-center gap-2.5 ${
                              isPartner || isInternal
                                ? "bg-slate-100/90 text-slate-800 border border-slate-200"
                                : "bg-white/10 text-white border border-white/20"
                            }`}
                          >
                            {m.attachmentType === "PDF" ? (
                              <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-blue-400 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[11px] truncate">{m.attachmentName}</p>
                              <p className="text-[9px] opacity-70">{m.attachmentSize || "Fichier joint"}</p>
                            </div>
                            <button
                              type="button"
                              className="px-2 py-0.5 rounded-md bg-black/10 hover:bg-black/20 text-[10px] font-bold cursor-pointer"
                            >
                              Ouvrir
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer Footer */}
              <form
                onSubmit={handleSendMessage}
                className={`p-3.5 bg-white border-t space-y-2.5 transition-colors ${
                  isInternalNote ? "border-amber-300 bg-amber-50/30" : "border-slate-200/80"
                }`}
              >
                {/* Switcher Mode: Réponse vs Note Interne */}
                <div className="flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(false)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        !isInternalNote
                          ? "bg-slate-900 text-white shadow-2xs"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      💬 Réponse au Marchand
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInternalNote(true)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                        isInternalNote
                          ? "bg-amber-500 text-slate-950 font-black shadow-2xs"
                          : "text-amber-700 hover:bg-amber-50"
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Note Interne</span>
                    </button>
                  </div>

                  {/* Attachment Triggers */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAttachDemoFile("PDF")}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      title="Joindre un document PDF"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttachDemoFile("IMAGE")}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      title="Joindre une photo ou capture"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Attached File Preview Tag */}
                {attachedFile && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-bold text-slate-900 text-[11px]">{attachedFile.name}</span>
                      <span className="text-[10px] text-slate-400">({attachedFile.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-0.5 rounded text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Input row */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      isInternalNote
                        ? "Rédiger une note confidentielle pour l'équipe (injoignable par le marchand)..."
                        : `Écrire à ${activeConversation.companyName}... (Appuyez sur Entrée)`
                    }
                    className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none transition-all ${
                      isInternalNote
                        ? "bg-amber-50/50 border-amber-300 text-amber-950 placeholder:text-amber-500 focus:ring-2 focus:ring-amber-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() && !attachedFile}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shadow-xs ${
                      isInternalNote
                        ? "bg-amber-600 hover:bg-amber-500 text-white"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <span>Envoyer</span>
                    <Send className="w-3.5 h-3.5" />
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

        {/* ======================================================== */}
        {/* 3. RIGHT PANEL: CONTEXTUAL CRM & LINKED RESOURCES (3 Cols)*/}
        {/* ======================================================== */}
        <div
          className={`lg:col-span-3 p-5 overflow-y-auto space-y-5 bg-white ${
            mobileView !== "DETAILS" ? "hidden lg:block" : "block"
          }`}
        >
          {activeConversation && activePartner ? (
            <>
              {/* 1. FICHE E-COMMERÇANT */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Fiche E-commerçant
                  </span>
                  <Link
                    href={`/admin/partenaires/${activePartner.id}`}
                    className="text-[11px] font-bold text-slate-900 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Voir profil</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    {activeConversation.companyName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {activeConversation.companyName}
                    </h4>
                    <p className="text-[11px] text-slate-500">{activeConversation.partnerName}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      Partenaire Actif
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeConversation.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activePartner.city || "Cotonou"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5 text-slate-400" />
                    <span>Solde disponible : <strong>{formatCFA(activePartner.availableBalance || 520000)}</strong></span>
                  </p>
                </div>
              </div>

              {/* 2. COMMANDES LIÉES */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Package className="w-3 h-3 text-slate-500" />
                    <span>Commandes Liées ({partnerOrders.length})</span>
                  </span>
                  <Link href="/admin/commandes" className="text-[10px] font-bold text-slate-900 hover:underline">
                    Tout voir
                  </Link>
                </div>

                <div className="space-y-2">
                  {partnerOrders.slice(0, 3).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-900">
                        <Link href={`/admin/commandes/${ord.id}`} className="hover:text-blue-600 underline">
                          {ord.orderNumber}
                        </Link>
                        <span className="text-emerald-600">{formatCFA(ord.totalPrice)}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate">{ord.clientName}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>Livreur : {ord.assignedLivreurName || "Non affecté"}</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 font-bold uppercase">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. ASSIGNATION & GESTION DES CAPACITÉS */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Headset className="w-3 h-3 text-slate-500" />
                    <span>Pôle Opérateurs &amp; Charge</span>
                  </span>
                  <button
                    onClick={() => smartAutoAssignConversation(activeConversation.id)}
                    className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    title="Attribuer automatiquement à la closeuse la plus disponible"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Smart Assign</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {/* PDG option */}
                  <button
                    onClick={() => assignConversation(activeConversation.id, "Jude S. (PDG)", "Direction Générale")}
                    className={`w-full p-2 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      activeConversation.assignedAgentName === "Jude S. (PDG)" ||
                      activeConversation.assignedAgentName === "Jude (PDG)"
                        ? "bg-slate-900 text-white font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Jude S. (PDG)</span>
                    </div>
                    <span className="text-[10px] opacity-80">Direction</span>
                  </button>

                  {/* Closeuses list with capacities */}
                  {closeuses.map((cls) => {
                    const isAssigned = activeConversation.assignedAgentName === cls.name;
                    return (
                      <button
                        key={cls.id}
                        onClick={() => assignConversation(activeConversation.id, cls.name, "Closeuse")}
                        className={`w-full p-2 rounded-xl text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          isAssigned
                            ? "bg-slate-100 text-slate-900 font-bold border border-slate-300"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Headset className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {cls.activeConversationsCount || 3} / {cls.maxActiveConversations || 5} fils
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. HISTORIQUE DU PARCOURS / AUDIT */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Clock4 className="w-3 h-3 text-slate-500" />
                  <span>Historique des Assignations</span>
                </span>

                <div className="space-y-2 pl-2 border-l border-slate-200 text-xs">
                  {activeConversation.assignmentHistory && activeConversation.assignmentHistory.length > 0 ? (
                    activeConversation.assignmentHistory.map((hist) => (
                      <div key={hist.id} className="space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                          <span>{hist.timestamp}</span>
                        </div>
                        <p className="font-bold text-slate-800 text-[11px]">
                          {hist.assignedToName} ({hist.assignedToRole})
                        </p>
                        {hist.reason && (
                          <p className="text-[10px] text-slate-500 italic">&quot;{hist.reason}&quot;</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-[11px] italic">Aucun transfert d&apos;agent pour le moment.</p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MODAL DE TRANSFERT D'AGENT AVEC JUSTIFICATION        */}
      {/* ======================================================== */}
      {showTransferModal && activeConversation && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-slate-900" />
                <h3 className="text-sm font-black text-slate-900">Transférer la Conversation</h3>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmTransfer} className="space-y-4">
              {/* Agent selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Sélectionner le nouvel agent</label>
                <select
                  value={transferTargetAgent}
                  onChange={(e) => {
                    const name = e.target.value;
                    setTransferTargetAgent(name);
                    if (name.includes("PDG")) setTransferTargetRole("Direction Générale");
                    else if (name.includes("AGOSSOU") || name.includes("MENSAH")) setTransferTargetRole("Responsable Trésorerie");
                    else setTransferTargetRole("Closeuse Senior");
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                >
                  <option value="Jude S. (PDG)">Jude S. (Direction Générale)</option>
                  {closeuses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} (Pôle Télévente / Closeuse)
                    </option>
                  ))}
                  {treasuryManagers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} (Pôle Trésorerie / Finance)
                    </option>
                  ))}
                </select>
              </div>

              {/* Transfer reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Motif obligatoire du transfert *</label>
                <input
                  type="text"
                  required
                  value={transferReasonInput}
                  onChange={(e) => setTransferReasonInput(e.target.value)}
                  placeholder="Ex: Question complexe de paiement / Demande d'arbitrage PDG..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md"
                >
                  Confirmer le transfert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
