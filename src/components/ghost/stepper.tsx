import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StepperProps extends Omit<React.ComponentProps<"ol">, "children"> {
  /** Step labels in order, e.g. `['Check-in', 'Inspection', 'Estimate', 'Delivery']`. */
  steps?: string[]
  /** Zero-based index of the active step. @default 0 */
  current?: number
}

/**
 * Workflow progress, e.g. Check-in → Inspection → Estimate → Delivery.
 * Completed steps show a check, the active step carries `aria-current="step"`.
 */
function Stepper({ steps = [], current = 0, className, ...props }: StepperProps) {
  return (
    <ol
      data-slot="stepper"
      className={cn("m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[13px] font-medium", className)}
      {...props}
    >
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li
            key={`${i}-${step}`}
            data-state={done ? "complete" : active ? "active" : "upcoming"}
            aria-current={active ? "step" : undefined}
            className={cn("flex items-center gap-2", i <= current ? "text-foreground" : "text-muted-foreground")}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-md text-xs tabular-nums",
                done && "bg-success-subtle text-success-text",
                active && "bg-primary text-primary-foreground",
                !done && !active && "border border-border bg-card text-muted-foreground"
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : i + 1}
            </span>
            <span>
              {step}
              {done && <span className="sr-only"> (completed)</span>}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className={cn("h-px w-8", done ? "bg-success" : "bg-border")} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export { Stepper }
