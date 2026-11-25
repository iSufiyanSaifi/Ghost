# Ghost Design System (Ghost Garage ERP)

Ghost is the design system for **Ghost Garage**, a premium automotive workshop-management SaaS (ERP + marketing site). Tagline: *Run Your Garage. Not the Chaos.*

React + TypeScript components on **Radix UI** and **Tailwind CSS v4**, themed with the Ghost tokens.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173 → component gallery
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server. Gallery at `/preview/`, ERP dashboard at `/ui_kits/erp/`, Integrations docs at `/docs/integrations/`. |
| `npm run build` | Typecheck and production build into `dist/`. |
| `npm run check` | Design rules (no pills, 1px strokes) + typecheck. Run before every change lands. |
| `npm run check:design` | Design rules only (`scripts/check-design-rules.mjs`). |

## Design rules (enforced)

1. **No pill shapes.** Corners are rounded rectangles: 8px controls (`rounded-lg`), 12px cards (`rounded-xl`). `rounded-2xl`…`4xl` are capped at 12px in the theme, and `rounded-full`, 50% or 999px radii fail `npm run check:design`. Avatars, badges, switches, progress bars and the FAB are rounded rectangles. **One exception:** radio buttons stay circular, because a circle is how people tell a radio from a checkbox.
2. **Light strokes.** Borders and outlines are 1px, using the lightened `--border` / `--input` tokens. Thicker rings are only allowed as focus/hover/invalid indicators (focus ring is 3px). Lucide icons render at 1.5px stroke instead of 2px.
3. **Ghost theme.** Colours come from `tokens/colors.css`; never hardcode hex values in components.

## Component behaviour
- **Dropdown lists** (`Select`, `Combobox`, calendar month/year) are custom, solid white, and open below the box only; when space is short they scroll instead of flipping above. There is no native `<select>`: the operating system draws its list, so it can't follow these rules.
- **Search in lists**: `Select` and `DropdownMenu` show a search field when they have more than 12 items. `searchable` is `"auto"` by default; `true` always shows it, `false` never. Typing anywhere in the open list searches; Enter picks the first match; submenus open unfiltered.
- **Password inputs**: every `<Input type="password">` has a show/hide (eye) button.
- **Email inputs**: every `<Input type="email">` requires `name@domain.tld` with no spaces ("Enter a valid email address, e.g. sufiyan@ghost.com"). Use `isValidEmail()` from `@/components/ui/input` for the same check in code.
- **Mobile inputs**: use `MobileInput` — fixed **+91** prefix and exactly 10 digits, shown as `97850 12345`; pasted `+91…`/`0…` numbers are cleaned up and forms receive `+919785012345`.
- **Hints and sample person**: placeholders and single-person examples use **Sufiyan Jin**, **+91 97850 12345**, **sufiyan@ghost.com**.
- **Search fields** use Ghost's own clear (×) button, not the browser's.
- **DataTable**: `useDataTable` plus `createDataTableColumnHelper`, `createDataTableFilterHelper` and `createDataTableCommandHelper` give search, filters (including date ranges with DatePicker), sorting, pagination, column visibility and reordering, and bulk actions in a CommandBar when rows are selected. Sorting, filtering and paging are done by you (server or client) from the table state.
- **Dates and money**: `DatePicker` and `TimeInput` read in en-IN order (DD/MM/YYYY, 12-hour time); `CurrencyInput` formats ₹ with lakh grouping as you type.

## Content fundamentals
Direct, operational, matter-of-fact. Sentence case for labels and buttons ("Create service order"). Second person for guidance; no emoji; no marketing hype inside the app. Realistic Indian data: INR with lakh grouping (₹1,24,580, `toLocaleString('en-IN')`), GST (CGST/SGST), registrations like MH 12 AB 1234, kilometres, DD/MM/YYYY. Empty states say what is missing, why it matters, what to do. Statuses are consistent across modules (Approved, Pending, Rejected, Expired, In workshop, Ready for delivery), via `StatusBadge` tones.

## Visual foundations
- **Color**: primary blue #1C70D4, secondary red #FF1619 (brand only; errors use independent #D34440). Page background #F6F8F9; components (cards, menus, fields, sidebar) white; hairline borders (#ECEDF0). Dark mode is a designed charcoal theme (#131416 / #1E1F23), not inverted; set `data-theme="dark"` on `<html>` (or use `useTheme()` from `src/hooks/use-theme.ts`).
- **Type**: SJ Pro (self-hosted, `assets/fonts/`, weights 100–900). Geist Mono for code. Tabular numerals for money, counts, dates.
- **Spacing**: 8px base (4px micro). Page margin 24, gutter 20, card padding 24; tablet 20, mobile 16.
- **Controls**: 40px default height, 32px small, 48px large.
- **Elevation**: borders first, soft shadows only for overlays. No heavy gradients, no glassmorphism.
- **Motion**: minimal; 120–200ms ease-out. Focus: 3px blue ring.
- **Icons**: [Lucide](https://lucide.dev) (`lucide-react`), outline, 1.5px stroke, `currentColor`. No emoji.

## How the theme is wired
- `tokens/colors.css` — Ghost palette (light + `[data-theme="dark"]`). **Source of truth for colour.**
- `src/styles/globals.css` — Tailwind entry: maps the tokens to component variables (`--primary`, `--border`, `--card`…) and Tailwind colours (`bg-primary`, `bg-success-subtle`, `text-pending-text`, `bg-plate`…), the radius scale, SJ Pro, the dark variant and the icon stroke.
- `src/styles/ghost-style.css` — slot styles (`.cn-button`, `.cn-card`…) every component uses. Change component styling here; run `npm run check` afterwards.
- `src/styles/variants.css` — custom variants (`data-open:`, `data-checked:`…) and utilities the components rely on.

## Project layout
- `src/components/ui/` — 71 components: accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, carousel, chart (recharts), checkbox, code, code-block, collapsible, combobox, command (palette), command-bar, command-snippet, context-menu, copy, currency-input, data-table (with `src/components/ui/data-table/`), date-picker, date-segment, dialog, direction, drawer, dropdown-menu, empty, field, focus-modal, heading, hover-card, icon-badge, inline-tip, input, input-group, input-otp, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, progress-accordion, progress-tabs, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner (toasts), spinner, switch, table, tabs, text, textarea, time-input, toggle, toggle-group, tooltip.
- `src/components/ghost/` — 30 Ghost domain components built on them: AuthCard, BayCard, BottomNav, ChartCard, ChatThread, ColorChip, FAB, FilterBar, HomeIndicator, InputStepper, InvoiceSummary, LeadCard, MetricCard, MobileInput, PageHeader, PartCard, PlanCard, PlateNumber, ProfileCard, PurchaseOrderCard, RadioCard, ReviewCard, SectionHeader, ServiceCard, StatusBadge (+ `statusToneClass`), StatusBar, Stepper, TimeSlots, TopBar, VehicleCard.
- `src/preview/` — the component gallery (`/preview/`). The Overview shows every component in a 3-column grid; each component also has its own page at `/preview/?c=<name>` (e.g. `?c=data-table`) with a large preview, the import line with copy, its exports, the demo source in a CodeBlock, and Previous/Next. The sidebar lists every component by name with a filter (`/` to focus); on phones it opens from the menu button. Demos live in `src/preview/demos/` and `src/preview/ghost-demos/`; a component appears automatically once it has a file and a `<name>-demo.tsx`.
- `src/ui-kits/erp/` — overview dashboard (`/ui_kits/erp/`).
- `src/docs/` — Ghost Docs (`/docs/integrations/`): the libraries Ghost is built on, grouped by category, each card showing its installed version and the components that use it (read from `package.json` and the component source). Content lives in `src/docs/integrations.ts`; the layout pieces (top bar, sidebar, "On this page" rail, search with ⌘K, feedback) are in `src/docs/components/` for reuse on future docs pages.
- `src/hooks/` — `use-theme.ts` (data-theme switching), `use-mobile.ts`.
- `scripts/check-design-rules.mjs` — the design-rule checker behind `npm run check:design`.
- `components.json` — component CLI config (aliases `@/components/ui`, `@/lib/utils`), validated by `components.schema.json`. Components added with a CLI arrive in their default style; run `npm run check:design` afterwards and fix pills/strokes.
- `assets/ghost-logo.svg` — Ghost logo (mark + wordmark, 556×556). Use where it can be shown at 120px or larger.
- `assets/ghost-avatar.svg` — the mark alone, cropped square, for avatars, favicons and anything small. Regenerate it from the logo if the logo changes.
- `assets/fonts/` — SJ Pro, weights 100–900.
- `docs/ghost-brief.md` — original product/design brief.

## License
- The Radix-based components in `src/components/ui/` and `src/styles/variants.css` are adapted from Apache-2.0 licensed code; see `src/components/ui/LICENSE.upstream.md`.
- Code, CodeBlock, CommandBar, CommandSnippet, Copy, CurrencyInput, DataTable, DatePicker, DateSegment, FocusModal, Heading, IconBadge, InlineTip, ProgressAccordion, ProgressTabs, Text and TimeInput are adapted from MIT-licensed code; see `src/components/ui/LICENSE.mit.md`. Both notices must stay with the code.
