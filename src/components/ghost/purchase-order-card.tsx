import * as React from "react"
import { ClipboardList } from "lucide-react"

import { cn } from "@/lib/utils"
import { StatusBadge, type StatusTone } from "@/components/ghost/status-badge"

export type PurchaseOrderTone = StatusTone

export interface PurchaseOrderCardProps extends React.ComponentProps<"div"> {
  /** PO number, e.g. "PO-2026-0192". */
  po: string
  vendor: string
  /** Number of line items. */
  items: number
  /** Pre-formatted total, e.g. "₹38,920". */
  amount: string
  /** @default "Pending" */
  status?: string
  /** @default "pending" */
  tone?: PurchaseOrderTone
  /** Due date, DD/MM/YYYY. */
  due?: string
}

/**
 * Purchase order summary (Figma "Purchase Order Card"): PO number, status, vendor,
 * item count, due date and total.
 */
export function PurchaseOrderCard({
  po,
  vendor,
  items,
  amount,
  status = "Pending",
  tone = "pending",
  due,
  className,
  ...props
}: PurchaseOrderCardProps) {
  return (
    <div
      data-slot="purchase-order-card"
      className={cn(
        "flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <ClipboardList className="size-4 text-muted-foreground" aria-hidden />
        <span className="flex-1 font-mono text-sm font-semibold">{po}</span>
        <StatusBadge tone={tone}>{status}</StatusBadge>
      </div>
      <div className="text-sm font-medium">{vendor}</div>
      <div className="flex justify-between gap-4 text-[13px] text-muted-foreground tabular-nums">
        <span>
          {items.toLocaleString("en-IN")} {items === 1 ? "item" : "items"}
          {due && ` · Due ${due}`}
        </span>
        <span className="font-semibold text-foreground">{amount}</span>
      </div>
    </div>
  )
}
