import { HomeIndicator } from "@/components/ghost/home-indicator"

export default function HomeIndicatorDemo() {
  return (
    <div className="grid max-w-sm gap-3">
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <HomeIndicator />
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <HomeIndicator dark />
      </div>
    </div>
  )
}
