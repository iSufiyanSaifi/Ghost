import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(root, "src") } },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(root, "index.html"),
        preview: path.resolve(root, "preview/index.html"),
        erp: path.resolve(root, "ui_kits/erp/index.html"),
        integrations: path.resolve(root, "docs/integrations/index.html"),
      },
    },
  },
})
