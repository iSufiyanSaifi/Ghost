---
name: ghost-design
description: Use this skill to build well-branded interfaces for Ghost Garage ERP with the Ghost design system (React + TypeScript, Radix UI, Tailwind v4), for production code or throwaway prototypes. Contains the theme, design rules, 71 UI components (including DataTable, DatePicker, CodeBlock and CurrencyInput), 30 Ghost domain components, fonts and assets.
user-invocable: true
---

Read README.md first, then explore `src/components/ui`, `src/components/ghost` and `src/styles/globals.css`.

Rules that always apply:
- Never use pill shapes: no `rounded-full` or huge radii. Controls are `rounded-lg` (8px), cards `rounded-xl` (12px). Radio buttons are the only circles.
- Strokes are light and 1px (`border`, `ring-1`, `border-border`); thicker rings only for focus/hover/invalid states. Lucide icons at 1.5px stroke.
- Use theme colour utilities (`bg-primary`, `bg-card`, `text-muted-foreground`, `StatusBadge` tones…), never hex values. Dark mode is `data-theme="dark"` on `<html>`.
- Compose from existing components before writing new ones; new components follow the `data-slot`, `cn()`, `className` passthrough pattern and get a `<name>-demo.tsx` so they appear in the gallery.
- Run `npm run check` (design rules + typecheck) before finishing.

If the user invokes this skill without other guidance, ask what they want to build, ask a few questions, and act as an expert designer who produces production code or a quick prototype page under `src/` (run `npm run dev` to view it).
