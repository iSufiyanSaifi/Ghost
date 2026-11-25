import { StatusBadge } from "@/components/ghost/status-badge"

export default function StatusBadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge tone="success">Approved</StatusBadge>
      <StatusBadge tone="pending">Awaiting approval</StatusBadge>
      <StatusBadge tone="info">In workshop</StatusBadge>
      <StatusBadge tone="warning">Quality check</StatusBadge>
      <StatusBadge tone="error">Rejected</StatusBadge>
      <StatusBadge tone="neutral">Expired</StatusBadge>
    </div>
  )
}
