import * as React from "react"

import { FAB } from "@/components/ghost/fab"

export default function FABDemo() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-4">
        <FAB className="static" onClick={() => setCount((c) => c + 1)} />
        <FAB className="static" label="New order" onClick={() => setCount((c) => c + 1)} />
      </div>
      <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
        Draft orders created: {count}
      </p>
    </div>
  )
}
