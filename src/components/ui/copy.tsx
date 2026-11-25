"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Writes `text` to the clipboard. Uses the async Clipboard API where it is available (secure
 * contexts) and falls back to a hidden textarea + `execCommand("copy")` elsewhere.
 * Resolves to `true` when the copy succeeded.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Permission denied or document not focused: try the fallback below.
    }
  }
  if (typeof document === "undefined") return false
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.top = "0"
  textarea.style.left = "0"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  let ok = false
  try {
    ok = document.execCommand("copy")
  } catch {
    ok = false
  }
  document.body.removeChild(textarea)
  return ok
}

type CopyStatus = "idle" | "copied" | "failed"

const RESET_AFTER_MS = 2000

type CopyProps = Omit<React.ComponentProps<typeof Button>, "content"> & {
  /** The text written to the clipboard. */
  content: string
  /** Called after each copy attempt with whether it succeeded. */
  onCopied?: (ok: boolean) => void
}

/**
 * Copies `content` to the clipboard. By default renders a ghost icon button (Copy, then Check)
 * with a "Copy" / "Copied" tooltip. Pass children to replace the icon, or `asChild` to use your
 * own trigger element.
 * Needs a `TooltipProvider` above it (the app root normally has one).
 */
function Copy({
  content,
  onCopied,
  asChild = false,
  variant = "ghost",
  size,
  className,
  children,
  onClick,
  ...props
}: CopyProps) {
  const [status, setStatus] = React.useState<CopyStatus>("idle")
  const [hovered, setHovered] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onClick?.(event)
    if (event.defaultPrevented) return
    const ok = await copyToClipboard(content)
    setStatus(ok ? "copied" : "failed")
    onCopied?.(ok)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus("idle"), RESET_AFTER_MS)
  }

  const label = status === "copied" ? "Copied" : status === "failed" ? "Couldn't copy" : "Copy"

  const trigger = asChild ? (
    <Slot.Root
      data-slot="copy"
      data-status={status}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Slot.Root>
  ) : (
    <Button
      type="button"
      data-slot="copy"
      data-status={status}
      variant={variant}
      size={size ?? (children ? "sm" : "icon-sm")}
      aria-label={children ? undefined : label}
      className={cn("text-muted-foreground", className)}
      onClick={handleClick}
      {...props}
    >
      {children ?? (status === "copied" ? <CheckIcon /> : <CopyIcon />)}
    </Button>
  )

  return (
    <Tooltip open={status !== "idle" || hovered} onOpenChange={setHovered}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export { Copy, copyToClipboard }
export type { CopyProps }
