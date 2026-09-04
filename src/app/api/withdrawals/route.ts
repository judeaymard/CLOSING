import { NextRequest, NextResponse } from "next/server";
import {
  getPayoutRequests,
  savePayoutRequest,
  updatePayoutRequest,
  getPlatformSettings,
  saveTransaction,
  saveGlobalAuditLog,
  saveNotification,
} from "@/lib/server-db";
import { validateWithdrawalRequest } from "@/lib/pricing-service";
import { getPaymentProvider } from "@/lib/payment-providers";
import { PayoutRequest, PayoutStatus, PayoutOperator, FinancialTransaction, GlobalAuditLog, PlatformNotification } from "@/lib/types";
import { partners as initialPartners } from "@/lib/mock-data";

/**
 * Endpoint API Central des Retraits E-commerçants
 * ENO Livraison 2027 (Section 36.7 - 36.23)
 */

export async function GET() {
  try {
    const payouts = await getPayoutRequests();
    return NextResponse.json({ success: true, payouts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la récupération des retraits." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      partnerId,
      partnerName,
      amount,
      operator,
      phone,
      countryCode = "+229",
      cryptoAddress,
      cryptoNetwork,
      binancePayId,
      binanceEmail,
      idempotencyKey,
      availableBalance = 5000000,
    } = body;

    const settings = await getPlatformSettings();
    const partner = {
      id: partnerId || "p-default",
      companyName: partnerName || "Boutique Partenaire",
      isActive: true,
      availableBalance: Number(availableBalance) || 5000000,
    };

    // 1. Validation stricte côté serveur avec la configuration active
    const validation = validateWithdrawalRequest(
      settings,
      partner,
      Number(amount),
      operator as PayoutOperator,
      { phone, cryptoAddress, cryptoNetwork, binancePayId, binanceEmail }
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(" | "), errors: validation.errors },
        { status: 400 }
      );
    }

    // 2. Contrôle d'Idempotence (éviter les doubles soumissions)
    const existingPayouts = await getPayoutRequests();
    const payoutId = idempotencyKey || `WDR-${Date.now().toString().slice(-6)}`;
    const duplicate = existingPayouts.find((p) => p.id === payoutId || p.txReference === idempotencyKey);
    if (duplicate) {
      return NextResponse.json({
        success: true,
        payout: duplicate,
        isDuplicate: true,
        message: "Demande de retrait déjà existante (Idempotence respectée).",
      });
    }

    // 3. Détermination du statut initial selon le mode de validation
    const initialStatus: PayoutStatus = validation.isAutoApproved ? "APPROVED" : "PENDING";
    const balanceBefore = partner.availableBalance;
    const balanceAfter = Math.max(0, balanceBefore - Number(amount));

    const newPayout: PayoutRequest = {
      id: payoutId,
      partnerId: partner.id,
      partnerName: partner.companyName,
      amount: Number(amount),
      reservedAmount: Number(amount), // Verrouillage transactionnel
      operator: operator as PayoutOperator,
      phone,
      countryCode,
      cryptoAddress,
      cryptoNetwork,
      cryptoEstimatedUsdt: cryptoAddress ? Math.round(Number(amount) / 655) : undefined,
      binancePayId,
      binanceEmail,
      requestedAt: new Date().toISOString(),
      status: initialStatus,
      balanceBefore,
      balanceAfter,
      txReference: `TX-REQ-${Date.now().toString().slice(-6)}`,
    };

    await savePayoutRequest(newPayout);

    // 4. Notification centralisée
    const notif: PlatformNotification = {
      id: `notif-wdr-${Date.now()}`,
      category: "FINANCES",
      priority: validation.requiresDoubleValidation ? "CRITICAL" : "INFO",
      title: "Nouvelle demande de retrait",
      description: `Demande de retrait de ${Number(amount).toLocaleString("fr-FR")} FCFA initiée par ${partner.companyName} (${operator}).`,
      createdAt: "À l'instant",
      isoDate: new Date().toISOString(),
      isRead: false,
      actionUrl: "/admin/retraits",
      referenceType: "WITHDRAWAL",
      referenceId: newPayout.id,
    };
    await saveNotification(notif);

    // 5. Audit centralisé
    const audit: GlobalAuditLog = {
      id: `aud-wdr-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      isoDate: new Date().toISOString(),
      actor: {
        id: partner.id,
        name: partner.companyName,
        role: "Marchand",
        type: "USER",
      },
      action: "WITHDRAWAL_CREATED",
      actionLabel: "Création de demande de retrait",
      module: "FINANCES",
      entityType: "PAYOUT",
      entityId: newPayout.id,
      entityReference: newPayout.id,
      severity: "INFO",
      result: "SUCCESS",
      description: `Demande de ${Number(amount).toLocaleString("fr-FR")} FCFA par ${operator}. Statut initial: ${initialStatus}.`,
      afterState: newPayout as any,
    };
    await saveGlobalAuditLog(audit);

    return NextResponse.json({
      success: true,
      payout: newPayout,
      validation,
    });
  } catch (error) {
    console.error("Erreur POST /api/withdrawals:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de la création du retrait." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { payoutId, action, paymentReference, rejectionReason, internalNote, adminName = "Direction ENO" } = body;

    const payouts = await getPayoutRequests();
    const payout = payouts.find((p) => p.id === payoutId);
    if (!payout) {
      return NextResponse.json({ success: false, error: "Retrait introuvable." }, { status: 404 });
    }

    const settings = await getPlatformSettings();
    let updatedPayout: PayoutRequest | null = null;

    if (action === "APPROVE") {
      updatedPayout = await updatePayoutRequest(payoutId, {
        status: "APPROVED",
        approvedAt: new Date().toISOString(),
        internalNote: internalNote || payout.internalNote,
      });

      await saveGlobalAuditLog({
        id: `aud-app-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        isoDate: new Date().toISOString(),
        actor: { id: "USR-PDG-001", name: adminName, role: "Super Admin", type: "USER" },
        action: "WITHDRAWAL_APPROVED",
        actionLabel: "Approbation de retrait",
        module: "FINANCES",
        entityType: "PAYOUT",
        entityId: payoutId,
        entityReference: payoutId,
        severity: "WARNING",
        result: "SUCCESS",
        description: `Demande de retrait de ${payout.amount} FCFA approuvée par la direction.`,
      });
    } else if (action === "PROCESS_PAYOUT" || action === "PAY") {
      // Exécution de l'adaptateur de paiement
      const provider = getPaymentProvider(payout.operator, settings);
      const execution = await provider.createPayout({
        payoutId: payout.id,
        amount: payout.amount,
        currency: "FCFA",
        recipient: {
          name: payout.partnerName,
          phone: payout.phone,
          countryCode: payout.countryCode,
          binancePayId: payout.binancePayId,
          binanceEmail: payout.binanceEmail,
          cryptoAddress: payout.cryptoAddress,
          cryptoNetwork: payout.cryptoNetwork,
        },
        idempotencyKey: payout.id,
      });

      const finalStatus: PayoutStatus = execution.status === "PAID" ? "PAID" : "PAID"; // Traité avec référence
      const ref = paymentReference || execution.providerReference || `REF-${Date.now().toString().slice(-6)}`;

      updatedPayout = await updatePayoutRequest(payoutId, {
        status: finalStatus,
        paidAt: new Date().toISOString(),
        paymentReference: ref,
        adminProcessorName: adminName,
        reservedAmount: 0,
        txReference: execution.providerReference,
      });

      // Écriture de la transaction financière
      const tx: FinancialTransaction = {
        id: `tx-${Date.now()}`,
        txReference: `TX-RET-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().replace("T", " ").slice(0, 16),
        type: "RETRAIT",
        label: `Retrait Marchand ${payout.partnerName} (${payout.operator})`,
        partnerId: payout.partnerId,
        partnerName: payout.partnerName,
        inflow: 0,
        outflow: payout.amount,
        balanceAfter: (payout.balanceAfter ?? 4820000),
        status: "COMPLETED",
        notes: `Règlement ${payout.operator}. Réf: ${ref}. ${execution.message}`,
      };
      await saveTransaction(tx);

      // Notification
      await saveNotification({
        id: `notif-paid-${Date.now()}`,
        category: "FINANCES",
        priority: "INFO",
        title: "🏦 Retrait effectué",
        description: `Votre retrait de ${payout.amount.toLocaleString("fr-FR")} FCFA (${payout.operator}) a été payé avec succès. Réf: ${ref}.`,
        createdAt: "À l'instant",
        isoDate: new Date().toISOString(),
        isRead: false,
        actionUrl: "/admin/retraits",
        referenceType: "WITHDRAWAL",
        referenceId: payoutId,
      });

      // Audit
      await saveGlobalAuditLog({
        id: `aud-paid-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        isoDate: new Date().toISOString(),
        actor: { id: "USR-PDG-001", name: adminName, role: "Super Admin", type: "USER" },
        action: "WITHDRAWAL_PAID",
        actionLabel: "Paiement de retrait effectué",
        module: "FINANCES",
        entityType: "PAYOUT",
        entityId: payoutId,
        entityReference: payoutId,
        severity: "INFO",
        result: "SUCCESS",
        description: `Virement de ${payout.amount.toLocaleString("fr-FR")} FCFA validé (${payout.operator}). Réf: ${ref}.`,
      });
    } else if (action === "REJECT") {
      // Restitution du solde réservé
      updatedPayout = await updatePayoutRequest(payoutId, {
        status: "REJECTED",
        reservedAmount: 0,
        rejectionReason: rejectionReason || "Demande rejetée par la direction.",
      });

      await saveNotification({
        id: `notif-rej-${Date.now()}`,
        category: "FINANCES",
        priority: "URGENT",
        title: "⚠️ Retrait rejeté",
        description: `Votre demande de retrait de ${payout.amount.toLocaleString("fr-FR")} FCFA a été rejetée. Motif: ${rejectionReason || "Non conforme"}. Les fonds ont été réintégrés à votre solde.`,
        createdAt: "À l'instant",
        isoDate: new Date().toISOString(),
        isRead: false,
        actionUrl: "/admin/retraits",
        referenceType: "WITHDRAWAL",
        referenceId: payoutId,
      });

      await saveGlobalAuditLog({
        id: `aud-rej-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        isoDate: new Date().toISOString(),
        actor: { id: "USR-PDG-001", name: adminName, role: "Super Admin", type: "USER" },
        action: "WITHDRAWAL_REJECTED",
        actionLabel: "Demande de retrait rejetée",
        module: "FINANCES",
        entityType: "PAYOUT",
        entityId: payoutId,
        entityReference: payoutId,
        severity: "WARNING",
        result: "SUCCESS",
        description: `Retrait rejeté : ${rejectionReason || "Motif administratif"}. Montant restitué au solde marchand.`,
      });
    }

    return NextResponse.json({ success: true, payout: updatedPayout });
  } catch (error) {
    console.error("Erreur PATCH /api/withdrawals:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur lors de la mise à jour du retrait." },
      { status: 500 }
    );
  }
}
