import * as React from "react"

import { cn } from "@/lib/utils"

const barHeights = ["h-1", "h-1.5", "h-2", "h-2.75"]

export interface StatusBarProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** @default "9:41" */
  time?: string
  /** Inverted chrome (`bg-foreground` / `text-background`), for screens with a dark header or media. @default false */
  dark?: boolean
  /** Battery level, 0–100; under 20 the fill turns red. @default 80 */
  battery?: number
  /** Signal bars, 0–4. @default 4 */
  signal?: number
  /** Replaces the time on the left when set. */
  carrier?: string
}

/**
 * Mobile status bar for Ghost-App screens (replaces Figma "Status bar/iPhone *", "Battery", "Network",
 * "9:41" families; one component, props for state).
 */
function StatusBar({ time = "9:41", dark = false, battery = 80, signal = 4, carrier, className, ...props }: StatusBarProps) {
  const level = Math.max(0, Math.min(100, Math.round(battery)))
  const bars = Math.max(0, Math.min(4, Math.round(signal)))
  return (
    <div
      data-slot="status-bar"
      className={cn(
        "flex h-[47px] w-full items-center pr-[26px] pl-8",
        dark ? "bg-foreground text-background" : "bg-transparent text-foreground",
        className
      )}
      {...props}
    >
      <span className="flex-1 text-[17px] leading-[22px] font-semibold tabular-nums">{carrier || time}</span>
      <span className="inline-flex items-center gap-1.5">
        <span role="img" aria-label={`Signal ${bars} of 4 bars`} className="inline-flex h-2.75 items-end gap-[1.5px]">
          {barHeights.map((h, i) => (
            <span key={i} className={cn("w-[3px] rounded-[1px] bg-current", h, i >= bars && "opacity-30")} />
          ))}
        </span>
        <span role="img" aria-label={`Battery ${level}%`} className="inline-flex items-center gap-px">
          <span className="h-3 w-6 rounded-[3.5px] border border-current p-px opacity-95">
            <span
              className={cn("block h-full rounded-[1.5px]", level < 20 ? "bg-error" : "bg-current")}
              style={{ width: `${level}%` }}
            />
          </span>
          <span className="h-1 w-[1.5px] rounded-[1px] bg-current opacity-50" />
        </span>
      </span>
    </div>
  )
}

export { StatusBar }
