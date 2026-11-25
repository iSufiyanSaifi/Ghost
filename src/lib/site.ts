/** Ghost's source repository. Used by the gallery and docs top bars, "Edit this page" and feedback links. */
export const GHOST_REPO = "https://github.com/iSufiyanSaifi/Ghost"

export interface GhostSection {
  label: "Components" | "Integrations" | "ERP kit"
  href: string
}

/** The three Ghost sites. Shown as the Docs top bar tabs and at the top of every side menu. */
export const GHOST_SECTIONS: GhostSection[] = [
  { label: "Components", href: "/preview/" },
  { label: "Integrations", href: "/docs/integrations/" },
  { label: "ERP kit", href: "/ui_kits/erp/" },
]
