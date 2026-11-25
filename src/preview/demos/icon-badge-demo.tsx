import { IconBadge } from "@/components/ui/icon-badge"
import { Text } from "@/components/ui/text"
import { CarIcon, CircleAlertIcon, CircleCheckIcon, ClockIcon, PackageIcon, ReceiptIndianRupeeIcon, WrenchIcon } from "lucide-react"

const rows = [
  { tone: "info", icon: CarIcon, title: "Vehicle checked in", meta: "MH 12 AB 1234 · Bay 3" },
  { tone: "pending", icon: ClockIcon, title: "Awaiting approval", meta: "Estimate sent to Sufiyan Jin" },
  { tone: "error", icon: CircleAlertIcon, title: "Part out of stock", meta: "Front brake pads, 2 sets" },
  { tone: "success", icon: CircleCheckIcon, title: "Invoice paid", meta: `₹${(18450).toLocaleString("en-IN")}` },
] as const

export default function IconBadgeDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <IconBadge><WrenchIcon /></IconBadge>
        <IconBadge tone="primary"><ReceiptIndianRupeeIcon /></IconBadge>
        <IconBadge tone="warning"><PackageIcon /></IconBadge>
        <IconBadge tone="primary" size="large"><WrenchIcon /></IconBadge>
        <IconBadge tone="success" size="large"><CircleCheckIcon /></IconBadge>
      </div>
      <ul className="flex flex-col gap-3">
        {rows.map(({ tone, icon: Icon, title, meta }) => (
          <li key={title} className="flex items-center gap-3">
            <IconBadge tone={tone} size="large">
              <Icon />
            </IconBadge>
            <div className="flex min-w-0 flex-col">
              <Text weight="plus" leading="compact">{title}</Text>
              <Text size="xsmall" tone="muted" leading="compact" className="truncate">{meta}</Text>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
