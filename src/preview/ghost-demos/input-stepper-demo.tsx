import { useState } from "react"

import { InputStepper } from "@/components/ghost/input-stepper"

const unitPrice = 1450

export default function InputStepperDemo() {
  const [qty, setQty] = useState(2)
  const [hours, setHours] = useState(1.5)
  return (
    <div className="grid max-w-md gap-4 text-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-medium text-foreground">Brake pads (front)</div>
          <div className="text-muted-foreground tabular-nums">
            ₹{unitPrice.toLocaleString("en-IN")} × {qty} = ₹{(unitPrice * qty).toLocaleString("en-IN")} + GST
          </div>
        </div>
        <InputStepper value={qty} onChange={setQty} min={1} max={8} unit="pcs" label="Brake pad quantity" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="font-medium text-foreground">Labour</div>
        <InputStepper value={hours} onChange={setHours} min={0.5} max={12} step={0.5} unit="hrs" label="Labour hours" />
      </div>
    </div>
  )
}
