"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Select as SelectPrimitive } from "radix-ui"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon, XIcon } from "lucide-react"

// Ghost: Select lists with more than 12 items get a search field that filters them by text.
// Items that don't match stay mounted but hidden and disabled, so the chosen value keeps
// showing in the trigger and keyboard navigation skips them.
const SelectSearchContext = React.createContext("")
/** The search field appears when a list has more than this many items. */
const SEARCH_MIN_ITEMS = 12

function selectTextOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(selectTextOf).join(" ")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return selectTextOf(node.props.children)
  return ""
}

function selectMatches(query: string, text: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase())
}

/** Texts of every SelectItem inside `node`, looking through groups and wrappers. */
function selectItemTexts(node: React.ReactNode): string[] {
  return React.Children.toArray(node).flatMap((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode; textValue?: string }>(child)) return []
    if (child.type === SelectItem) return [child.props.textValue ?? selectTextOf(child.props.children)]
    return selectItemTexts(child.props.children)
  })
}

const SELECT_VISIBLE_ITEM = "[data-slot=select-item]:not([hidden]):not([data-disabled])"


function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  const query = React.useContext(SelectSearchContext)
  const empty = query.trim() !== "" && !selectItemTexts(children).some((t) => selectMatches(query, t))
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("cn-select-group", className)}
      hidden={empty || undefined}
      {...props}
    >
      {children}
    </SelectPrimitive.Group>
  )
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "cn-select-trigger flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          className="cn-select-trigger-icon pointer-events-none"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  // Ghost: the list is a dropdown that always opens below the box, at least as wide as it,
  // and scrolls when there is not enough room (never covers the box or flips above it).
  position = "popper",
  side = "bottom",
  align = "start",
  avoidCollisions = false,
  searchable = "auto",
  searchPlaceholder = "Search…",
  emptyMessage = "No results",
  onKeyDown,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  /** Search field that filters the list. "auto" shows it only when there are more than 12 items. @default "auto" */
  searchable?: boolean | "auto"
  /** @default "Search…" */
  searchPlaceholder?: string
  /** Shown when nothing matches the search. @default "No results" */
  emptyMessage?: React.ReactNode
}) {
  const [query, setQuery] = React.useState("")
  const showSearch = searchable === true || (searchable === "auto" && selectItemTexts(children).length > SEARCH_MIN_ITEMS)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const active = showSearch ? query : ""
  const noMatches = active.trim() !== "" && !selectItemTexts(children).some((t) => selectMatches(active, t))

  // If the search hides the focused item, move focus to the first visible one.
  React.useEffect(() => {
    const content = contentRef.current
    const focused = document.activeElement as HTMLElement | null
    if (!content || !focused || !content.contains(focused) || focused === searchRef.current) return
    if (focused === content || focused.hidden) content.querySelector<HTMLElement>(SELECT_VISIBLE_ITEM)?.focus()
  }, [active])

  // Typing anywhere in the open list goes into the search field.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (!showSearch || event.defaultPrevented || event.target === searchRef.current) return
    const printable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey
    if (printable && !(event.key === " " && query === "")) {
      event.preventDefault()
      setQuery((q) => q + event.key)
    } else if (event.key === "Backspace" && query) {
      event.preventDefault()
      setQuery((q) => q.slice(0, -1))
    }
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === "item-aligned"}
        className={cn(
          "cn-select-content cn-menu-target cn-menu-translucent relative z-50 max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        side={side}
        align={align}
        avoidCollisions={avoidCollisions}
        {...props}
        ref={contentRef}
        onKeyDown={handleKeyDown}
        onCloseAutoFocus={(event) => {
          setQuery("")
          onCloseAutoFocus?.(event)
        }}
      >
        {showSearch && (
          <div
            data-slot="select-search"
            className="cn-select-search flex shrink-0 items-center gap-2 border-b border-border px-2.5 py-2"
          >
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  // Enter picks the first match.
                  event.preventDefault()
                  const first = contentRef.current?.querySelector<HTMLElement>(SELECT_VISIBLE_ITEM)
                  first?.focus()
                  first?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }))
                  return
                }
                // Let arrows, Escape and Tab reach the list; keep text-editing keys in the field.
                if (!["ArrowDown", "ArrowUp", "Escape", "Tab"].includes(event.key)) event.stopPropagation()
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoComplete="off"
              spellCheck={false}
              className="h-6 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("")
                  searchRef.current?.focus()
                }}
                className="grid size-5 shrink-0 place-items-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <XIcon className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "cn-select-viewport data-[position=popper]:h-(--radix-select-trigger-height) data-[position=popper]:w-full data-[position=popper]:min-w-(--radix-select-trigger-width)",
            position === "popper" && ""
          )}
        >
          <SelectSearchContext.Provider value={active}>{children}</SelectSearchContext.Provider>
          {noMatches && (
            <div data-slot="select-empty" className="cn-select-empty px-2 py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("cn-select-label", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const query = React.useContext(SelectSearchContext)
  const hiddenBySearch = query.trim() !== "" && !selectMatches(query, props.textValue ?? selectTextOf(children))
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      disabled={disabled || hiddenBySearch}
      hidden={hiddenBySearch || undefined}
      className={cn(
        "cn-select-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="cn-select-item-indicator">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon
            className="cn-select-item-indicator-icon pointer-events-none"
          />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  const query = React.useContext(SelectSearchContext)
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      hidden={query.trim() !== "" || undefined}
      className={cn("cn-select-separator pointer-events-none", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("cn-select-scroll-up-button", className)}
      {...props}
    >
      <ChevronUpIcon
      />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("cn-select-scroll-down-button", className)}
      {...props}
    >
      <ChevronDownIcon
      />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
