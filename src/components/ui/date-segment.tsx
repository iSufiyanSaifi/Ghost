"use client"

import * as React from "react"
import { useDateSegment } from "react-aria"
import type { DateFieldState, DateSegment as DateSegmentData } from "react-stately"

import { cn } from "@/lib/utils"

interface DateSegmentProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** One segment from a react-stately date or time field state (`state.segments`). */
  segment: DateSegmentData
  /** The field state that owns the segment (DateFieldState or TimeFieldState). */
  state: DateFieldState
}

/**
 * One editable part of a segmented date/time field (day, month, year, hour, minute, AM/PM),
 * or the literal between parts. Used by TimeInput and DatePicker.
 */
function DateSegment({ segment, state, className, ...props }: DateSegmentProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { segmentProps } = useDateSegment(segment, state, ref)

  // The literal between the date and time parts (", " or a lone space). A whitespace-only text node
  // collapses at a line edge, so render a spacer instead.
  const isSpacingLiteral =
    segment.type === "literal" && (segment.text === ", " || segment.text.trim() === "")

  if (isSpacingLiteral) {
    return <span data-slot="date-segment-spacer" aria-hidden="true" className="w-1.5 shrink-0" />
  }

  return (
    // The wrapping span keeps a click beside the field from focusing the last segment
    // (react-spectrum issue 3164).
    <span data-slot="date-segment-wrapper" className="inline-flex">
      <div
        ref={ref}
        data-slot="date-segment"
        data-type={segment.type}
        data-placeholder={segment.isPlaceholder || undefined}
        className={cn(
          "rounded-sm px-px tabular-nums outline-none transition-colors caret-transparent",
          "focus:bg-primary/10 focus:text-foreground",
          segment.type === "literal" && "px-0 text-muted-foreground",
          segment.isPlaceholder && "text-muted-foreground",
          !segment.isEditable && !state.value && "text-muted-foreground",
          segment.type === "dayPeriod" && "uppercase",
          className
        )}
        {...props}
        {...segmentProps}
      >
        {segment.text}
      </div>
    </span>
  )
}

export { DateSegment, type DateSegmentProps }
