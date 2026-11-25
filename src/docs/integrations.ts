/**
 * Ghost Integrations: the third-party libraries Ghost components are built on.
 * Versions come from package.json and "Used by" is read from the component source (see usage.ts),
 * so only the wording below is maintained by hand.
 */

export interface Integration {
  /** Display name. */
  name: string
  /** npm package name, exactly as in package.json. */
  pkg: string
  /** One line on what Ghost uses it for. */
  summary: string
  /** Official website. */
  homepage: string
}

export interface IntegrationCategory {
  /** Anchor id, also used in the sidebar and "On this page". */
  id: string
  title: string
  description: string
  items: Integration[]
  /** "Add your own" guidance shown under the cards. */
  extend: string
}

export { GHOST_REPO } from "@/lib/site"

export const PAGE = {
  title: "Integrations",
  /** Shown in the footer as "Edited …". Update when the wording changes. */
  edited: "2026-11-25",
  sourceFile: "src/docs/integrations.ts",
  whatsNew: {
    title: "DataTable and 16 new components",
    body: "DataTable, DatePicker, CodeBlock, CurrencyInput, FocusModal and more are now in Ghost.",
    href: "/preview/?c=data-table",
  },
}

export const CATEGORIES: IntegrationCategory[] = [
  {
    id: "primitives",
    title: "Primitives",
    description:
      "Headless building blocks that give Ghost components their keyboard support, focus handling and screen-reader behaviour. Ghost adds the look; these handle the behaviour.",
    items: [
      { name: "Radix UI", pkg: "radix-ui", summary: "Dialogs, menus, selects, tabs, tooltips and most interactive parts.", homepage: "https://www.radix-ui.com" },
      { name: "Base UI", pkg: "@base-ui/react", summary: "The combobox: typing to filter a list of options.", homepage: "https://base-ui.com" },
    ],
    extend:
      "To wrap another headless primitive, add a file to src/components/ui that applies the cn-* slot classes, then give it a demo so it appears in the gallery.",
  },
  {
    id: "styling",
    title: "Styling",
    description:
      "Turn the Ghost tokens into utility classes and keep component variants consistent. The design rules (no pill shapes, 1px strokes) are checked on top of these.",
    items: [
      { name: "Tailwind CSS", pkg: "tailwindcss", summary: "Utility classes generated from the Ghost theme in globals.css.", homepage: "https://tailwindcss.com" },
      { name: "tw-animate-css", pkg: "tw-animate-css", summary: "Enter and exit animations for overlays and menus.", homepage: "https://github.com/Wombosvideo/tw-animate-css" },
      { name: "Class Variance Authority", pkg: "class-variance-authority", summary: "Variant and size props such as Button variant=\"outline\".", homepage: "https://cva.style" },
      { name: "clsx", pkg: "clsx", summary: "Combines class names conditionally inside cn().", homepage: "https://github.com/lukeed/clsx" },
      { name: "tailwind-merge", pkg: "tailwind-merge", summary: "Lets a className you pass override a component's own classes.", homepage: "https://github.com/dcastil/tailwind-merge" },
    ],
    extend:
      "New colours belong in tokens/colors.css first, then in the @theme block of src/styles/globals.css. Run npm run check:design after styling changes.",
  },
  {
    id: "icons",
    title: "Icons",
    description: "Outline icons that follow the text colour. Ghost draws them at a 1.5px stroke instead of the default 2px.",
    items: [
      { name: "Lucide", pkg: "lucide-react", summary: "Every icon in Ghost, from chevrons to the password eye.", homepage: "https://lucide.dev" },
    ],
    extend: "Import any Lucide icon by name. Icons from another set should match the 1.5px outline style and use currentColor.",
  },
  {
    id: "charts",
    title: "Charts",
    description: "Draw revenue, order and workshop trends using the Ghost chart colours (chart-1 to chart-5).",
    items: [
      { name: "Recharts", pkg: "recharts", summary: "Area, bar, line and pie charts inside ChartContainer.", homepage: "https://recharts.org" },
    ],
    extend: "Wrap new chart types in ChartContainer so tooltips, legends and colours stay consistent with the theme.",
  },
  {
    id: "dates",
    title: "Dates",
    description: "Pick days and ranges for bookings, delivery dates and reports.",
    items: [
      { name: "React DayPicker", pkg: "react-day-picker", summary: "The Calendar grid; its month and year lists use Ghost Select.", homepage: "https://daypicker.dev" },
      { name: "React Aria", pkg: "react-aria", summary: "Typed day/month/year and hour/minute segments in DatePicker and TimeInput, read in en-IN order.", homepage: "https://react-spectrum.adobe.com/react-aria/" },
      { name: "React Stately", pkg: "react-stately", summary: "Keeps the state of those date and time segments.", homepage: "https://react-spectrum.adobe.com/react-stately/" },
      { name: "Internationalized Date", pkg: "@internationalized/date", summary: "Calendar-safe date and time values behind DatePicker and TimeInput.", homepage: "https://react-spectrum.adobe.com/internationalized/date/" },
    ],
    extend: "Set startMonth and endMonth on Calendar to control which years the year list offers. DatePicker takes and returns plain JavaScript Date values.",
  },
  {
    id: "overlays",
    title: "Overlays",
    description: "Panels that slide in over the page, mainly for phones and narrow screens.",
    items: [
      { name: "Vaul", pkg: "vaul", summary: "The Drawer: a bottom sheet you can drag to close.", homepage: "https://vaul.emilkowal.ski" },
    ],
    extend: "Use Drawer on phones and Dialog or Sheet on larger screens for the same task.",
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Short confirmations after an action, such as an invoice being sent.",
    items: [
      { name: "Sonner", pkg: "sonner", summary: "Toasts, styled by the Ghost Toaster and following the active theme.", homepage: "https://sonner.emilkowal.ski" },
    ],
    extend: "Mount one Toaster per app, then call toast() from anywhere. Keep messages in sentence case without emoji.",
  },
  {
    id: "search",
    title: "Command and search",
    description: "Keyboard-first search across actions and records.",
    items: [
      { name: "cmdk", pkg: "cmdk", summary: "The Command palette and its fuzzy filtering.", homepage: "https://cmdk.paco.me" },
    ],
    extend: "Long Select and DropdownMenu lists already search themselves; use Command when people search across many kinds of things.",
  },
  {
    id: "inputs",
    title: "Inputs",
    description: "Specialised fields that plain inputs don't cover well.",
    items: [
      { name: "input-otp", pkg: "input-otp", summary: "One-time code boxes for sign-in and verification.", homepage: "https://input-otp.rodz.dev" },
      { name: "React Currency Input Field", pkg: "react-currency-input-field", summary: "CurrencyInput: ₹ amounts with lakh grouping as you type.", homepage: "https://github.com/cchanxzzz/react-currency-input-field" },
    ],
    extend: "Mobile numbers use MobileInput (+91 and 10 digits) and emails use Input type=\"email\"; both validate without extra libraries.",
  },
  {
    id: "data-tables",
    title: "Data tables",
    description: "Lists of service orders, customers and parts with search, filters, sorting, selection and paging.",
    items: [
      { name: "TanStack Table", pkg: "@tanstack/react-table", summary: "The table logic inside DataTable: columns, sorting, filtering, selection and pagination.", homepage: "https://tanstack.com/table" },
      { name: "dnd kit", pkg: "@dnd-kit/core", summary: "Drag-to-reorder columns in DataTable.", homepage: "https://dndkit.com" },
      { name: "dnd kit Sortable", pkg: "@dnd-kit/sortable", summary: "The sortable list behaviour behind column reordering.", homepage: "https://dndkit.com" },
      { name: "dnd kit Utilities", pkg: "@dnd-kit/utilities", summary: "Turns drag positions into CSS transforms while a column moves.", homepage: "https://dndkit.com" },
      { name: "dequal", pkg: "dequal", summary: "Deep equality checks so filters only re-run when they really change.", homepage: "https://github.com/lukeed/dequal" },
    ],
    extend: "Build tables with useDataTable and the column, filter and command helpers; do sorting and filtering on the server for large lists.",
  },
  {
    id: "code",
    title: "Code",
    description: "Show code and commands in docs and developer screens.",
    items: [
      { name: "Prism React Renderer", pkg: "prism-react-renderer", summary: "Syntax highlighting in CodeBlock, coloured with Ghost theme tokens.", homepage: "https://github.com/FormidableLabs/prism-react-renderer" },
    ],
    extend: "Highlighting covers the languages bundled with Prism React Renderer (TypeScript, TSX, JSON, YAML, SQL and more); other languages show as plain text.",
  },
  {
    id: "layout",
    title: "Layout",
    description: "Arrange and move through content on screen.",
    items: [
      { name: "react-resizable-panels", pkg: "react-resizable-panels", summary: "Resizable split views with draggable handles.", homepage: "https://react-resizable-panels.vercel.app" },
      { name: "Embla Carousel", pkg: "embla-carousel-react", summary: "The Carousel for swiping through cards or photos.", homepage: "https://www.embla-carousel.com" },
    ],
    extend: "Keep resize handles and carousel buttons as rounded rectangles; the design checker flags pill shapes.",
  },
  {
    id: "tooling",
    title: "Tooling",
    description: "What builds, type-checks and runs Ghost.",
    items: [
      { name: "React", pkg: "react", summary: "The component model everything is written in.", homepage: "https://react.dev" },
      { name: "TypeScript", pkg: "typescript", summary: "Typed props for every component; npm run check runs it.", homepage: "https://www.typescriptlang.org" },
      { name: "Vite", pkg: "vite", summary: "The dev server and production build for the gallery and docs.", homepage: "https://vite.dev" },
    ],
    extend: "Add new pages as an HTML entry in vite.config.ts, the way this page and the ERP kit are set up.",
  },
]
