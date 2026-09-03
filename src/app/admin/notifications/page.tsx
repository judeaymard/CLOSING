"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  BadgeDollarSign,
  MessageSquare,
  CheckCircle2,
  Package,
  Bike,
  ArrowRight,
} from "lucide-react";
import { useOperations } from "@/lib/store";
import { formatCFA } from "@/lib/mock-data";

export default function AdminNotificationsPage() {
  const { payoutRequests, conversations, alerts } = useOperations();

  const pendingPayouts = payoutRequests.filter((p) => p.status === "PENDING");
  const urgentConversations = conversations.filter((c) => c.status === "URGENT" || c.unreadCount > 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Centre des Notifications & Alertes</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique des alertes opérationnelles, demandes d&apos;arbitrage et signaux critiques.
          </p>
        </div>
      </div>

      {/* Notifications Stream */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-base font-black text-slate-900">Alertes en Attente</h3>

        <div className="space-y-3">
          {pendingPayouts.map((p) => (
            <Link
              key={p.id}
              href="/admin/finances"
              className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3 hover:bg-amber-100/70 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <BadgeDollarSign className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    Demande de reversement de {formatCFA(p.amount)} par {p.partnerName}
                  </p>
                  <p className="text-[11px] text-amber-700">Opérateur : {p.operator} • En attente d&apos;arbitrage PDG</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </Link>
          ))}

          {urgentConversations.map((c) => (
            <Link
              key={c.id}
              href="/admin/conversations"
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-slate-700 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Message prioritaire reçu de {c.companyName}
                  </p>
                  <p className="text-[11px] text-slate-500">{c.lastMessage}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}

          {alerts.map((a) => (
            <Link
              key={a.id}
              href={a.actionHref}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors block"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{a.title}</p>
                  <p className="text-[11px] text-slate-500">{a.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
