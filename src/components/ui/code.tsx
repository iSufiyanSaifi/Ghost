import * as React from "react"
import { cn } from "@/lib/utils"

/** Inline code, for identifiers, keys and short values inside running text. */
function Code({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="code"
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-px font-mono text-xs text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Code }
