import * as React from "react"
import { BoxIcon, FileTextIcon, HashIcon, LayoutGridIcon } from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type { IntegrationCategory } from "../integrations"
import { DOCS_TABS } from "./docs-top-bar"
import { integrationAnchor } from "./integration-card"

export interface DocsSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: IntegrationCategory[]
}

/** Opens with ⌘K / Ctrl+K or "/" (outside text fields). */
export function useDocsSearchShortcut(setOpen: React.Dispatch<React.SetStateAction<boolean>>) {
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = /^(input|textarea|select)$/i.test((document.activeElement as HTMLElement | null)?.tagName ?? "")
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [setOpen])
}

/** Ghost Docs search: jump to a section, an integration or another Ghost page. */
export function DocsSearch({ open, onOpenChange, categories }: DocsSearchProps) {
  const go = (href: string) => {
    onOpenChange(false)
    if (href.startsWith("#")) {
      // Setting the hash scrolls to the section and opens a targeted integration card. Picking
      // the anchor you're already on doesn't change the hash, so scroll and re-announce it here.
      if (location.hash === href) {
        document.getElementById(href.slice(1))?.scrollIntoView({ block: "start" })
        window.dispatchEvent(new HashChangeEvent("hashchange"))
      } else {
        location.hash = href
      }
    } else {
      location.href = href
    }
  }
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search Ghost docs" description="Find an integration, a section or a page">
      {/* CommandDialog is only the dialog; the searchable list needs its own Command root. */}
      <Command>
        <CommandInput placeholder="Search integrations, sections and pages…" />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Integrations">
            {categories.flatMap((category) =>
              category.items.map((item) => (
                <CommandItem
                  key={item.pkg}
                  value={`${item.name} ${item.pkg} ${category.title}`}
                  onSelect={() => go(`#${integrationAnchor(category.id, item.pkg)}`)}
                >
                  <BoxIcon />
                  {item.name}
                  <span className="ml-auto text-xs text-muted-foreground">{category.title}</span>
                </CommandItem>
              ))
            )}
          </CommandGroup>
          <CommandGroup heading="Sections">
            {categories.map((category) => (
              <CommandItem key={category.id} value={`section ${category.title}`} onSelect={() => go(`#${category.id}`)}>
                <HashIcon />
                {category.title}
              </CommandItem>
            ))}
            <CommandItem value="section add your own integration" onSelect={() => go("#add-your-own")}>
              <FileTextIcon />
              Add your own integration
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Ghost pages">
            {DOCS_TABS.map((tab) => (
              <CommandItem key={tab.href} value={`page ${tab.label}`} onSelect={() => go(tab.href)}>
                <LayoutGridIcon />
                {tab.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
