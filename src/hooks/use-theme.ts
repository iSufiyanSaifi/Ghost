import * as React from "react"

/** Ghost themes are switched with `data-theme="dark"` on <html> (see tokens/colors.css). */
export type Theme = "light" | "dark"

const STORAGE_KEY = "ghost-theme"

function readTheme(): Theme {
  if (typeof document === "undefined") return "light"
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"
}

/** Apply the stored theme before React renders, to avoid a light flash. */
export function initTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "dark") document.documentElement.setAttribute("data-theme", "dark")
  } catch {
    // Storage can be unavailable (private mode); fall back to light.
  }
}

export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>(readTheme)

  React.useEffect(() => {
    const observer = new MutationObserver(() => setThemeState(readTheme()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    return () => observer.disconnect()
  }, [])

  const setTheme = React.useCallback((next: Theme) => {
    if (next === "dark") document.documentElement.setAttribute("data-theme", "dark")
    else document.documentElement.removeAttribute("data-theme")
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore: the theme still applies for this page view.
    }
  }, [])

  return { theme, setTheme }
}
