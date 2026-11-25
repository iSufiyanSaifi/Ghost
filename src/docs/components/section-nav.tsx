import { ComponentIcon, GaugeIcon, PlugIcon, type LucideIcon } from "lucide-react"

import { GHOST_SECTIONS, type GhostSection } from "@/lib/site"
import { cn } from "@/lib/utils"

export const SECTION_ICONS: Record<GhostSection["label"], LucideIcon> = {
  Components: ComponentIcon,
  Integrations: PlugIcon,
  "ERP kit": GaugeIcon,
}

export interface SectionNavProps {
  /** Label of the section this page belongs to. */
  active: GhostSection["label"]
  className?: string
}

/** Switches between the Ghost sites (Components, Integrations, ERP kit). Sits at the top of a side menu. */
export function SectionNav({ active, className }: SectionNavProps) {
  return (
    <nav data-slot="section-nav" aria-label="Switch section" className={cn("flex flex-col gap-0.5 text-sm", className)}>
      {GHOST_SECTIONS.map((section) => {
        const Icon = SECTION_ICONS[section.label]
        const current = section.label === active
        return (
          <a
            key={section.href}
            href={section.href}
            aria-current={current ? "page" : undefined}
            className="flex items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current]:border-border aria-[current]:bg-card aria-[current]:font-medium aria-[current]:text-foreground [&_svg]:size-4"
          >
            <Icon aria-hidden="true" />
            {section.label}
          </a>
        )
      })}
    </nav>
  )
}
