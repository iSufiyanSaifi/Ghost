import * as React from "react"
import { InfoIcon } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DocsFeedback } from "../components/docs-feedback"
import { DocsSearch, useDocsSearchShortcut } from "../components/docs-search"
import { DocsSidebar } from "../components/docs-sidebar"
import { DocsToc, useActiveSection, type TocItem } from "../components/docs-toc"
import { DocsTopBar } from "../components/docs-top-bar"
import { IntegrationCard } from "../components/integration-card"
import { SectionHeading } from "../components/section-heading"
import { CATEGORIES, GHOST_REPO, PAGE } from "../integrations"
import { usageOf, type Usage } from "../usage"

const USAGE: Record<string, Usage> = Object.fromEntries(
  CATEGORIES.flatMap((category) => category.items.map((item) => [item.pkg, usageOf(item.pkg)]))
)

const ADD_YOUR_OWN = { id: "add-your-own", title: "Add your own integration" }
const TOC: TocItem[] = [...CATEGORIES.map(({ id, title }) => ({ id, title })), ADD_YOUR_OWN]
const SECTION_IDS = TOC.map((item) => item.id)

const INTRO = [
  "Ghost is built on a small set of open-source libraries. Each does one job well (accessible primitives, styling, icons, charts, dates) and Ghost wraps it with the Ghost look and the Ghost design rules, so screens use Ghost components rather than the libraries directly.",
  "This page lists every integration already in Ghost, what it is used for and which components rely on it. To bring in another library, follow Add your own integration at the end.",
]
const NOTE =
  "Versions and the Used by lists are read from package.json and the component source, so they always match the code you are running."

const STEPS: React.ReactNode[] = [
  <>
    Install the library with <code className="rounded-sm bg-muted px-1 font-mono text-[13px]">npm install &lt;package&gt;</code>.
  </>,
  <>
    Wrap it in a Ghost component: <code className="rounded-sm bg-muted px-1 font-mono text-[13px]">src/components/ui</code> for
    general parts, <code className="rounded-sm bg-muted px-1 font-mono text-[13px]">src/components/ghost</code> for Ghost-specific
    ones. Style it with theme utilities and <code className="rounded-sm bg-muted px-1 font-mono text-[13px]">cn()</code>, never hex
    colours.
  </>,
  <>
    Add a demo named <code className="rounded-sm bg-muted px-1 font-mono text-[13px]">&lt;name&gt;-demo.tsx</code> next to the others in{" "}
    <code className="rounded-sm bg-muted px-1 font-mono text-[13px]">src/preview</code> so it appears in the Components gallery.
  </>,
  <>
    List it in <code className="rounded-sm bg-muted px-1 font-mono text-[13px]">{PAGE.sourceFile}</code> with a one-line summary. Its
    version and Used by list fill in by themselves.
  </>,
  <>
    Run <code className="rounded-sm bg-muted px-1 font-mono text-[13px]">npm run check</code> before committing. It catches pill shapes,
    strokes thicker than 1px and type errors.
  </>,
]

function pageMarkdown() {
  const lines = [`# Ghost ${PAGE.title}`, "", ...INTRO.flatMap((p) => [p, ""]), `> ${NOTE}`, ""]
  for (const category of CATEGORIES) {
    lines.push(`## ${category.title}`, "", category.description, "")
    for (const item of category.items) {
      const usage = USAGE[item.pkg]
      const users = usage.viaCn
        ? "every component (cn helper)"
        : usage.components.map((c) => c.name).join(", ") || (usage.tooling ? "build and development setup" : "no component yet")
      lines.push(`- **${item.name}** (\`${item.pkg}\`${usage.version ? ` ${usage.version}` : ""}): ${item.summary} Used by: ${users}.`)
    }
    lines.push("", category.extend, "")
  }
  lines.push(`## ${ADD_YOUR_OWN.title}`, "")
  lines.push(
    "1. Install the library with `npm install <package>`.",
    "2. Wrap it in a Ghost component in `src/components/ui` or `src/components/ghost`, styled with theme utilities and `cn()`.",
    "3. Add a `<name>-demo.tsx` in `src/preview` so it appears in the Components gallery.",
    `4. List it in \`${PAGE.sourceFile}\`; version and Used by fill in by themselves.`,
    "5. Run `npm run check` before committing."
  )
  return lines.join("\n")
}

const edited = new Date(`${PAGE.edited}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
const code = "rounded-sm bg-muted px-1 font-mono text-[13px]"

export function App() {
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  const active = useActiveSection(SECTION_IDS)
  const sidebarActive = active === ADD_YOUR_OWN.id ? null : active
  const markdown = React.useMemo(pageMarkdown, [])
  useDocsSearchShortcut(setSearchOpen)

  return (
    <TooltipProvider>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-card px-3 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:ring-3 focus:ring-ring/50"
      >
        Skip to content
      </a>
      <DocsTopBar active="Integrations" onOpenSearch={() => setSearchOpen(true)} onOpenMenu={() => setMenuOpen(true)} />

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="sticky top-[100px] hidden h-[calc(100svh-100px)] w-64 shrink-0 overflow-y-auto border-r border-border px-3 py-6 lg:block">
          <DocsSidebar categories={CATEGORIES} activeId={sidebarActive} />
        </aside>

        <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-12">
          <article className="mx-auto max-w-3xl">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/docs/integrations/">Ghost Docs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{PAGE.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1 id="overview" className="mt-4 scroll-mt-32 text-3xl leading-10 font-semibold tracking-tight">
              {PAGE.title}
            </h1>
            <div className="mt-4 flex flex-col gap-3 text-[15px] leading-7 text-secondary-foreground">
              {INTRO.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Alert className="mt-6">
              <InfoIcon />
              <AlertDescription>
                <span>
                  <strong className="font-medium text-foreground">Note:</strong> {NOTE}
                </span>
              </AlertDescription>
            </Alert>

            {CATEGORIES.map((category) => (
              <section key={category.id} aria-labelledby={category.id} className="mt-12 border-t border-border pt-10">
                <SectionHeading id={category.id}>{category.title}</SectionHeading>
                <p className="mt-2 text-[15px] leading-7 text-secondary-foreground">{category.description}</p>
                <div className="mt-5 grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
                  {category.items.map((item) => (
                    <IntegrationCard key={item.pkg} categoryId={category.id} integration={item} usage={USAGE[item.pkg]} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {category.extend}{" "}
                  <a href={`#${ADD_YOUR_OWN.id}`} className="text-primary underline-offset-4 hover:underline">
                    Add your own integration
                  </a>
                </p>
              </section>
            ))}

            <section aria-labelledby={ADD_YOUR_OWN.id} className="mt-12 border-t border-border pt-10">
              <SectionHeading id={ADD_YOUR_OWN.id}>{ADD_YOUR_OWN.title}</SectionHeading>
              <p className="mt-2 text-[15px] leading-7 text-secondary-foreground">
                Every library in Ghost is reached through a Ghost component, so screens keep one look and one set of rules.
                To add another:
              </p>
              <ol className="mt-4 flex flex-col gap-3">
                {STEPS.map((step, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-7 text-secondary-foreground">
                    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-md border border-border bg-card text-xs font-medium text-foreground tabular-nums">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            <footer className="mt-14 flex flex-col gap-4">
              <Separator />
              <DocsFeedback page={`Ghost ${PAGE.title}`} repo={GHOST_REPO} />
              <p className="text-[13px] text-muted-foreground">
                Edited {edited} ·{" "}
                <a
                  href={`${GHOST_REPO}/edit/main/${PAGE.sourceFile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Edit this page
                </a>
                {" "}· Data in <code className={code}>{PAGE.sourceFile}</code>
              </p>
            </footer>
          </article>
        </main>

        <div className="sticky top-[100px] hidden h-[calc(100svh-100px)] w-60 shrink-0 overflow-y-auto py-8 pr-4 xl:block">
          <DocsToc
            items={TOC}
            activeId={active}
            markdown={markdown}
            sourceUrl={`${GHOST_REPO}/blob/main/${PAGE.sourceFile}`}
            whatsNew={PAGE.whatsNew}
          />
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Ghost Docs</SheetTitle>
            <SheetDescription>Integrations</SheetDescription>
          </SheetHeader>
          <DocsSidebar categories={CATEGORIES} activeId={sidebarActive} onNavigate={() => setMenuOpen(false)} className="px-2 pb-6" />
        </SheetContent>
      </Sheet>
      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} categories={CATEGORIES} />
    </TooltipProvider>
  )
}
