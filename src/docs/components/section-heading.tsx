import * as React from "react"
import { LinkIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SectionHeadingProps extends React.ComponentProps<"h2"> {
  /** Anchor id; the heading shows a copyable # link on hover. */
  id: string
}

/** Ghost Docs section heading with a hover anchor link. */
export function SectionHeading({ id, className, children, ...props }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      data-slot="docs-section-heading"
      className={cn("group flex scroll-mt-32 items-center gap-2 text-xl leading-7 font-semibold", className)}
      {...props}
    >
      {children}
      <a
        href={`#${id}`}
        aria-label={`Link to ${typeof children === "string" ? children : "this section"}`}
        className="rounded-sm text-muted-foreground opacity-0 outline-none group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <LinkIcon className="size-4" aria-hidden="true" />
      </a>
    </h2>
  )
}
