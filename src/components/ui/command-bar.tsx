"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"

/** True when focus is in a text field, where single-key shortcuts must not fire. */
function isInputElement(element: Element | null): boolean {
  return (
    element instanceof HTMLElement &&
    (element.isContentEditable ||
      element.tagName === "INPUT" ||
      element.tagName === "TEXTAREA" ||
      element.tagName === "SELECT")
  )
}

interface CommandBarProps extends React.ComponentProps<"div"> {
  /** Show the bar (e.g. when one or more rows are selected). */
  open: boolean
  children?: React.ReactNode
}

/**
 * Floating action bar pinned to the bottom centre of the viewport (or of the nearest transformed
 * ancestor). Renders nothing while `open` is false, so its command shortcuts are only live while shown.
 */
function CommandBar({ open, className, children, ...props }: CommandBarProps) {
  if (!open) return null
  return (
    <div
      data-slot="command-bar"
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** The dark surface that holds the value, separators and commands. */
function CommandBarBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-bar-bar"
      className={cn(
        "flex items-center overflow-hidden rounded-xl border border-foreground bg-foreground px-1 text-background shadow-lg",
        className
      )}
      {...props}
    />
  )
}

/** What the commands act on, e.g. "3 selected". */
function CommandBarValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-bar-value"
      aria-live="polite"
      className={cn("px-3 py-2.5 text-sm font-medium whitespace-nowrap text-background/70", className)}
      {...props}
    />
  )
}

function CommandBarSeparator({ className, ...props }: Omit<React.ComponentProps<"div">, "children">) {
  return (
    <div
      data-slot="command-bar-separator"
      role="separator"
      aria-orientation="vertical"
      className={cn("h-10 w-px shrink-0 bg-background/20", className)}
      {...props}
    />
  )
}

interface CommandBarCommandProps
  extends Omit<React.ComponentProps<"button">, "children" | "onClick"> {
  action: () => void | Promise<void>
  label: string
  /** Single key that runs the action while the bar is shown (ignored while typing in a field). */
  shortcut: string
  disabled?: boolean
}

function CommandBarCommand({
  action,
  label,
  shortcut,
  disabled,
  type = "button",
  className,
  ...props
}: CommandBarCommandProps) {
  // Keep the latest action without re-binding the listener on every render.
  const actionRef = React.useRef(action)
  React.useEffect(() => {
    actionRef.current = action
  })

  React.useEffect(() => {
    if (disabled) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      if (isInputElement(document.activeElement)) return
      if (event.key.toLowerCase() === shortcut.toLowerCase()) {
        event.preventDefault()
        event.stopPropagation()
        void actionRef.current()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [shortcut, disabled])

  return (
    <button
      data-slot="command-bar-command"
      type={type}
      disabled={disabled}
      aria-keyshortcuts={shortcut.toUpperCase()}
      onClick={() => void action()}
      className={cn(
        "flex items-center gap-x-2 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap text-background outline-none transition-colors",
        "hover:bg-background/10 focus-visible:bg-background/10 focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-background/15",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span>{label}</span>
      <Kbd className="bg-background/15 text-background/80">{shortcut.toUpperCase()}</Kbd>
    </button>
  )
}

export {
  CommandBar,
  CommandBarBar,
  CommandBarValue,
  CommandBarSeparator,
  CommandBarCommand,
  type CommandBarProps,
  type CommandBarCommandProps,
}
