import { InvoiceSummary } from "@/components/ghost/invoice-summary"

export default function InvoiceSummaryDemo() {
  return (
    <InvoiceSummary
      className="max-w-sm"
      title="Invoice INV-2026-0418 · MH 12 AB 1234"
      lines={[
        { label: "Parts", amount: 6420 },
        { label: "Labour", amount: 2800 },
        { label: "Consumables", amount: 350 },
      ]}
      discount={500}
    />
  )
}
