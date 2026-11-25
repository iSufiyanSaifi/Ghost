import * as React from "react"
import { CheckIcon, ChevronDownIcon, CopyIcon, FileTextIcon, GithubIcon, SparklesIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export interface TocItem {
  id: string
  title: string
}

/**
 * Tracks which section is being read: the last heading that has scrolled past the top bar.
 * Returns null while the reader is above the first section (the overview).
 */
export function useActiveSection(ids: string[], offset = 140) {
  const [active, setActive] = React.useState<string | null>(null)
  React.useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let current: string | null = null
        for (const id of ids) {
          const el = document.getElementById(id)
          if (el && el.getBoundingClientRect().top - offset <= 0) current = id
        }
        // At the very bottom, the last section is the one being read.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) current = ids[ids.length - 1] ?? current
        setActive(current)
      })
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ids, offset])
  return active
}

export interface DocsTocProps {
  items: TocItem[]
  activeId: string | null
  /** Markdown version of the page, for "Copy as Markdown". */
  markdown: string
  /** GitHub URL of the file that holds this page's content. */
  sourceUrl: string
  whatsNew: { title: string; body: string; href: string }
}

/** Ghost Docs right rail: "On this page", shortcuts and what's new. */
export function DocsToc({ items, activeId, markdown, sourceUrl, whatsNew }: DocsTocProps) {
  const listRef = React.useRef<HTMLUListElement>(null)

  // Keep the active entry visible when the list is taller than the rail.
  React.useEffect(() => {
    if (!activeId) return
    listRef.current
      ?.querySelector<HTMLElement>(`a[href="#${CSS.escape(activeId)}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [activeId])

  return (
    <aside data-slot="docs-toc" aria-label="On this page" className="flex flex-col gap-4 text-sm">
      <div>
        <p className="px-3 pb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">On this page</p>
        <ul ref={listRef} className="max-h-[50vh] overflow-y-auto border-l border-border">
          {items.map((item) => {
            const current = item.id === activeId
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current ? "location" : undefined}
                  className={cn(
                    "-ml-px block border-l border-transparent py-1 pr-2 pl-3 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                    current && "border-primary font-medium text-foreground"
                  )}
                >
                  {item.title}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
      <Shortcuts markdown={markdown} sourceUrl={sourceUrl} />
      <a
        href={whatsNew.href}
        className="flex gap-2.5 rounded-lg border border-border bg-card p-3 outline-none hover:border-input focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <SparklesIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <span className="min-w-0">
          <span className="block text-xs font-medium tracking-wide text-muted-foreground uppercase">What's new</span>
          <span className="mt-1 block font-medium">{whatsNew.title}</span>
          <span className="mt-0.5 block text-[13px] leading-5 text-muted-foreground">{whatsNew.body}</span>
        </span>
      </a>
    </aside>
  )
}

function Shortcuts({ markdown, sourceUrl }: { markdown: string; sourceUrl: string }) {
  const [open, setOpen] = React.useState(true)
  const [copied, setCopied] = React.useState<"link" | "markdown" | null>(null)
  const copy = async (what: "link" | "markdown") => {
    try {
      await navigator.clipboard.writeText(what === "link" ? location.href.split("#")[0] : markdown)
      setCopied(what)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      // Clipboard can be blocked (insecure context or permissions); nothing else to do.
    }
  }
  const row =
    "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4"
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="border-t border-border pt-3">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-3 pb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        Shortcuts
        <ChevronDownIcon className={cn("size-3.5 transition-transform", !open && "-rotate-90")} aria-hidden="true" />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col">
        <button type="button" className={row} onClick={() => copy("link")}>
          {copied === "link" ? <CheckIcon /> : <CopyIcon />}
          {copied === "link" ? "Link copied" : "Copy page link"}
        </button>
        <button type="button" className={row} onClick={() => copy("markdown")}>
          {copied === "markdown" ? <CheckIcon /> : <FileTextIcon />}
          {copied === "markdown" ? "Markdown copied" : "Copy as Markdown"}
        </button>
        <a className={row} href={sourceUrl} target="_blank" rel="noreferrer">
          <GithubIcon />
          View source
        </a>
      </CollapsibleContent>
    </Collapsible>
  )
}
