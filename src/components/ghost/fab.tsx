import * as React from "react"
import { Plus, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface FABProps extends Omit<React.ComponentProps<"button">, "children"> {
  /** Lucide icon component (was a Jin icon-name string in the legacy API). @default Plus */
  icon?: LucideIcon
  /** Visible label; when omitted the FAB is icon-only and uses "Add" as its accessible name. */
  label?: string
}

/**
 * Floating action button for the primary create action on mobile. Fixed to the bottom-right
 * corner by default; pass `className="static"` (or other positioning) to render it in place.
 */
export function FAB({
  icon: Icon = Plus,
  label,
  className,
  "aria-label": ariaLabel,
  ...props
}: FABProps) {
  return (
    <Button
      data-slot="fab"
      type="button"
      aria-label={ariaLabel ?? (label ? undefined : "Add")}
      className={cn(
        "fixed right-4 bottom-4 z-50 h-14 min-w-14 gap-2 rounded-xl text-sm font-semibold shadow-lg",
        label ? "px-5" : "w-14 px-0",
        className
      )}
      {...props}
    >
      <Icon className="size-[22px]" aria-hidden />
      {label}
    </Button>
  )
}
