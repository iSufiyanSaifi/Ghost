import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  ProgressTabs,
  ProgressTabsContent,
  ProgressTabsList,
  ProgressTabsTrigger,
  type ProgressStatus,
} from "@/components/ui/progress-tabs"

const STEPS = [
  { value: "customer", label: "Customer", body: "Sufiyan Jin · +91 97850 12345" },
  { value: "vehicle", label: "Vehicle", body: "MH 12 AB 1234 · Hyundai Creta, 42,180 km" },
  { value: "jobs", label: "Jobs", body: "Periodic service, brake pad replacement, wheel alignment" },
  { value: "review", label: "Review", body: "Estimate ₹18,450.00 · Bay 3 · Ready by 27/11/2026" },
] as const

type Step = (typeof STEPS)[number]["value"]

export default function ProgressTabsDemo() {
  const [active, setActive] = React.useState<Step>("customer")
  const [done, setDone] = React.useState<Set<Step>>(new Set())

  const status = (step: Step): ProgressStatus =>
    done.has(step) ? "completed" : step === active ? "in-progress" : "not-started"

  const next = (index: number) => {
    setDone((prev) => new Set(prev).add(STEPS[index].value))
    if (index < STEPS.length - 1) setActive(STEPS[index + 1].value)
  }

  return (
    <ProgressTabs
      value={active}
      onValueChange={(value) => setActive(value as Step)}
      className="w-full overflow-hidden rounded-xl border border-border bg-card"
    >
      <ProgressTabsList>
        {STEPS.map((step) => (
          <ProgressTabsTrigger key={step.value} value={step.value} status={status(step.value)}>
            {step.label}
          </ProgressTabsTrigger>
        ))}
      </ProgressTabsList>
      {STEPS.map((step, index) => (
        <ProgressTabsContent key={step.value} value={step.value} className="flex flex-col gap-3 p-4">
          <p className="text-sm font-medium text-foreground">New service order · {step.label}</p>
          <p className="text-sm text-muted-foreground">{step.body}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => next(index)} disabled={done.has(step.value)}>
              {index === STEPS.length - 1 ? "Create order" : "Continue"}
            </Button>
            {done.size > 0 && index === STEPS.length - 1 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setDone(new Set())
                  setActive("customer")
                }}
              >
                Start over
              </Button>
            )}
          </div>
        </ProgressTabsContent>
      ))}
    </ProgressTabs>
  )
}
