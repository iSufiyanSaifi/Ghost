import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@/styles/globals.css"
import { initTheme } from "@/hooks/use-theme"
import { App } from "./App"

initTheme()
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
