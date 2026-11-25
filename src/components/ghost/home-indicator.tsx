import * as React from "react"

import { cn } from "@/lib/utils"

export interface HomeIndicatorProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Inverted chrome (`bg-foreground` with a `bg-background` bar). @default false */
  dark?: boolean
}

/**
 * Bottom home-indicator bar for mobile screens (replaces Figma "Home bar/iPhone *" families). Decorative.
 */
function HomeIndicator({ dark = false, className, ...props }: HomeIndicatorProps) {
  return (
    <div
      data-slot="home-indicator"
      aria-hidden="true"
      className={cn("grid h-[34px] w-full place-items-center", dark ? "bg-foreground" : "bg-transparent", className)}
      {...props}
    >
      <span className={cn("h-[5px] w-[134px] rounded-[1.5px]", dark ? "bg-background" : "bg-foreground")} />
    </div>
  )
}

export { HomeIndicator }
