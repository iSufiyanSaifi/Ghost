import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { IntegrationCategory } from "../integrations"
import { integrationAnchor } from "./integration-card"

export interface DocsSidebarProps {
  categories: IntegrationCategory[]
  /** Category id currently in view. */
  activeId: string | null
  /** Called after a link is chosen (used to close the mobile sheet). */
  onNavigate?: () => void
  className?: string
}

/** Ghost Docs left navigation: an Overview link, then one collapsible group per category. */
export function DocsSidebar({ categories, activeId, onNavigate, className }: DocsSidebarProps) {
  return (
    <nav data-slot="docs-sidebar" aria-label="Integrations" className={cn("flex flex-col gap-1 text-sm", className)}>
      <a
        href="#overview"
        onClick={onNavigate}
        aria-current={activeId === null ? "true" : undefined}
        className="rounded-lg border border-transparent px-3 py-1.5 font-medium text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current]:border-border aria-[current]:bg-card aria-[current]:text-foreground"
      >
        Overview
      </a>
      {categories.map((category) => (
        <SidebarGroup key={category.id} category={category} active={activeId === category.id} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}

function SidebarGroup({
  category,
  active,
  onNavigate,
}: {
  category: IntegrationCategory
  active: boolean
  onNavigate?: () => void
}) {
  const [open, setOpen] = React.useState(true)
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t border-border pt-2 first-of-type:mt-2">
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
          active && "text-foreground"
        )}
      >
        {category.title}
        <ChevronDownIcon className={cn("size-3.5 transition-transform", !open && "-rotate-90")} aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col pb-1">
        {category.items.map((item) => (
          <a
            key={item.pkg}
            href={`#${integrationAnchor(category.id, item.pkg)}`}
            onClick={onNavigate}
            className="rounded-lg px-3 py-1.5 text-foreground/80 outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {item.name}
          </a>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
