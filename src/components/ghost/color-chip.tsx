import * as React from "react"

import { cn } from "@/lib/utils"
import { statusToneClass } from "@/components/ghost/status-badge"

type ChipColor = "blue" | "green" | "yellow" | "red" | "orange" | "gray"

const colorClasses: Record<ChipColor, string> = {
  blue: statusToneClass.info,
  green: statusToneClass.success,
  yellow: statusToneClass.warning,
  red: statusToneClass.error,
  orange: statusToneClass.pending,
  gray: statusToneClass.neutral,
}

export interface ColorChipProps extends React.ComponentProps<"span"> {
  /** Maps to Ghost tones: blue→info, green→success, yellow→warning, red→error, orange→pending, gray→neutral. @default "gray" */
  color?: ChipColor
  children?: React.ReactNode
}

/**
 * Square-cornered tag for categories (service type, part category). Use Badge for lifecycle status.
 */
function ColorChip({ color = "gray", className, ...props }: ColorChipProps) {
  return (
    <span
      data-slot="color-chip"
      data-color={color}
      className={cn(
        "inline-flex h-6 items-center rounded-sm px-2.5 text-xs font-medium whitespace-nowrap",
        colorClasses[color] ?? colorClasses.gray,
        className
      )}
      {...props}
    />
  )
}

export { ColorChip }
