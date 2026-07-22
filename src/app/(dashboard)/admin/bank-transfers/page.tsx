"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Clock, Landmark, Coins, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminBankTransfersPage() {
  const utils = trpc.useUtils();
  const { data: transfers, isLoading } = trpc.admin.getBankTransfers.useQuery();
  const confirmMutation = trpc.admin.confirmBankTransfer.useMutation({
    onSuccess: () => { utils.admin.getBankTransfers.invalidate(); },
  });
  const rejectMutation = trpc.admin.rejectBankTransfer.useMutation({
    onSuccess: () => { utils.admin.getBankTransfers.invalidate(); },
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [coinsToGrant, setCoinsToGrant] = useState(0);
  const [rejectNote, setRejectNote] = useState("");

  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
    </div>
  );

  const statusConfig: Record<string, { icon: any; color: string }> = {
    pending: { icon: <Clock className="h-4 w-4 text-warning" />, color: "bg-warning/10 text-warning" },
    confirmed: { icon: <CheckCircle2 className="h-4 w-4 text-success" />, color: "bg-success/10 text-success" },
    rejected: { icon: <XCircle className="h-4 w-4 text-error" />, color: "bg-error/10 text-error" },
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-white">Bank Transfers</h1>
          <p className="mt-1 text-sm text-neutral-500">Manage and confirm bank transfer payments</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-xl bg-warning/10 px-3 py-2 text-sm text-warning">
          <Clock className="h-4 w-4" />
          <span className="font-medium">{transfers?.filter(t => t.status === "pending").length || 0} pending</span>
        </div>
      </div>

      {(!transfers || transfers.length === 0) ? (
        <div className="glass rounded-2xl p-8 text-center">
          <Landmark className="mx-auto h-10 w-10 text-neutral-400" />
          <p className="mt-2 text-sm text-neutral-500">No bank transfer requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transfers.map((t) => (
            <div key={t.id} className="glass rounded-2xl p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{t.user}</h3>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",                       statusConfig[t.status || "pending"]?.color || "")}>
                      {statusConfig[t.status || "pending"]?.icon}{t.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><Coins className="h-3 w-3" /> {t.coinsRequested} coins</span>
                    <span>Amount: ₦{t.amount}</span>
                    <span>Sender: {t.senderName}</span>
                    <span>Date: {t.createdAt}</span>
                    {t.confirmedAt && <span>Confirmed: {t.confirmedAt}</span>}
                  </div>
                  {t.adminNote && (
                    <div className="mt-2 text-xs text-neutral-400">Note: {t.adminNote}</div>
                  )}
                </div>

                {t.status === "pending" && (
                  <div className="flex shrink-0 flex-col gap-2">
                    {selectedId === t.id ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input type="number" min={1} value={coinsToGrant}
                            onChange={(e) => setCoinsToGrant(Number(e.target.value))}
                            className="w-20 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                          <span className="text-xs text-neutral-500">coins</span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="default" className="min-h-[44px]"
                            onClick={() => { confirmMutation.mutate({ transferId: t.id, coinsGranted: coinsToGrant || t.coinsRequested }); setSelectedId(null); }}
                            disabled={confirmMutation.isPending}>
                            {confirmMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                            Confirm
                          </Button>
                          <Button size="sm" variant="outline" className="min-h-[44px] text-error"
                            onClick={async () => {
                              await rejectMutation.mutateAsync({ transferId: t.id, note: rejectNote || "Rejected by admin" });
                              setSelectedId(null);
                            }}
                            disabled={rejectMutation.isPending}>
                            <XCircle className="h-3 w-3" /> Reject
                          </Button>
                        </div>
                        <input type="text" placeholder="Admin note..."
                          value={rejectNote} onChange={(e) => setRejectNote(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" />
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" className="min-h-[44px]" onClick={() => { setSelectedId(t.id); setCoinsToGrant(t.coinsRequested); setRejectNote(""); }}>
                        <Search className="mr-1 h-3 w-3" /> Review
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
