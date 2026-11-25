import * as React from "react"
import { Time } from "@internationalized/date"

import { TimeInput } from "@/components/ui/time-input"

export default function TimeInputDemo() {
  const [opens, setOpens] = React.useState<Time | null>(new Time(9, 30))

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <TimeInput label="Workshop opens" value={opens} onChange={setOpens} />
      <p className="text-sm text-muted-foreground">
        {opens
          ? `Bays open for service at ${String(opens.hour % 12 || 12).padStart(2, "0")}:${String(opens.minute).padStart(2, "0")} ${opens.hour < 12 ? "AM" : "PM"}`
          : "Opening time not set"}
      </p>
    </div>
  )
}
