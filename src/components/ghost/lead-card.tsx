import * as React from "react"
import { Car } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge, type StatusTone } from "@/components/ghost/status-badge"

export type LeadCardTone = StatusTone

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")

export interface LeadCardProps extends React.ComponentProps<"div"> {
  name: string
  /** Vehicle and registration, e.g. "Kia Seltos · KA 05 MN 4421". */
  vehicle: string
  /** Lead source, e.g. "Walk-in". */
  source?: string
  /** Pipeline stage label. @default "New" */
  stage?: string
  /** Status tone of the stage badge. @default "info" */
  tone?: LeadCardTone
  /** Pre-formatted estimate value, e.g. "₹18,400". */
  value?: string
  /** DD/MM/YYYY. */
  date?: string
}

/**
 * CRM lead tile for pipeline boards (Figma "Lead Cards-CVG"): customer, source, stage badge,
 * vehicle, date and estimate value.
 */
export function LeadCard({
  name,
  vehicle,
  source,
  stage = "New",
  tone = "info",
  value,
  date,
  className,
  ...props
}: LeadCardProps) {
  return (
    <div
      data-slot="lead-card"
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        <Avatar className="size-9">
          <AvatarFallback className="text-xs font-medium">{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{name}</div>
          {source && <div className="text-xs text-muted-foreground">{source}</div>}
        </div>
        <StatusBadge tone={tone}>
          {stage}
        </StatusBadge>
      </div>
      <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
        <Car className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{vehicle}</span>
      </div>
      {(date || value) && (
        <div className="flex justify-between text-[13px] text-muted-foreground tabular-nums">
          <span>{date}</span>
          <span className="font-semibold text-foreground">{value}</span>
        </div>
      )}
    </div>
  )
}
