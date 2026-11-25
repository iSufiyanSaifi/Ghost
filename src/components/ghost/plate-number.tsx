import * as React from "react"

import { cn } from "@/lib/utils"

export interface PlateNumberProps extends React.ComponentProps<"span"> {
  /** The registration, e.g. `MH 12 AB 1234`. */
  children?: React.ReactNode
  /** @default "md" */
  size?: "sm" | "md"
}

/**
 * Indian registration plate display (Figma "Plate").
 */
function PlateNumber({ children, size = "md", className, ...props }: PlateNumberProps) {
  return (
    <span
      data-slot="plate-number"
      data-size={size}
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-sm border border-plate-border bg-plate text-plate-foreground",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="grid place-items-center bg-primary px-1 text-[9px] font-bold text-primary-foreground"
      >
        IND
      </span>
      <span
        className={cn(
          "font-mono font-bold tracking-[.06em] whitespace-nowrap tabular-nums",
          size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-[15px]"
        )}
      >
        {children}
      </span>
    </span>
  )
}

export { PlateNumber }
