import * as React from "react"

import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"

const formatDate = (date: Date | null) =>
  date
    ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "Not set"

const formatSlot = (date: Date | null) =>
  date
    ? `${formatDate(date)}, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`
    : "Not set"

export default function DatePickerDemo() {
  const [today] = React.useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  })
  const [delivery, setDelivery] = React.useState<Date | null>(() => {
    const d = new Date(today)
    d.setDate(d.getDate() + 2)
    return d
  })
  const [pickup, setPickup] = React.useState<Date | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Field>
        <FieldLabel>Delivery date</FieldLabel>
        <DatePicker aria-label="Delivery date" value={delivery} onChange={setDelivery} minValue={today} />
        <FieldDescription>Chosen: {formatDate(delivery)}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Pickup slot</FieldLabel>
        <DatePicker
          aria-label="Pickup slot"
          granularity="minute"
          value={pickup}
          onChange={setPickup}
          minValue={today}
        />
        <FieldDescription>Chosen: {formatSlot(pickup)}</FieldDescription>
      </Field>
    </div>
  )
}
