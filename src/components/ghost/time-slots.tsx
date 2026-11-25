import * as React from "react"

import { cn } from "@/lib/utils"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export interface TimeSlotsProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue" | "dir"> {
  /** Slot labels in 24-hour HH:MM, e.g. "09:00". */
  slots: string[]
  /** Selected slot (controlled). */
  value?: string
  /** Initially selected slot (uncontrolled). */
  defaultValue?: string
  /** Slots that are fully booked; rendered struck through and not selectable. */
  disabled?: string[]
  onChange?: (value: string) => void
}

/**
 * Appointment slot picker (Figma "Time", "Sub components/Date option item"). A single-select
 * toggle group with arrow-key navigation; booked slots are disabled.
 */
export function TimeSlots({
  slots,
  value,
  defaultValue,
  disabled = [],
  onChange,
  className,
  "aria-label": ariaLabel = "Time slots",
  ...props
}: TimeSlotsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const selected = value ?? internal

  return (
    <ToggleGroup
      data-slot="time-slots"
      type="single"
      variant="outline"
      spacing={2}
      value={selected}
      onValueChange={(next) => {
        // Keep a slot selected: Radix emits "" when the active item is pressed again.
        if (!next) return
        if (value === undefined) setInternal(next)
        onChange?.(next)
      }}
      aria-label={ariaLabel}
      className={cn("grid w-full grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2", className)}
      {...props}
    >
      {slots.map((slot) => (
        <ToggleGroupItem
          key={slot}
          value={slot}
          disabled={disabled.includes(slot)}
          size="sm"
          className="h-9 w-full rounded-md font-medium tabular-nums disabled:line-through data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90"
        >
          {slot}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
