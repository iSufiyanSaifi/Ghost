import * as React from "react"

import { cn } from "@/lib/utils"

export interface SectionHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Section title, rendered as an `h2`. */
  title: string
  /** Secondary line, e.g. a count. */
  subtitle?: string
  /** Trailing action, e.g. a ghost `View all` button. */
  action?: React.ReactNode
}

/**
 * Title row above a card group or list (Figma "Section", "Components/Section header", "_module/header").
 */
function SectionHeader({ title, subtitle, action, className, ...props }: SectionHeaderProps) {
  return (
    <div data-slot="section-header" className={cn("flex items-end gap-4", className)} {...props}>
      <div className="min-w-0 flex-1">
        <h2 className="m-0 text-base leading-6 font-semibold text-foreground">{title}</h2>
        {subtitle && <div className="text-[13px] text-muted-foreground tabular-nums">{subtitle}</div>}
      </div>
      {action}
    </div>
  )
}

export { SectionHeader }
