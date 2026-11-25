import { StatusBar } from "@/components/ghost/status-bar"

export default function StatusBarDemo() {
  return (
    <div className="grid max-w-sm gap-3">
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <StatusBar battery={64} />
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <StatusBar dark battery={15} signal={2} time="18:05" />
      </div>
    </div>
  )
}
