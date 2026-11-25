import * as React from "react"

import { cn } from "@/lib/utils"
import { statusToneClass } from "@/components/ghost/status-badge"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type BayState = "free" | "occupied" | "blocked"

const stateMeta: Record<BayState, { label: string; className: string }> = {
  free: { label: "Free", className: statusToneClass.success },
  occupied: { label: "Occupied", className: statusToneClass.info },
  blocked: { label: "Blocked", className: statusToneClass.error },
}

export interface BayCardProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Bay name, e.g. `Bay 3`. */
  bay: string
  /** Vehicle in the bay, e.g. `Tata Nexon · KA 03 EF 9012`. */
  vehicle?: string
  /** Assigned technician. */
  technician?: string
  /** Bay state. @default "occupied" */
  state?: BayState
}

/**
 * Workshop bay status tile (Figma "Bay Card-CVG").
 */
function BayCard({ bay, vehicle, technician, state = "occupied", className, ...props }: BayCardProps) {
  const s = stateMeta[state]
  return (
    <Card data-slot="bay-card" data-state={state} className={cn("min-w-45 gap-2 p-4", className)} {...props}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{bay}</span>
        <Badge variant="outline" className={cn("border-transparent", s.className)}>
          {s.label}
        </Badge>
      </div>
      <div className="text-[13px] text-muted-foreground tabular-nums">{vehicle || "—"}</div>
      <div className="text-xs text-muted-foreground">{technician || "Unassigned"}</div>
    </Card>
  )
}

export { BayCard }
