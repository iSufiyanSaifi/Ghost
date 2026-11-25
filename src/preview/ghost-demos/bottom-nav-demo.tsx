import * as React from "react"
import { CalendarDays, ClipboardList, LayoutDashboard, Package, User } from "lucide-react"

import { BottomNav } from "@/components/ghost/bottom-nav"

const items = [
  { label: "Home", icon: LayoutDashboard },
  { label: "Orders", icon: ClipboardList },
  { label: "Bookings", icon: CalendarDays },
  { label: "Inventory", icon: Package },
  { label: "Profile", icon: User },
]

export default function BottomNavDemo() {
  const [tab, setTab] = React.useState("Home")

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border">
      <div className="grid h-32 place-items-center bg-background text-sm text-muted-foreground">
        {tab}
      </div>
      <BottomNav items={items} value={tab} onChange={setTab} className="border-t" />
    </div>
  )
}
