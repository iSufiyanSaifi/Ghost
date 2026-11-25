import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  ProgressAccordion,
  ProgressAccordionContent,
  ProgressAccordionHeader,
  ProgressAccordionItem,
} from "@/components/ui/progress-accordion"
import type { ProgressStatus } from "@/components/ui/progress-tabs"

const STEPS = [
  { value: "customer", label: "Customer", body: "Sufiyan Jin · +91 97850 12345" },
  { value: "vehicle", label: "Vehicle", body: "MH 12 AB 1234 · Hyundai Creta, 42,180 km" },
  { value: "jobs", label: "Jobs", body: "Periodic service, brake pad replacement, wheel alignment" },
  { value: "review", label: "Review", body: "Estimate ₹18,450.00 · Bay 3 · Ready by 27/11/2026" },
] as const

type Step = (typeof STEPS)[number]["value"]

export default function ProgressAccordionDemo() {
  const [open, setOpen] = React.useState<string>("customer")
  const [done, setDone] = React.useState<Set<Step>>(new Set())

  const status = (step: Step): ProgressStatus =>
    done.has(step) ? "completed" : step === open ? "in-progress" : "not-started"

  const next = (index: number) => {
    setDone((prev) => new Set(prev).add(STEPS[index].value))
    setOpen(index < STEPS.length - 1 ? STEPS[index + 1].value : "")
  }

  return (
    <ProgressAccordion
      type="single"
      collapsible
      value={open}
      onValueChange={setOpen}
      className="w-full overflow-hidden rounded-xl border border-border bg-card"
    >
      {STEPS.map((step, index) => (
        <ProgressAccordionItem key={step.value} value={step.value}>
          <ProgressAccordionHeader status={status(step.value)}>{step.label}</ProgressAccordionHeader>
          <ProgressAccordionContent className="flex flex-col gap-3">
            <p className="text-muted-foreground">{step.body}</p>
            <div>
              <Button size="sm" onClick={() => next(index)} disabled={done.has(step.value)}>
                {index === STEPS.length - 1 ? "Create order" : "Continue"}
              </Button>
            </div>
          </ProgressAccordionContent>
        </ProgressAccordionItem>
      ))}
    </ProgressAccordion>
  )
}
