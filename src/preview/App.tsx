import * as React from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  GithubIcon,
  LayoutGridIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  XIcon,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Code } from "@/components/ui/code"
import { CodeBlock, CodeBlockBody, CodeBlockHeader } from "@/components/ui/code-block"
import { Copy } from "@/components/ui/copy"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Toaster } from "@/components/ui/sonner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import { GHOST_REPO } from "@/lib/site"
import avatarUrl from "../../assets/ghost-avatar.svg"
import { ENTRIES, GROUP_ORDER, type Entry, type Section } from "./registry"

type Filter = "All" | Section
const SECTIONS: Section[] = ["Components", "Ghost"]
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-")
const BY_ID = new Map(ENTRIES.map((e) => [e.id, e]))

/* ------------------------------------------------------------------ routing */

/** Overview at /preview/, one component per page at /preview/?c=<id>. Old #<id> links still work. */
function readRoute(): string | null {
  const id = new URLSearchParams(location.search).get("c")
  if (id && BY_ID.has(id)) return id
  const hash = decodeURIComponent(location.hash.slice(1))
  if (hash && BY_ID.has(hash)) {
    history.replaceState(null, "", `${location.pathname}?c=${hash}`)
    return hash
  }
  return null
}

const pageHref = (id: string | null) => (id ? `${location.pathname}?c=${id}` : location.pathname)

function useRoute() {
  const [current, setCurrent] = React.useState<string | null>(readRoute)
  React.useEffect(() => {
    const onPop = () => setCurrent(readRoute())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])
  const navigate = React.useCallback((id: string | null) => {
    history.pushState(null, "", pageHref(id))
    setCurrent(id)
    window.scrollTo({ top: 0 })
  }, [])
  return { current: current ? BY_ID.get(current) ?? null : null, navigate }
}

/** A real link (so it can open in a new tab) that navigates in place on a normal click. */
function PageLink({
  to,
  navigate,
  ...props
}: Omit<React.ComponentProps<"a">, "href"> & { to: string | null; navigate: (id: string | null) => void }) {
  return (
    <a
      href={pageHref(to)}
      {...props}
      onClick={(event) => {
        props.onClick?.(event)
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        navigate(to)
      }}
    />
  )
}

/* ------------------------------------------------------------------ shared */

class Boundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return <p className="font-mono text-xs text-error-text">Couldn’t render: {this.state.error.message}</p>
    }
    return this.props.children
  }
}

function Demo({ entry }: { entry: Entry }) {
  return entry.Demo ? (
    <Boundary>
      <entry.Demo />
    </Boundary>
  ) : (
    <p className="text-sm text-muted-foreground">No demo yet</p>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

/* ------------------------------------------------------------------ sidebar */

function ComponentNav({
  current,
  navigate,
  onNavigate,
}: {
  current: Entry | null
  navigate: (id: string | null) => void
  onNavigate?: () => void
}) {
  const [filter, setFilter] = React.useState("")
  const listRef = React.useRef<HTMLDivElement>(null)
  const needle = filter.trim().toLowerCase()
  const go = (id: string | null) => {
    navigate(id)
    onNavigate?.()
  }

  // Keep the current component visible in a long list.
  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>("[aria-current=page]")?.scrollIntoView({ block: "nearest" })
  }, [current])

  const link =
    "flex items-center rounded-lg px-2 py-1.5 text-sm text-secondary-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-foreground"

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <InputGroup className="h-9 shrink-0">
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput
          data-component-filter
          type="search"
          placeholder="Filter components…"
          aria-label="Filter components"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setFilter("")}
        />
      </InputGroup>
      <nav ref={listRef} aria-label="Components" className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-6">
        <PageLink to={null} navigate={go} aria-current={current ? undefined : "page"} className={cn(link, "gap-2")}>
          <LayoutGridIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          Overview
        </PageLink>
        {SECTIONS.map((section) => (
          <div key={section}>
            <p className="px-2 pt-5 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{section}</p>
            {GROUP_ORDER[section].map((group) => {
              const items = ENTRIES.filter(
                (e) => e.section === section && e.group === group && (!needle || e.name.toLowerCase().includes(needle) || e.id.includes(needle))
              )
              if (items.length === 0) return null
              return (
                <div key={group} className="pt-2">
                  <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">{group}</p>
                  {items.map((e) => (
                    <PageLink key={e.id} to={e.id} navigate={go} aria-current={current?.id === e.id ? "page" : undefined} className={link}>
                      {e.name}
                    </PageLink>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
        {needle && !ENTRIES.some((e) => e.name.toLowerCase().includes(needle) || e.id.includes(needle)) && (
          <p className="px-2 pt-4 text-sm text-muted-foreground">No components match “{filter}”.</p>
        )}
      </nav>
    </div>
  )
}

/* ------------------------------------------------------------------ overview */

const Tile = React.memo(function Tile({ entry, navigate }: { entry: Entry; navigate: (id: string | null) => void }) {
  const others = entry.exports.filter((e) => e !== entry.name)
  return (
    <article id={entry.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
      <header className="flex items-start gap-2 px-4 pt-4 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] leading-5 font-semibold" title={entry.name}>
            <PageLink to={entry.id} navigate={navigate} className="rounded-sm outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50">
              {entry.name}
            </PageLink>
          </h3>
          <p className="mt-0.5 truncate font-mono text-[11px] leading-4 text-muted-foreground" title={entry.path}>
            {entry.path}
          </p>
          {/* Always one line (empty when there are no other exports) so every tile header is the same height. */}
          <p className="mt-1 truncate font-mono text-[11px] leading-4 text-muted-foreground" title={others.join(", ") || undefined}>
            {others.length > 0 ? `+ ${others.join(", ")}` : " "}
          </p>
        </div>
      </header>
      {/* Fixed height keeps the grid aligned; larger demos scroll inside. transform keeps
          position:fixed demo content (sidebar, FAB) inside the stage. */}
      <div
        className={cn(
          "relative mx-4 flex h-64 transform-gpu overflow-auto rounded-lg border border-dashed border-border bg-background",
          entry.id === "sidebar" ? "items-stretch p-0" : "p-6 [&>*]:m-auto"
        )}
      >
        <Demo entry={entry} />
      </div>
      <div className="mt-auto px-4 py-2.5">
        <PageLink
          to={entry.id}
          navigate={navigate}
          aria-label={`Open ${entry.name} page`}
          className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Open page
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </PageLink>
      </div>
    </article>
  )
})

function Overview({ navigate }: { navigate: (id: string | null) => void }) {
  const [query, setQuery] = React.useState(() => new URLSearchParams(location.search).get("q") ?? "")
  const [filter, setFilter] = React.useState<Filter>("All")
  const search = React.useRef<HTMLInputElement>(null)
  const deferred = React.useDeferredValue(query)
  const needle = deferred.trim().toLowerCase()
  const shown = ENTRIES.filter(
    (e) =>
      (filter === "All" || e.section === filter) &&
      (!needle || e.name.toLowerCase().includes(needle) || e.id.includes(needle) || e.exports.some((x) => x.toLowerCase().includes(needle)))
  )
  const groups = SECTIONS.flatMap((section) =>
    GROUP_ORDER[section].map((group) => ({
      key: `${section}-${group}`,
      section,
      group,
      items: shown.filter((e) => e.section === section && e.group === group),
    }))
  )

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-4 md:px-8">
        <div className="mr-auto">
          <h1 className="text-xl leading-7 font-semibold">Components</h1>
          <p className="text-[13px] text-muted-foreground" aria-live="polite">
            Showing {shown.length} of {ENTRIES.length} · open any component for its own page
          </p>
        </div>
        <InputGroup className="w-full bg-card sm:w-80">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            ref={search}
            data-overview-search
            type="search"
            placeholder="Search by name…"
            aria-label="Search components by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          />
          <InputGroupAddon align="inline-end">
            {query && (
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("")
                  search.current?.focus()
                }}
              >
                <XIcon />
              </InputGroupButton>
            )}
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <ToggleGroup type="single" variant="outline" value={filter} onValueChange={(v) => v && setFilter(v as Filter)} aria-label="Show section">
          {(["All", ...SECTIONS] as Filter[]).map((f) => (
            <ToggleGroupItem key={f} value={f}>
              {f}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="px-4 pt-2 pb-16 md:px-8">
        {shown.length === 0 && <p className="py-16 text-center text-sm text-muted-foreground">No components match “{query}”.</p>}
        {groups
          .filter((g) => g.items.length)
          .map((g) => (
            <section key={g.key} id={`g-${slug(g.key)}`} className="scroll-mt-20 pt-6" aria-labelledby={`h-${slug(g.key)}`}>
              <h2 id={`h-${slug(g.key)}`} className="mb-3 flex items-baseline gap-2 text-base font-semibold">
                {g.group}
                <span className="text-[13px] font-normal text-muted-foreground">
                  {g.section} · {g.items.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {g.items.map((e) => (
                  <Tile key={`${e.section}-${e.id}`} entry={e} navigate={navigate} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ component page */

function DemoSource({ entry }: { entry: Entry }) {
  const [code, setCode] = React.useState<string | null>(null)
  React.useEffect(() => {
    let alive = true
    setCode(null)
    entry.loadCode?.().then(
      (source) => alive && setCode(source.trimEnd()),
      () => alive && setCode("// Could not load the demo source.")
    )
    return () => {
      alive = false
    }
  }, [entry])
  if (!entry.loadCode) return null
  if (code === null) return <Skeleton className="h-48 w-full rounded-xl" />
  return (
    <CodeBlock snippets={[{ label: `${entry.id}-demo.tsx`, language: "tsx", code }]}>
      <CodeBlockHeader />
      <CodeBlockBody className="max-h-[520px] overflow-auto" />
    </CodeBlock>
  )
}

function ComponentPage({ entry, navigate }: { entry: Entry; navigate: (id: string | null) => void }) {
  const index = ENTRIES.indexOf(entry)
  const prev = ENTRIES[index - 1]
  const next = ENTRIES[index + 1]
  const importPath = entry.path.replace(/^src\//, "@/").replace(/\.tsx$/, "")
  // Only real exports go in the import line: some files are named for what they are (e.g. "Chart")
  // but export differently named parts (ChartContainer, ChartTooltip…).
  const names = entry.exports.includes(entry.name)
    ? [entry.name, ...entry.exports.filter((e) => e !== entry.name)]
    : entry.exports
  const importLine = `import { ${names.length > 4 ? `${names[0]}, …` : names.join(", ")} } from "${importPath}"`
  const fullImport = `import { ${names.join(", ")} } from "${importPath}"`

  React.useEffect(() => {
    document.title = `${entry.name} · Ghost Components`
    return () => {
      document.title = "Ghost Components"
    }
  }, [entry])

  return (
    <article className="mx-auto w-full max-w-5xl px-4 pt-6 pb-16 md:px-8" aria-labelledby="component-title">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <PageLink to={null} navigate={navigate}>
                Components
              </PageLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{entry.section === "Ghost" ? `Ghost · ${entry.group}` : entry.group}</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{entry.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 id="component-title" className="mt-3 text-3xl leading-10 font-semibold tracking-tight">
        {entry.name}
      </h1>
      <p className="mt-1 font-mono text-[13px] text-muted-foreground">{entry.path}</p>

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-card py-1.5 pr-1.5 pl-3">
        <code className="min-w-0 flex-1 truncate font-mono text-[13px]" title={fullImport}>
          {importLine}
        </code>
        <Copy content={fullImport} aria-label="Copy import" />
      </div>

      {entry.exports.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
          <span>Exports:</span>
          {entry.exports.map((name) => (
            <Code key={name}>{name}</Code>
          ))}
        </div>
      )}

      <section aria-label="Preview" className="mt-8">
        <h2 className="mb-3 text-base font-semibold">Preview</h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* transform keeps position:fixed demo content (FAB, command bar) inside the preview. */}
          <div
            className={cn(
              "relative flex min-h-[440px] transform-gpu overflow-auto bg-background",
              entry.id === "sidebar" ? "h-[600px] items-stretch" : "p-8 sm:p-12 [&>*]:m-auto"
            )}
          >
            <Demo key={entry.id} entry={entry} />
          </div>
        </div>
      </section>

      <section aria-label="Code" className="mt-8">
        <h2 className="mb-3 text-base font-semibold">Code</h2>
        <DemoSource entry={entry} />
      </section>

      <nav aria-label="More components" className="mt-12 grid grid-cols-2 gap-3 border-t border-border pt-6">
        {prev ? (
          <PageLink
            to={prev.id}
            navigate={navigate}
            className="group flex flex-col rounded-lg border border-border bg-card px-4 py-3 outline-none hover:border-input focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeftIcon className="size-3.5" aria-hidden="true" /> Previous
            </span>
            <span className="mt-0.5 font-medium group-hover:text-primary">{prev.name}</span>
          </PageLink>
        ) : (
          <span />
        )}
        {next && (
          <PageLink
            to={next.id}
            navigate={navigate}
            className="group flex flex-col items-end rounded-lg border border-border bg-card px-4 py-3 text-right outline-none hover:border-input focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              Next <ArrowRightIcon className="size-3.5" aria-hidden="true" />
            </span>
            <span className="mt-0.5 font-medium group-hover:text-primary">{next.name}</span>
          </PageLink>
        )}
      </nav>
    </article>
  )
}

/* ------------------------------------------------------------------ app */

export function App() {
  const { current, navigate } = useRoute()
  const [menuOpen, setMenuOpen] = React.useState(false)

  // "/" focuses the search on the overview, or the component filter on a component page.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase()
      if (e.key !== "/" || ["input", "textarea", "select"].includes(tag)) return
      const target =
        document.querySelector<HTMLInputElement>("[data-overview-search]") ??
        document.querySelector<HTMLInputElement>("aside [data-component-filter]")
      if (target) {
        e.preventDefault()
        target.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <TooltipProvider>
      <div className="grid min-h-svh grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)]">
        <aside
          className="sticky top-0 hidden h-svh flex-col gap-4 border-r border-border bg-sidebar px-3 py-5 md:flex"
          aria-label="Component list"
        >
          <PageLink to={null} navigate={navigate} className="flex items-center gap-2.5 rounded-lg px-2 text-[15px] font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <img src={avatarUrl} alt="" className="size-7" />
            Ghost
            <span className="font-normal text-muted-foreground">Components</span>
          </PageLink>
          <ComponentNav current={current} navigate={navigate} />
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Open component list">
              <MenuIcon />
            </Button>
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              {current ? (
                <>
                  <PageLink to={null} navigate={navigate} className="hover:text-foreground">
                    Components
                  </PageLink>
                  <span aria-hidden="true"> / </span>
                  <span className="font-medium text-foreground">{current.name}</span>
                </>
              ) : (
                <span className="font-medium text-foreground">Overview</span>
              )}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <a href="/docs/integrations/">
                  Integrations
                  <ArrowUpRightIcon data-icon="inline-end" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={GHOST_REPO} target="_blank" rel="noreferrer" aria-label="Ghost on GitHub" title="Ghost on GitHub">
                  <GithubIcon />
                </a>
              </Button>
              <ThemeToggle />
            </div>
          </header>

          {current ? <ComponentPage key={current.id} entry={current} navigate={navigate} /> : <Overview navigate={navigate} />}
        </main>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="flex w-80 flex-col gap-3 px-3 pb-0">
          <SheetHeader className="px-2">
            <SheetTitle>Ghost Components</SheetTitle>
            <SheetDescription>{ENTRIES.length} components</SheetDescription>
          </SheetHeader>
          <ComponentNav current={current} navigate={navigate} onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>
      <Toaster />
    </TooltipProvider>
  )
}
