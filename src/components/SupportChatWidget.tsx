"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  MessageCircle,
  X,
  Send,
  Headphones,
  ExternalLink,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Clock,
  ChevronDown,
  UserCheck,
  Bot,
  User,
  ShieldCheck,
} from "lucide-react";

interface Message {
  id: string;
  sender: "agent" | "user" | "system" | "human_agent";
  agentName?: string;
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "m-1",
    sender: "agent",
    text: "Bonjour ! 👋 Bienvenue sur le support officiel ENO LIVRAISON. Je suis l'assistant virtuel. Comment puis-je vous aider ?",
    time: "À l'instant",
  },
];

const SUGGESTED_QUESTIONS = [
  "👩‍💼 Parler à un agent ENO livraison en direct",
  "📦 Comment suivre mes livraisons ?",
  "💸 Quand mon retrait est-il validé ?",
  "🚚 Programmer un ramassage de stock",
];

const HUMAN_AGENT = {
  name: "Inès TOVIHOUDJI",
  role: "Responsable Support & Exploitation ENO",
  avatar: "👩‍💼",
  phone: "+229 01 64 29 18 84",
};

export default function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMode, setChatMode] = useState<"BOT" | "CONNECTING_HUMAN" | "HUMAN_AGENT">("BOT");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping, chatMode]);

  const connectToHumanAgent = () => {
    setChatMode("CONNECTING_HUMAN");
    setIsTyping(true);

    const systemMsg: Message = {
      id: `sys-${Date.now()}`,
      sender: "system",
      text: "🔔 Connexion en cours avec un agent humain du support ENO...",
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, systemMsg]);

    setTimeout(() => {
      setChatMode("HUMAN_AGENT");
      setIsTyping(false);

      const humanWelcomeMsg: Message = {
        id: `human-${Date.now()}`,
        sender: "human_agent",
        agentName: HUMAN_AGENT.name,
        text: `Bonjour ! Je suis Inès, responsable support chez ENO LIVRAISON. 👋 J'ai repris la main sur la discussion. En quoi puis-je vous aider personnellement ?`,
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, humanWelcomeMsg]);
    }, 1500);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    const lower = text.toLowerCase();

    // Trigger human connection if requested
    if (
      chatMode === "BOT" &&
      (lower.includes("agent") ||
        lower.includes("humain") ||
        lower.includes("conseiller") ||
        lower.includes("quelqu'un") ||
        lower.includes("parler"))
    ) {
      setTimeout(() => {
        setIsTyping(false);
        connectToHumanAgent();
      }, 500);
      return;
    }

    // Response when already talking to Human Agent Inès
    if (chatMode === "HUMAN_AGENT") {
      setTimeout(() => {
        let agentReplyText = `J'ai bien noté votre demande. Je vérifie cela immédiatement sur notre terminal d'exploitation et je reviens vers vous.`;
        if (lower.includes("retrait") || lower.includes("argent") || lower.includes("solde")) {
          agentReplyText = `Je viens de notifier notre direction financière pour accélérer la validation de votre virement. Vous recevrez la confirmation d'ici quelques minutes.`;
        } else if (lower.includes("colis") || lower.includes("livraison") || lower.includes("adresse")) {
          agentReplyText = `Je viens d'appeler le livreur affecté à votre secteur. Il vous contactera d'ici 15 minutes pour finaliser la remise du colis au client.`;
        } else if (lower.includes("merci") || lower.includes("ok") || lower.includes("d'accord")) {
          agentReplyText = `Avec grand plaisir ! L'équipe ENO LIVRAISON reste à votre entière disposition pour faire grandir vos ventes.`;
        }

        const agentMsg: Message = {
          id: `human-${Date.now()}`,
          sender: "human_agent",
          agentName: HUMAN_AGENT.name,
          text: agentReplyText,
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, agentMsg]);
        setIsTyping(false);
      }, 1200);
      return;
    }

    // Default Bot Smart Automated Responses
    setTimeout(() => {
      let replyText = "Merci pour votre message ! Un conseiller ENO LIVRAISON prend en charge votre demande. Pour parler directement à un humain, cliquez sur 'Parler à un agent'.";

      if (lower.includes("retrait") || lower.includes("argent") || lower.includes("solde") || lower.includes("finances") || lower.includes("usdt")) {
        replyText = "💸 Les demandes de retrait Mobile Money (MTN, Moov, Wave) et Crypto (USDT, Binance Pay) sont validées par la direction d'ENO en quelques minutes ouvrées.";
      } else if (lower.includes("colis") || lower.includes("livraison") || lower.includes("suivre") || lower.includes("commande")) {
        replyText = "📦 Vos commandes sont confirmées par téléphone par nos closeuses puis attribuées en direct à nos coursiers de zone (Cotonou, Calavi, Porto-Novo).";
      } else if (lower.includes("ramassage") || lower.includes("stock") || lower.includes("entrepôt")) {
        replyText = "🚚 Nos coursiers effectuent les ramassages de stocks directement à votre boutique. Vos articles sont stockés en toute sécurité dans nos entrepôts.";
      }

      const botReply: Message = {
        id: `reply-${Date.now()}`,
        sender: "agent",
        text: replyText,
        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* 🟢 FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-[#0D5940] hover:bg-[#093D2C] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-[0_8px_25px_rgba(13,89,64,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/20 cursor-pointer"
          aria-label="Ouvrir le chat support"
        >
          {/* Pulsing ring */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </span>

          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white shrink-0 border border-white/30">
            <Image
              src="/images/eno_livraison_logo.png"
              alt="Logo ENO"
              fill
              className="object-contain p-0.5"
            />
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-xs font-black tracking-tight leading-none">Support ENO</p>
            <p className="text-[10px] text-emerald-200 font-semibold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {chatMode === "HUMAN_AGENT" ? "Agent Humain En Ligne" : "Support Actif (< 5 min)"}
            </p>
          </div>

          {unreadCount > 0 && (
            <span className="sm:hidden absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* 💬 CHAT BOX WINDOW */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[540px] max-h-[85vh] bg-[#FAF9F5] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-[#EAE6DD] flex flex-col overflow-hidden animate-fade-in-up">
          {/* 1. Header (Charte ENO Vert Profond) */}
          <div className="bg-[#0D5940] text-white p-4 flex items-center justify-between border-b border-[#093D2C] shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {chatMode === "HUMAN_AGENT" ? (
                <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center text-xl shrink-0 shadow-xs">
                  {HUMAN_AGENT.avatar}
                </div>
              ) : (
                <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-white shrink-0 border-2 border-emerald-400/40 shadow-xs">
                  <Image
                    src="/images/eno_livraison_logo.png"
                    alt="ENO Support"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white truncate">
                    {chatMode === "HUMAN_AGENT" ? HUMAN_AGENT.name : "Support ENO LIVRAISON"}
                  </h3>
                  {chatMode === "HUMAN_AGENT" && (
                    <span className="text-[9px] bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 font-bold px-1.5 py-0.2 rounded">
                      Humain
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-200 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="truncate">
                    {chatMode === "HUMAN_AGENT"
                      ? HUMAN_AGENT.role
                      : "Assistant & Opérateurs en Ligne"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={`https://wa.me/2290197362906?text=Bonjour%20ENO%20LIVRAISON%2C%20j%27ai%20besoin%20d%27une%20assistance%20concernant%20mon%20compte%20marchand.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/10 hover:bg-[#25D366] text-white transition-colors"
                title="Ouvrir sur WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Fermer le chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2. Mode Switch Banner if talking to Bot */}
          {chatMode === "BOT" && (
            <div className="bg-[#093D2C] px-3.5 py-2 flex items-center justify-between text-[11px] text-emerald-200 border-b border-emerald-900/50">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mode Assistant Virtuel</span>
              </span>
              <button
                onClick={connectToHumanAgent}
                className="text-white font-bold bg-emerald-700/60 hover:bg-emerald-600 px-2 py-0.5 rounded-md text-[10px] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Parler à un agent ENO en direct</span>
                <span>👩‍💼</span>
              </button>
            </div>
          )}

          {/* 3. Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-[#FAF9F5]">
            {/* Disclaimer badge */}
            <div className="text-center my-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAE6DD]/70 text-[#787163] text-[10px] font-semibold">
                <Clock className="w-3 h-3" />
                Service Client Ouvert • 7j/7 de 08h à 20h
              </span>
            </div>

            {messages.map((m) => {
              if (m.sender === "system") {
                return (
                  <div key={m.id} className="text-center my-2">
                    <span className="inline-block px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 font-bold text-[10px] animate-pulse">
                      {m.text}
                    </span>
                  </div>
                );
              }

              const isUser = m.sender === "user";
              const isHuman = m.sender === "human_agent";

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  {isHuman && (
                    <span className="text-[10px] font-bold text-[#0D5940] mb-0.5 px-1 flex items-center gap-1">
                      <span>{HUMAN_AGENT.avatar}</span>
                      <span>{m.agentName || HUMAN_AGENT.name} (Support ENO)</span>
                    </span>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      isUser
                        ? "bg-[#0D5940] text-white rounded-br-xs shadow-xs"
                        : isHuman
                        ? "bg-white border-2 border-emerald-500/40 text-[#141A17] rounded-bl-xs shadow-xs"
                        : "bg-white border border-[#EAE6DD] text-[#141A17] rounded-bl-xs shadow-2xs"
                    }`}
                  >
                    <p className="text-xs">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-[#787163] mt-1 px-1">{m.time}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-[#EAE6DD] text-[#787163] w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 4. Suggestions chips */}
          <div className="px-3 py-2 bg-[#F3EFE6]/60 border-t border-[#EAE6DD] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-white border border-[#EAE6DD] hover:border-[#0D5940] text-[11px] font-bold text-[#5C5649] hover:text-[#0D5940] transition-colors shrink-0 shadow-2xs cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* 5. WhatsApp Direct Action Bar */}
          <a
            href="https://wa.me/2290197362906?text=Bonjour%20ENO%20LIVRAISON%2C%20j%27ai%20besoin%20d%27aide%20imm%C3%A9diate."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 border-t border-b border-[#25D366]/20 flex items-center justify-between text-[#128C7E] transition-colors shrink-0"
          >
            <div className="flex items-center gap-2 text-xs font-black">
              <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Besoin d&apos;une réponse WhatsApp ?</span>
            </div>
            <span className="text-[10px] uppercase font-black bg-[#25D366] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              WhatsApp <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </a>

          {/* 6. Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#EAE6DD] flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                chatMode === "HUMAN_AGENT"
                  ? `Message direct pour ${HUMAN_AGENT.name}...`
                  : "Écrivez votre message..."
              }
              className="flex-1 px-3.5 py-2.5 bg-[#FAF9F5] border border-[#EAE6DD] rounded-xl text-xs font-bold text-[#141A17] focus:outline-none focus:border-[#0D5940] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-[#0D5940] hover:bg-[#093D2C] disabled:opacity-40 disabled:hover:bg-[#0D5940] text-white transition-all shadow-xs shrink-0 cursor-pointer"
              aria-label="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
