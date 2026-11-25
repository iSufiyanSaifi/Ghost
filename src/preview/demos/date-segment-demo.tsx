import * as React from "react"
import { CalendarDate, createCalendar } from "@internationalized/date"
import { I18nProvider, useDateField, useLocale } from "react-aria"
import { useDateFieldState } from "react-stately"

import { DateSegment } from "@/components/ui/date-segment"

/** A bare date field assembled from DateSegment parts (DatePicker and TimeInput use the same parts). */
function LastServiceField() {
  const { locale } = useLocale()
  const ref = React.useRef<HTMLDivElement>(null)
  const [value, setValue] = React.useState<CalendarDate | null>(new CalendarDate(2026, 8, 14))
  const options = { value, onChange: setValue, "aria-label": "Last service date", shouldForceLeadingZeros: true }
  const state = useDateFieldState({ ...options, locale, createCalendar })
  const { fieldProps } = useDateField(options, state, ref)

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Last service date</span>
      <div
        ref={ref}
        {...fieldProps}
        className="flex h-10 items-center rounded-lg border border-input bg-card px-3 text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
      >
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Click a part and type, or use the arrow keys.</p>
    </div>
  )
}

export default function DateSegmentDemo() {
  return (
    <I18nProvider locale="en-IN">
      <div className="w-full max-w-xs">
        <LastServiceField />
      </div>
    </I18nProvider>
  )
}
