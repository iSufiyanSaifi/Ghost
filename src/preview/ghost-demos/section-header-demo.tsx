import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/ghost/section-header"

export default function SectionHeaderDemo() {
  return (
    <div className="max-w-xl">
      <SectionHeader title="Today's jobs" subtitle="12 vehicles" action={<Button variant="ghost" size="sm">View all</Button>} />
    </div>
  )
}
