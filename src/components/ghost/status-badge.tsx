import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/** Ghost status tones. The same status always uses the same tone across modules. */
export type StatusTone = "success" | "warning" | "error" | "info" | "pending" | "neutral"

/** Subtle background + readable text for a tone (badges, chips, pills of status). */
export const statusToneClass: Record<StatusTone, string> = {
  success: "bg-success-subtle text-success-text",
  warning: "bg-warning-subtle text-warning-text",
  error: "bg-error-subtle text-error-text",
  info: "bg-info-subtle text-info-text",
  pending: "bg-pending-subtle text-pending-text",
  neutral: "bg-neutral-subtle text-neutral-text",
}

/** Text colour only, for deltas and inline status text. */
export const statusToneText: Record<StatusTone, string> = {
  success: "text-success-text",
  warning: "text-warning-text",
  error: "text-error-text",
  info: "text-info-text",
  pending: "text-pending-text",
  neutral: "text-neutral-text",
}

export interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
  /** @default "neutral" */
  tone?: StatusTone
}

/**
 * Status badge with a Ghost tone, e.g. Approved (success), Awaiting approval (pending),
 * In workshop (info), Rejected (error). Rounded rectangle, never a pill.
 */
export function StatusBadge({ tone = "neutral", className, ...props }: StatusBadgeProps) {
  return (
    <Badge
      data-slot="status-badge"
      data-tone={tone}
      variant="outline"
      className={cn("border-transparent", statusToneClass[tone], className)}
      {...props}
    />
  )
}
