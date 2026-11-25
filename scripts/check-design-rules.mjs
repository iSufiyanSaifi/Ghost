#!/usr/bin/env node
/**
 * Ghost design rules, enforced on every component and style file:
 *   1. No pill shapes. Corners are rounded rectangles; `rounded-full`, huge arbitrary radii and
 *      50% / 999px border-radius are not allowed. Exception: radio buttons stay circular.
 *   2. Light strokes. Borders and outlines are 1px; thicker borders (border-2+, ring-2+ outside
 *      focus/hover states) are not allowed.
 * Run: npm run check:design
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname
const SCAN = ["src"]
const SKIP_FILES = new Set(["src/styles/variants.css"])
// CSS rules allowed to be circular (selector names in the generated style file).
const CIRCLE_OK = new Set([".cn-radio-group-item", ".cn-radio-group-indicator-icon"])

const PILL = [
  /(?<![\w-])(?:[\w-]+:)*rounded(?:-[tblrse]{1,2})?-full(?![\w-])/g,
  /rounded(?:-[tblrse]{1,2})?-\[(?:\d{3,}px|[\d.]+rem|50%|100%|9999px|calc\(infinity[^\]]*\))\]/g,
  /border-radius\s*:\s*(?:50%|100%|\d{3,}px|9999px|calc\(infinity)/g,
  /--radius-pill/g,
  /borderRadius\s*:\s*["']?(?:50%|100%|9{3,})/g,
]
const THICK = [
  /(?<![\w-])border(?:-[xytblrse])?-(?:[2-9]|\[[2-9]px\])(?![\w-])/g,
  /(?<![\w-])(?:[^\s"'`:]+:)*ring-(?:[2-9]|\[[2-9]px\])(?![\w-])/g,
]
// Thick rings are fine as focus/hover/active state indicators (Ghost focus ring is 3px).
const STATE_RING = /(?:focus|hover|active|invalid)[^\s]*:ring-/

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(tsx?|css)$/.test(name)) out.push(p)
  }
  return out
}

/** For CSS, map each character offset to the selector of the rule it sits in. */
function selectorAt(text, index) {
  const open = text.lastIndexOf("{", index)
  const lineStart = text.lastIndexOf("\n", open) + 1
  return text.slice(lineStart, open).trim()
}

const problems = []
for (const file of SCAN.flatMap((d) => walk(join(ROOT, d)))) {
  const rel = relative(ROOT, file)
  if (SKIP_FILES.has(rel)) continue
  // Blank out comments (keeping offsets) so documentation can mention the rules.
  const text = readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, (c, pre) => pre + " ".repeat(c.length - pre.length))
  const check = (patterns, rule) => {
    for (const re of patterns) {
      for (const m of text.matchAll(re)) {
        if (rel.endsWith(".css") && CIRCLE_OK.has(selectorAt(text, m.index))) continue
        if (rule === "strokes must be 1px" && STATE_RING.test(m[0])) continue
        const line = text.slice(0, m.index).split("\n").length
        problems.push(`${rel}:${line}  ${rule}: ${m[0]}`)
      }
    }
  }
  check(PILL, "no pill shapes")
  check(THICK, "strokes must be 1px")
}

if (problems.length) {
  console.error(`Design rule violations (${problems.length}):\n` + problems.map((p) => "  " + p).join("\n"))
  process.exit(1)
}
console.log("Design rules OK: no pill shapes, 1px strokes.")
