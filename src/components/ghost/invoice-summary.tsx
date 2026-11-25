import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export interface InvoiceSummaryLine {
  label: string
  /** Pre-tax amount in rupees. */
  amount: number
}

export interface InvoiceSummaryProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  lines: InvoiceSummaryLine[]
  /** Flat discount in rupees, applied before GST. */
  discount?: number
  /** Total GST rate in percent, split equally into CGST and SGST. @default 18 */
  gstRate?: number
  /** @default "Invoice summary" */
  title?: React.ReactNode
}

const inr = (n: number) =>
  "₹" +
  n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function Row({
  label,
  value,
  total = false,
}: {
  label: React.ReactNode
  value: string
  total?: boolean
}) {
  return (
    <div
      className={cn(
        "flex justify-between gap-4 tabular-nums",
        total ? "text-base font-semibold text-foreground" : "text-sm text-muted-foreground"
      )}
    >
      <dt>{label}</dt>
      <dd className={cn(!total && "text-foreground")}>{value}</dd>
    </div>
  )
}

/**
 * Invoice totals block with CGST/SGST split (Figma "Invoice Summary", "CVG Text Invoice",
 * "Sum"). Computes subtotal, discount, intra-state GST halves and grand total in ₹.
 */
export function InvoiceSummary({
  lines,
  discount = 0,
  gstRate = 18,
  title = "Invoice summary",
  className,
  ...props
}: InvoiceSummaryProps) {
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0)
  const taxable = subtotal - discount
  const gst = (taxable * gstRate) / 100
  const half = gstRate / 2

  return (
    <Card data-slot="invoice-summary" className={cn("gap-3", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-[15px] font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-2.5">
          {lines.map((line, i) => (
            <Row key={`${line.label}-${i}`} label={line.label} value={inr(line.amount)} />
          ))}
          <Separator className="bg-divider" />
          <Row label="Subtotal" value={inr(subtotal)} />
          {discount > 0 && <Row label="Discount" value={"− " + inr(discount)} />}
          <Row label={`CGST ${half}%`} value={inr(gst / 2)} />
          <Row label={`SGST ${half}%`} value={inr(gst / 2)} />
          <Separator className="bg-divider" />
          <Row label="Total" value={inr(taxable + gst)} total />
        </dl>
      </CardContent>
    </Card>
  )
}
