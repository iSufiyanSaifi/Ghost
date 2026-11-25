import * as React from "react"

import { PlanCard } from "@/components/ghost/plan-card"

const plans = [
  { name: "Workshop Starter", price: "₹999", features: ["1 bay", "GST invoicing", "Job cards"] },
  {
    name: "Workshop Pro",
    price: "₹2,999",
    features: ["5 bays", "GST invoicing", "Inventory", "SMS reminders"],
    featured: true,
  },
]

export default function PlanCardDemo() {
  const [chosen, setChosen] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="grid gap-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            cta={chosen === plan.name ? "Current plan" : "Choose plan"}
            onSelect={() => setChosen(plan.name)}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {chosen ? `${chosen} selected.` : "No plan selected."}
      </p>
    </div>
  )
}
