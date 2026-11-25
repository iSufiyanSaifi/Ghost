import * as React from "react"
import { Car } from "lucide-react"

import { cn } from "@/lib/utils"
import { StatusBadge, type StatusTone } from "@/components/ghost/status-badge"
import { Card } from "@/components/ui/card"


export interface VehicleCardProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Registration number, e.g. `MH 12 AB 1234`. */
  reg: string
  /** Make and variant, e.g. `Hyundai Creta SX`. */
  model: string
  /** Secondary line, e.g. fuel type and odometer. */
  meta?: string
  /** Status badge text, e.g. `In workshop`. */
  status?: string
  /** Badge tone. @default "info" */
  tone?: StatusTone
  /** Photo URL; falls back to a car icon. */
  image?: string
}

/**
 * Vehicle information block (Figma "Car Card"). Pass `image` for a real photo; falls back to a car icon.
 */
function VehicleCard({ reg, model, meta, status, tone = "info", image, className, ...props }: VehicleCardProps) {
  return (
    <Card data-slot="vehicle-card" className={cn("flex-row items-start gap-4 p-4", className)} {...props}>
      <div className="grid size-18 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
        {image ? (
          <img src={image} alt={model} className="size-full object-cover" />
        ) : (
          <Car className="size-8" aria-hidden="true" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="truncate text-base font-semibold text-foreground">{model}</div>
        <div className="text-[13px] text-muted-foreground tabular-nums">{reg}</div>
        {meta && <div className="text-[13px] text-muted-foreground tabular-nums">{meta}</div>}
      </div>
      {status && (
        <StatusBadge tone={tone}>
          {status}
        </StatusBadge>
      )}
    </Card>
  )
}

export { VehicleCard }
