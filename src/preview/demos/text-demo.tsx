import { Text } from "@/components/ui/text"

export default function TextDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <Text size="large" weight="plus" leading="compact">
          Periodic service, 40,000 km
        </Text>
        <Text size="small" tone="muted" leading="compact">
          Hyundai Creta · MH 12 AB 1234 · Bay 3
        </Text>
      </div>
      <Text>
        Engine oil and filter replaced, front brake pads at 30% and flagged for the next visit. Customer
        Sufiyan Jin approved the estimate on 24/11/2026.
      </Text>
      <div className="flex items-baseline justify-between">
        <Text size="small" tone="muted">
          Estimate total
        </Text>
        <Text size="xlarge" weight="plus" leading="compact">
          ₹{(18450).toLocaleString("en-IN")}
        </Text>
      </div>
      <Text size="xsmall" tone="muted" asChild>
        <a href="#service-order" className="underline underline-offset-2">
          View job card
        </a>
      </Text>
    </div>
  )
}
