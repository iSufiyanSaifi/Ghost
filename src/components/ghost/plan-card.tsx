import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface PlanCardProps extends React.ComponentProps<"div"> {
  name: string
  /** Pre-formatted price, e.g. "₹2,999". */
  price: string
  /** @default "/month" */
  period?: string
  features?: string[]
  /** Highlights the plan with a primary outline, a "Recommended" badge and a solid CTA. */
  featured?: boolean
  /** @default "Choose plan" */
  cta?: string
  onSelect?: () => void
}

/**
 * Subscription tier card (Figma "Premium Card", "CVG Premium Card", "Upgrade").
 */
export function PlanCard({
  name,
  price,
  period = "/month",
  features = [],
  featured = false,
  cta = "Choose plan",
  onSelect,
  className,
  ...props
}: PlanCardProps) {
  return (
    <div
      data-slot="plan-card"
      data-featured={featured || undefined}
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground",
        featured && "border-primary ring-1 ring-primary",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold">{name}</span>
        {featured && <Badge className="bg-primary/10 text-primary">Recommended</Badge>}
      </div>
      <div className="tabular-nums">
        <span className="text-[32px] leading-none font-bold">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      {features.length > 0 && (
        <ul className="flex flex-col gap-2">
          {features.map((feature) => (
            <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
      )}
      <Button
        type="button"
        variant={featured ? "default" : "outline"}
        className="w-full"
        onClick={onSelect}
      >
        {cta}
      </Button>
    </div>
  )
}
