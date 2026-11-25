import * as React from "react"

import { TimeSlots } from "@/components/ghost/time-slots"

export default function TimeSlotsDemo() {
  const [slot, setSlot] = React.useState("10:00")

  return (
    <div className="flex max-w-md flex-col gap-3">
      <div className="text-sm font-medium">Service slots · 21/11/2026</div>
      <TimeSlots
        aria-label="Service slots on 21/11/2026"
        slots={["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]}
        value={slot}
        disabled={["11:00", "15:00"]}
        onChange={setSlot}
      />
      <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
        Drop-off at {slot}
      </p>
    </div>
  )
}
