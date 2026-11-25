import { PurchaseOrderCard } from "@/components/ghost/purchase-order-card"

export default function PurchaseOrderCardDemo() {
  return (
    <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
      <PurchaseOrderCard
        po="PO-2026-0192"
        vendor="Bosch Auto Parts, Pune"
        items={14}
        amount="₹38,920"
        due="22/11/2026"
      />
      <PurchaseOrderCard
        po="PO-2026-0187"
        vendor="Minda Industries, Gurugram"
        items={6}
        amount="₹1,12,640"
        status="Received"
        tone="success"
        due="15/11/2026"
      />
    </div>
  )
}
