import type { ComponentType } from "react"

/**
 * Builds the gallery's component list from the file system, so a new component shows up as soon
 * as it has a file in src/components/{ui,ghost} and a `<name>-demo.tsx` next to the others.
 */

export type Section = "Components" | "Ghost"

export interface Entry {
  /** kebab-case file name, e.g. "input-otp" */
  id: string
  /** Primary export name, e.g. "InputOTP" */
  name: string
  /** All exports of the component file, e.g. Card, CardHeader, ... */
  exports: string[]
  section: Section
  group: string
  path: string
  Demo: ComponentType | null
  loadCode: (() => Promise<string>) | null
}

const UI_GROUPS: Record<string, string[]> = {
  "Forms & inputs": ["calendar", "checkbox", "combobox", "currency-input", "date-picker", "date-segment", "field", "input", "input-group", "input-otp", "label", "radio-group", "select", "slider", "switch", "textarea", "time-input"],
  Actions: ["button", "button-group", "command", "command-bar", "context-menu", "copy", "dropdown-menu", "menubar", "toggle", "toggle-group"],
  Navigation: ["breadcrumb", "navigation-menu", "pagination", "progress-tabs", "sidebar", "tabs"],
  Overlays: ["alert-dialog", "dialog", "drawer", "focus-modal", "hover-card", "popover", "sheet", "tooltip"],
  Feedback: ["alert", "empty", "inline-tip", "progress", "skeleton", "sonner", "spinner"],
  "Data display": ["accordion", "avatar", "badge", "card", "carousel", "chart", "collapsible", "data-table", "icon-badge", "item", "kbd", "progress-accordion", "table"],
  "Typography & code": ["code", "code-block", "command-snippet", "heading", "text"],
  Layout: ["aspect-ratio", "direction", "resizable", "scroll-area", "separator"],
}

const GHOST_GROUPS: Record<string, string[]> = {
  Cards: ["vehicle-card", "service-card", "bay-card", "part-card", "lead-card", "purchase-order-card", "plan-card", "review-card", "profile-card", "metric-card", "chart-card", "invoice-summary"],
  "Forms & actions": ["auth-card", "mobile-input", "filter-bar", "input-stepper", "color-chip", "radio-card", "time-slots", "stepper"],
  "Layout & navigation": ["page-header", "section-header", "top-bar", "bottom-nav", "fab"],
  "Display & device": ["status-badge", "plate-number", "chat-thread", "status-bar", "home-indicator"],
}

type Module = Record<string, unknown>

const uiModules = import.meta.glob<Module>("../components/ui/*.tsx", { eager: true })
const ghostModules = import.meta.glob<Module>("../components/ghost/*.tsx", { eager: true })
const uiDemos = import.meta.glob<Module>("./demos/*-demo.tsx", { eager: true })
const ghostDemos = import.meta.glob<Module>("./ghost-demos/*-demo.tsx", { eager: true })
const uiCode = import.meta.glob<string>("./demos/*-demo.tsx", { query: "?raw", import: "default" })
const ghostCode = import.meta.glob<string>("./ghost-demos/*-demo.tsx", { query: "?raw", import: "default" })

const fileId = (p: string) => p.split("/").pop()!.replace(/(-demo)?\.tsx$/, "")
const pascal = (id: string) => id.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("")
const isComponent = (v: unknown): v is ComponentType => typeof v === "function" || (typeof v === "object" && v !== null && "$$typeof" in v)

function primaryName(id: string, exports: string[]) {
  const key = id.replace(/-/g, "")
  return exports.find((e) => e.toLowerCase() === key) ?? pascal(id)
}

function demoFor(mod: Module | undefined): ComponentType | null {
  if (!mod) return null
  if (isComponent(mod.default)) return mod.default
  const fn = Object.values(mod).find(isComponent)
  return fn ?? null
}

function groupOf(table: Record<string, string[]>, id: string) {
  return Object.entries(table).find(([, ids]) => ids.includes(id))?.[0] ?? "Other"
}

function build(section: Section, modules: Record<string, Module>, demos: Record<string, Module>, code: Record<string, () => Promise<string>>, groups: Record<string, string[]>, dir: string): Entry[] {
  const demoById = Object.fromEntries(Object.entries(demos).map(([p, m]) => [fileId(p), m]))
  const codeById = Object.fromEntries(Object.entries(code).map(([p, l]) => [fileId(p), l]))
  return Object.entries(modules).map(([p, mod]) => {
    const id = fileId(p)
    const exports = Object.keys(mod).filter((k) => /^[A-Z]/.test(k))
    return {
      id,
      name: primaryName(id, exports),
      exports,
      section,
      group: groupOf(groups, id),
      path: `src/components/${dir}/${id}.tsx`,
      Demo: demoFor(demoById[id]),
      loadCode: codeById[id] ?? null,
    }
  })
}

const order = (table: Record<string, string[]>) => [...Object.keys(table), "Other"]

export const GROUP_ORDER: Record<Section, string[]> = {
  Components: order(UI_GROUPS),
  Ghost: order(GHOST_GROUPS),
}

export const ENTRIES: Entry[] = [
  ...build("Components", uiModules, uiDemos, uiCode, UI_GROUPS, "ui"),
  ...build("Ghost", ghostModules, ghostDemos, ghostCode, GHOST_GROUPS, "ghost"),
].sort((a, b) => {
  if (a.section !== b.section) return a.section === "Components" ? -1 : 1
  const g = GROUP_ORDER[a.section]
  return g.indexOf(a.group) - g.indexOf(b.group) || a.name.localeCompare(b.name)
})
