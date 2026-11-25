"use client"

import * as React from "react"
import { I18nProvider, useLocale, useTimeField } from "react-aria"
import { useTimeFieldState } from "react-stately"
import type { Time } from "@internationalized/date"

import { cn } from "@/lib/utils"
import { DateSegment } from "@/components/ui/date-segment"

/** Shared look of a segmented field: white, 1px input border, 40px tall, focus ring on focus-within. */
const segmentedFieldClassName = cn(
  "flex h-10 w-full min-w-0 items-center rounded-lg border border-input bg-card px-3 text-base text-foreground transition-colors md:text-sm dark:bg-input/30",
  "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
  "aria-invalid:border-destructive aria-invalid:focus-within:ring-destructive/20 dark:aria-invalid:border-destructive/50",
  "aria-disabled:cursor-not-allowed aria-disabled:bg-input/50 aria-disabled:opacity-50"
)

interface TimeInputProps {
  value?: Time | null
  defaultValue?: Time | null
  onChange?: (value: Time | null) => void
  /** Smallest unit shown. Default "minute". */
  granularity?: "hour" | "minute" | "second"
  /** 12 (with AM/PM) or 24 hour clock. Default 12. */
  hourCycle?: 12 | 24
  /** Visible label above the field. Use `aria-label` when there is no visible label. */
  label?: React.ReactNode
  "aria-label"?: string
  isDisabled?: boolean
  isInvalid?: boolean
  className?: string
}

function TimeInputField({
  label,
  className,
  hourCycle = 12,
  granularity = "minute",
  isInvalid,
  ...props
}: TimeInputProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const { locale } = useLocale()
  const ariaProps = {
    ...props,
    label,
    hourCycle,
    granularity,
    isInvalid,
    shouldForceLeadingZeros: true,
    // react-aria warns when a field has neither a visible label nor an aria-label.
    "aria-label": props["aria-label"] ?? (label ? undefined : "Time"),
  }
  const state = useTimeFieldState({ ...ariaProps, locale })
  const { labelProps, fieldProps } = useTimeField(ariaProps, state, ref)

  return (
    <div data-slot="time-input" className={cn("flex w-full flex-col gap-2", className)}>
      {label ? (
        <span
          data-slot="time-input-label"
          {...labelProps}
          className="text-sm leading-none font-medium select-none"
        >
          {label}
        </span>
      ) : null}
      <div
        ref={ref}
        data-slot="time-input-field"
        {...fieldProps}
        aria-invalid={isInvalid || state.isInvalid || undefined}
        aria-disabled={props.isDisabled || undefined}
        className={segmentedFieldClassName}
      >
        {state.segments.map((segment, index) => (
          <DateSegment key={index} segment={segment} state={state} />
        ))}
      </div>
    </div>
  )
}

/**
 * Segmented hour / minute (/ second) field. Type digits or use the arrow keys on each part.
 * Values are `Time` objects from @internationalized/date.
 */
function TimeInput(props: TimeInputProps) {
  return (
    <I18nProvider locale="en-IN">
      <TimeInputField {...props} />
    </I18nProvider>
  )
}

export { TimeInput, segmentedFieldClassName, type TimeInputProps }
