import * as React from "react"
import { ArrowUpRightIcon, ChevronRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { Integration } from "../integrations"
import type { Usage } from "../usage"

/** Stable anchor for an integration card, e.g. "charts-recharts". */
export function integrationAnchor(categoryId: string, pkg: string) {
  return `${categoryId}-${pkg.replace(/^@/, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`
}

export interface IntegrationCardProps {
  categoryId: string
  integration: Integration
  usage: Usage
}

/**
 * One integration as a quiet bordered tile: name, installed version and a chevron. Opening it
 * shows what Ghost uses it for, the components that import it (linked to the gallery) and the
 * library's website. Opens by itself when the page is visited at its anchor.
 */
export function IntegrationCard({ categoryId, integration, usage }: IntegrationCardProps) {
  const anchor = integrationAnchor(categoryId, integration.pkg)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const openIfTargeted = () => {
      if (decodeURIComponent(location.hash.slice(1)) !== anchor) return
      setOpen(true)
      ref.current?.scrollIntoView({ block: "center" })
    }
    openIfTargeted()
    window.addEventListener("hashchange", openIfTargeted)
    return () => window.removeEventListener("hashchange", openIfTargeted)
  }, [anchor])

  const version = usage.version?.replace(/^[\^~]/, "")

  return (
    <Collapsible
      ref={ref}
      id={anchor}
      open={open}
      onOpenChange={setOpen}
      data-slot="integration-card"
      className={cn(
        "scroll-mt-32 rounded-lg border border-border bg-card text-card-foreground transition-colors hover:border-input",
        open && "border-input"
      )}
    >
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <span className="min-w-0 flex-1 truncate">{integration.name}</span>
        {version && (
          <Badge variant="secondary" className="font-mono font-normal">
            v{version}
          </Badge>
        )}
        <ChevronRightIcon
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-3 pt-2.5 pb-3 text-[13px] leading-5">
        <p className="text-muted-foreground">{integration.summary}</p>
        <p className="mt-2 text-muted-foreground">
          <span className="font-medium text-foreground">Used by: </span>
          {usage.viaCn ? (
            "every Ghost component, through the cn() helper"
          ) : usage.components.length > 0 ? (
            usage.components.map((c, i) => (
              <React.Fragment key={c.id}>
                {i > 0 && ", "}
                <a href={`/preview/?c=${c.id}`} className="text-primary underline-offset-4 hover:underline">
                  {c.name}
                </a>
              </React.Fragment>
            ))
          ) : usage.tooling ? (
            "the build and development setup"
          ) : (
            "no component yet"
          )}
        </p>
        <a
          href={integration.homepage}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
        >
          Website
          <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
        </a>
      </CollapsibleContent>
    </Collapsible>
  )
}
