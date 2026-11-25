"use client"

import * as React from "react"
import { I18nProvider, useDateField, useLocale } from "react-aria"
import { useDateFieldState } from "react-stately"
import {
  CalendarDate,
  CalendarDateTime,
  createCalendar,
  getLocalTimeZone,
  today,
} from "@internationalized/date"
import { CalendarDaysIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { DateSegment } from "@/components/ui/date-segment"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { segmentedFieldClassName } from "@/components/ui/time-input"

type DatePickerGranularity = "day" | "hour" | "minute"
type FieldValue = CalendarDate | CalendarDateTime

interface DatePickerProps {
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (value: Date | null) => void
  /** "day" shows DD/MM/YYYY; "hour" / "minute" add time segments. Default "day". */
  granularity?: DatePickerGranularity
  minValue?: Date
  maxValue?: Date
  isDisabled?: boolean
  isInvalid?: boolean
  /** Show the clear (X) button when there is a value. Default true. */
  isClearable?: boolean
  /** "base" is 40px tall, "small" 32px. Default "base". */
  size?: "base" | "small"
  "aria-label"?: string
  className?: string
}

/** JS Date -> CalendarDate (day) or CalendarDateTime (hour / minute), in local time. */
function toFieldValue(date: Date | null | undefined, granularity: DatePickerGranularity): FieldValue | null {
  if (!date) return null
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  if (granularity === "day") return new CalendarDate(y, m, d)
  return new CalendarDateTime(y, m, d, date.getHours(), granularity === "minute" ? date.getMinutes() : 0)
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function DatePickerField({
  value,
  defaultValue,
  onChange,
  granularity = "day",
  minValue,
  maxValue,
  isDisabled,
  isInvalid,
  isClearable = true,
  size = "base",
  "aria-label": ariaLabel = "Date",
  className,
}: DatePickerProps) {
  const { locale } = useLocale()
  const ref = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)

  // Controlled when `value` is passed (null included); otherwise keeps its own value.
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<FieldValue | null>(() =>
    toFieldValue(defaultValue, granularity)
  )
  // Memoised on the timestamp so a parent passing a new Date with the same time does not reset
  // what the user is typing.
  const valueTime = value ? value.getTime() : value
  const controlled = React.useMemo(
    () => toFieldValue(valueTime == null ? valueTime : new Date(valueTime), granularity),
    [valueTime, granularity]
  )
  const current = isControlled ? controlled : internal

  const minTime = minValue?.getTime()
  const maxTime = maxValue?.getTime()
  const min = React.useMemo(
    () => (minTime === undefined ? undefined : toFieldValue(startOfDay(new Date(minTime)), granularity)!),
    [minTime, granularity]
  )
  const max = React.useMemo(
    () => (maxTime === undefined ? undefined : toFieldValue(new Date(maxTime), granularity)!),
    [maxTime, granularity]
  )

  const commit = (next: FieldValue | null) => {
    if (!isControlled) setInternal(next)
    onChange?.(next ? next.toDate(getLocalTimeZone()) : null)
  }

  const fieldOptions = {
    value: current,
    onChange: (next: FieldValue | null) => commit(next),
    granularity,
    hourCycle: 12 as const,
    // DD/MM/YYYY and 09:05, not 5/1/2026 and 9:5.
    shouldForceLeadingZeros: true,
    minValue: min,
    maxValue: max,
    isDisabled,
    isInvalid,
    "aria-label": ariaLabel,
    // Keep the time segments on a day value that has no time yet.
    placeholderValue:
      granularity === "day"
        ? today(getLocalTimeZone())
        : new CalendarDateTime(...ymd(today(getLocalTimeZone())), 9, 0),
  }
  const state = useDateFieldState<FieldValue>({ ...fieldOptions, locale, createCalendar })
  const { fieldProps } = useDateField(fieldOptions, state, ref)

  const invalid = isInvalid || state.isInvalid
  const selected = current ? current.toDate(getLocalTimeZone()) : undefined

  const disabledDays = [
    ...(minValue ? [{ before: startOfDay(minValue) }] : []),
    ...(maxValue ? [{ after: startOfDay(maxValue) }] : []),
  ]

  const pickDay = (day: Date | undefined) => {
    if (!day) return
    const y = day.getFullYear()
    const m = day.getMonth() + 1
    const d = day.getDate()
    if (granularity === "day") {
      commit(new CalendarDate(y, m, d))
    } else if (current && "hour" in current) {
      commit(current.set({ year: y, month: m, day: d }))
    } else {
      commit(new CalendarDateTime(y, m, d, 9, 0))
    }
    setOpen(false)
  }

  const hasValue = current !== null
  const small = size === "small"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div
          data-slot="date-picker"
          data-size={size}
          aria-invalid={invalid || undefined}
          aria-disabled={isDisabled || undefined}
          className={cn(
            segmentedFieldClassName,
            "gap-1 pr-1",
            small && "h-8 px-2.5 pr-0.5 text-sm",
            open && "border-ring",
            className
          )}
        >
          <div
            ref={ref}
            data-slot="date-picker-field"
            {...fieldProps}
            className="flex min-w-0 flex-1 items-center overflow-hidden"
          >
            {state.segments.map((segment, index) => (
              <DateSegment key={index} segment={segment} state={state} />
            ))}
          </div>
          {hasValue && isClearable && !isDisabled ? (
            <Button
              type="button"
              data-slot="date-picker-clear"
              variant="ghost"
              size="icon-xs"
              aria-label="Clear date"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => state.setValue(null)}
            >
              <XIcon />
            </Button>
          ) : null}
          <PopoverTrigger asChild>
            <Button
              type="button"
              data-slot="date-picker-trigger"
              variant="ghost"
              size={small ? "icon-xs" : "icon-sm"}
              aria-label="Open calendar"
              disabled={isDisabled}
              className="text-muted-foreground hover:text-foreground"
            >
              <CalendarDaysIcon />
            </Button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent data-slot="date-picker-content" align="end" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={pickDay}
          defaultMonth={selected ?? (minValue && minValue > new Date() ? minValue : undefined)}
          disabled={disabledDays}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

function ymd(date: CalendarDate): [number, number, number] {
  return [date.year, date.month, date.day]
}

/**
 * Date field that reads DD/MM/YYYY (optionally with time), with a calendar popover and a clear
 * button. Works with plain JS Dates; converts to @internationalized/date internally.
 */
function DatePicker(props: DatePickerProps) {
  return (
    <I18nProvider locale="en-IN">
      <DatePickerField {...props} />
    </I18nProvider>
  )
}

export { DatePicker, type DatePickerProps, type DatePickerGranularity }
