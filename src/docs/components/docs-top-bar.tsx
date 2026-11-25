import { BugIcon, ChevronDownIcon, GithubIcon, MenuIcon, MoonIcon, RulerIcon, SearchIcon, SunIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Kbd } from "@/components/ui/kbd"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import avatarUrl from "../../../assets/ghost-avatar.svg"
import { GHOST_REPO } from "../integrations"
import { GHOST_VERSION } from "../usage"

export interface DocsTab {
  label: string
  href: string
}

export const DOCS_TABS: DocsTab[] = [
  { label: "Components", href: "/preview/" },
  { label: "Integrations", href: "/docs/integrations/" },
  { label: "ERP kit", href: "/ui_kits/erp/" },
]

export interface DocsTopBarProps {
  /** Label of the current tab, e.g. "Integrations". */
  active: string
  onOpenSearch: () => void
  onOpenMenu: () => void
}

/** Ghost Docs header: brand, version, help, search, theme switch, and the section tabs. */
export function DocsTopBar({ active, onOpenSearch, onOpenMenu }: DocsTopBarProps) {
  const { theme, setTheme } = useTheme()
  return (
    <header data-slot="docs-top-bar" className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMenu} aria-label="Open navigation">
          <MenuIcon />
        </Button>
        <a href="/docs/integrations/" className="flex items-center gap-2 rounded-md font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <img src={avatarUrl} alt="" className="size-7" />
          <span>Ghost</span>
          <span className="font-normal text-muted-foreground">Docs</span>
        </a>
        <Badge variant="outline" className="hidden font-mono sm:inline-flex">
          v{GHOST_VERSION}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Help
              <ChevronDownIcon data-icon="inline-end" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <a href={GHOST_REPO} target="_blank" rel="noreferrer">
                <GithubIcon />
                Ghost on GitHub
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`${GHOST_REPO}/issues/new`} target="_blank" rel="noreferrer">
                <BugIcon />
                Report an issue
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`${GHOST_REPO}#design-rules-enforced`} target="_blank" rel="noreferrer">
                <RulerIcon />
                Design rules
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onOpenSearch}
            className="hidden w-64 justify-start text-muted-foreground md:inline-flex"
            aria-label="Search Ghost docs"
          >
            <SearchIcon data-icon="inline-start" />
            Search docs…
            <Kbd className="ml-auto">⌘K</Kbd>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenSearch} aria-label="Search Ghost docs">
            <SearchIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
      </div>
      <nav aria-label="Ghost sections" className="flex h-11 items-center gap-1 overflow-x-auto px-2 lg:px-4">
        {DOCS_TABS.map((tab) => {
          const current = tab.label === active
          return (
            <a
              key={tab.href}
              href={tab.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "relative flex h-full shrink-0 items-center px-3 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                current && "font-medium text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-xs after:bg-primary"
              )}
            >
              {tab.label}
            </a>
          )
        })}
      </nav>
    </header>
  )
}
