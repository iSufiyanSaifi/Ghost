import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ghost/stepper"

const steps = ["Check-in", "Inspection", "Estimate", "Delivery"]

export default function StepperDemo() {
  const [current, setCurrent] = useState(1)
  return (
    <div className="flex flex-col items-start gap-4">
      <Stepper steps={steps} current={current} aria-label="Service order progress" />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          Back
        </Button>
        <Button size="sm" disabled={current === steps.length} onClick={() => setCurrent((c) => c + 1)}>
          {current >= steps.length - 1 ? "Mark delivered" : "Next step"}
        </Button>
      </div>
    </div>
  )
}
