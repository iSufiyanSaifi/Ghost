"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Copy } from "@/components/ui/copy"

/** A single-line shell command with a copy button. Compose CommandSnippetCode + CommandSnippetCopy. */
function CommandSnippet({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-snippet"
      className={cn(
        "flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-border bg-muted/40 pr-1 pl-3",
        className
      )}
      {...props}
    />
  )
}

/** Optional prompt marker shown before the command, `$` by default. */
function CommandSnippetPrompt({ className, children = "$", ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-snippet-prompt"
      aria-hidden="true"
      className={cn("shrink-0 font-mono text-sm text-muted-foreground select-none", className)}
      {...props}
    >
      {children}
    </span>
  )
}

/** The command text. Scrolls horizontally rather than wrapping. */
function CommandSnippetCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="command-snippet-code"
      className={cn(
        "min-w-0 flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap text-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Copy button pinned to the end of the row. */
function CommandSnippetCopy({ className, ...props }: React.ComponentProps<typeof Copy>) {
  return <Copy data-slot="command-snippet-copy" className={cn("ml-auto shrink-0", className)} {...props} />
}

export { CommandSnippet, CommandSnippetPrompt, CommandSnippetCode, CommandSnippetCopy }
