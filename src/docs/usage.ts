import pkg from "../../package.json"

/**
 * Works out which Ghost components use each package by reading their source, so the
 * Integrations page can't drift from the code. Libraries imported by the shared `cn()` helper
 * (src/lib/utils.ts) are used by every component.
 */

const sources = import.meta.glob<string>(["../components/**/*.{ts,tsx}", "../lib/*.ts"], {
  query: "?raw",
  import: "default",
  eager: true,
})

export interface ComponentRef {
  /** kebab-case id, matches the gallery anchor and ?q= search. */
  id: string
  /** Display name, e.g. "DropdownMenu". */
  name: string
  section: "ui" | "ghost"
}

export interface Usage {
  /** Installed version range from package.json, e.g. "1.4.3" or "^4.3.0". */
  version: string | null
  components: ComponentRef[]
  /** True when the package is used through the shared cn() helper, i.e. by every component. */
  viaCn: boolean
  /** True for build tooling that no component imports directly. */
  tooling: boolean
}

const pascal = (id: string) => id.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("")
const importsPackage = (source: string, name: string) =>
  new RegExp(`from\\s+["']${name.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}["']`).test(source)

const TOOLING = new Set(["react", "typescript", "vite", "tailwindcss", "tw-animate-css"])

const versions: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies }

export function usageOf(name: string): Usage {
  const components: ComponentRef[] = []
  let viaCn = false
  for (const [path, source] of Object.entries(sources)) {
    if (!importsPackage(source, name)) continue
    if (path.includes("/lib/")) {
      viaCn = true
      continue
    }
    // Files in a component's own folder (e.g. ui/data-table/table.tsx) count toward that component.
    const match = path.match(/components\/(ui|ghost)\/([\w-]+)(?:\/[\w-]+)?\.tsx?$/)
    if (match && !components.some((c) => c.id === match[2]))
      components.push({ id: match[2], name: pascal(match[2]), section: match[1] as ComponentRef["section"] })
  }
  components.sort((a, b) => a.name.localeCompare(b.name))
  return { version: versions[name] ?? null, components, viaCn, tooling: TOOLING.has(name) }
}

/** Ghost package version, shown in the docs top bar. */
export const GHOST_VERSION = pkg.version
