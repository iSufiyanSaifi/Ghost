import * as React from "react"

import { AuthCard } from "@/components/ghost/auth-card"

export default function AuthCardDemo() {
  const [status, setStatus] = React.useState<string | null>(null)

  return (
    <div className="flex flex-col items-center gap-3">
      <AuthCard onSubmit={({ mobile }) => setStatus(`Signing in ${mobile}…`)} />
      {status && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {status}
        </p>
      )}
    </div>
  )
}
