import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface BottomNavItem {
  label: string
  /** Lucide icon component (was a Jin icon-name string in the legacy API). */
  icon: LucideIcon
}

export interface BottomNavProps extends Omit<React.ComponentProps<"nav">, "onChange"> {
  items?: BottomNavItem[]
  /** Label of the active item. */
  value?: string
  onChange?: (label: string) => void
}

/**
 * Mobile tab bar with 48px touch targets. The active item is marked `aria-current="page"`.
 */
export function BottomNav({
  items = [],
  value,
  onChange,
  className,
  "aria-label": ariaLabel = "Primary",
  ...props
}: BottomNavProps) {
  return (
    <nav
      data-slot="bottom-nav"
      aria-label={ariaLabel}
      className={cn("flex border-t border-border bg-card px-2 py-1.5", className)}
      {...props}
    >
      {items.map(({ label, icon: Icon }) => {
        const active = label === value
        return (
          <button
            key={label}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onChange?.(label)}
            className={cn(
              "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-md text-[11px] outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
              active
                ? "font-semibold text-primary"
                : "font-medium text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-[22px]" aria-hidden />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
