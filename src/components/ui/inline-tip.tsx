import * as React from "react"
import { cn } from "@/lib/utils"

type InlineTipVariant = "info" | "warning" | "error" | "success"

const accent: Record<InlineTipVariant, string> = {
  info: "bg-info",
  warning: "bg-warning",
  error: "bg-error",
  success: "bg-success",
}

const defaultLabel: Record<InlineTipVariant, string> = {
  info: "Tip",
  warning: "Warning",
  error: "Error",
  success: "Done",
}

type InlineTipProps = React.ComponentProps<"div"> & {
  /** Tone of the accent bar. */
  variant?: InlineTipVariant
  /** Bold lead-in before the text, e.g. "Tip" or "Note". Defaults by variant. */
  label?: React.ReactNode
}

/** A short inline note with a coloured accent bar and a bold label. */
function InlineTip({ variant = "info", label, className, children, ...props }: InlineTipProps) {
  return (
    <div
      role="note"
      data-slot="inline-tip"
      data-variant={variant}
      className={cn(
        "grid grid-cols-[4px_1fr] items-stretch gap-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <div data-slot="inline-tip-accent" role="presentation" className={cn("w-1 rounded-sm", accent[variant])} />
      <div data-slot="inline-tip-content" className="text-pretty">
        <strong data-slot="inline-tip-label" className="font-medium text-foreground">
          {label ?? defaultLabel[variant]}:
        </strong>{" "}
        {children}
      </div>
    </div>
  )
}

export { InlineTip }
export type { InlineTipProps }
