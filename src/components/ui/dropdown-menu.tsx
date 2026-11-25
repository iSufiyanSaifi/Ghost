"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { CheckIcon, ChevronRightIcon, SearchIcon, XIcon } from "lucide-react"

// Ghost: dropdown menus with more than 12 items get a search field that filters them by text.
// Non-matching items stay mounted but hidden and disabled, so keyboard navigation skips them.
const MenuSearchContext = React.createContext("")
/** The search field appears when a menu has more than this many items. */
const SEARCH_MIN_ITEMS = 12
const MenuSubMatchContext = React.createContext(true)

function menuTextOf(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(menuTextOf).join(" ")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    if (node.type === DropdownMenuShortcut) return "" // "⌘P" is not part of the item's name
    return menuTextOf(node.props.children)
  }
  return ""
}

function menuMatches(query: string, text: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase())
}

/** Texts of every item (and submenu trigger) inside `node`, looking through groups and submenus. */
function menuItemTexts(node: React.ReactNode): string[] {
  return React.Children.toArray(node).flatMap((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode; textValue?: string }>(child)) return []
    const own =
      child.type === DropdownMenuItem ||
      child.type === DropdownMenuCheckboxItem ||
      child.type === DropdownMenuRadioItem ||
      child.type === DropdownMenuSubTrigger
    return own ? [child.props.textValue ?? menuTextOf(child.props.children)] : menuItemTexts(child.props.children)
  })
}

/** Items shown directly in the menu; what's inside a submenu doesn't count. */
function menuItemCount(node: React.ReactNode): number {
  return React.Children.toArray(node).reduce<number>((count, child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return count
    if (child.type === DropdownMenuSubContent) return count
    const own = ([DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuSubTrigger] as unknown[]).includes(child.type)
    return count + (own ? 1 : menuItemCount(child.props.children))
  }, 0)
}

/** Hidden + disabled when a search is active and `text` doesn't match. */
function useMenuSearchHidden(text: string) {
  const query = React.useContext(MenuSearchContext)
  return query.trim() !== "" && !menuMatches(query, text)
}

const MENU_VISIBLE_ITEM =
  "[role=menuitem]:not([hidden]):not([data-disabled]),[role=menuitemcheckbox]:not([hidden]):not([data-disabled]),[role=menuitemradio]:not([hidden]):not([data-disabled])"


function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  children,
  searchable = "auto",
  searchPlaceholder = "Search…",
  emptyMessage = "No results",
  onKeyDown,
  onCloseAutoFocus,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
  /** Search field that filters the menu. "auto" shows it only when there are more than 12 items. @default "auto" */
  searchable?: boolean | "auto"
  /** @default "Search…" */
  searchPlaceholder?: string
  /** Shown when nothing matches the search. @default "No results" */
  emptyMessage?: React.ReactNode
}) {
  const [query, setQuery] = React.useState("")
  const showSearch = searchable === true || (searchable === "auto" && menuItemCount(children) > SEARCH_MIN_ITEMS)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const active = showSearch ? query : ""
  const noMatches = active.trim() !== "" && !menuItemTexts(children).some((t) => menuMatches(active, t))
  const visibleItems = () => Array.from(contentRef.current?.querySelectorAll<HTMLElement>(MENU_VISIBLE_ITEM) ?? [])

  // If the search hides the focused item, move focus to the first visible one.
  React.useEffect(() => {
    const content = contentRef.current
    const focused = document.activeElement as HTMLElement | null
    if (!content || !focused || !content.contains(focused) || focused === searchRef.current) return
    if (active.trim() !== "" && (focused === content || focused.hidden)) visibleItems()[0]?.focus()
  }, [active])

  // Typing anywhere in the open menu goes into the search field.
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
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "cn-dropdown-menu-content cn-menu-target cn-menu-translucent z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto data-[state=closed]:overflow-hidden",
          showSearch && "min-w-48",
          className
        )}
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
            data-slot="dropdown-menu-search"
            className="cn-dropdown-menu-search sticky -top-1 z-10 -mx-1 -mt-1 mb-1 flex items-center gap-2 border-b border-border bg-popover px-2.5 py-2"
          >
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  // Move from the field into the list.
                  event.preventDefault()
                  event.stopPropagation()
                  const items = visibleItems()
                  ;(event.key === "ArrowDown" ? items[0] : items[items.length - 1])?.focus()
                  return
                }
                if (event.key === "Enter") {
                  // Enter runs the first match.
                  event.preventDefault()
                  event.stopPropagation()
                  visibleItems()[0]?.click()
                  return
                }
                // Let Escape and Tab reach the menu; keep text-editing keys in the field.
                if (event.key !== "Escape" && event.key !== "Tab") event.stopPropagation()
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
        <MenuSearchContext.Provider value={active}>{children}</MenuSearchContext.Provider>
        {noMatches && (
          <div data-slot="dropdown-menu-empty" className="cn-dropdown-menu-empty px-2 py-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  const query = React.useContext(MenuSearchContext)
  const empty = query.trim() !== "" && !menuItemTexts(children).some((t) => menuMatches(query, t))
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" hidden={empty || undefined} {...props}>
      {children}
    </DropdownMenuPrimitive.Group>
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  disabled,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  const hiddenBySearch = useMenuSearchHidden(props.textValue ?? menuTextOf(props.children))
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      disabled={disabled || hiddenBySearch}
      hidden={hiddenBySearch || undefined}
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "cn-dropdown-menu-item group/dropdown-menu-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  disabled,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> & {
  inset?: boolean
}) {
  const hiddenBySearch = useMenuSearchHidden(props.textValue ?? menuTextOf(children))
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      disabled={disabled || hiddenBySearch}
      hidden={hiddenBySearch || undefined}
      data-inset={inset}
      className={cn(
        "cn-dropdown-menu-checkbox-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="cn-dropdown-menu-item-indicator pointer-events-none"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  const query = React.useContext(MenuSearchContext)
  const empty = query.trim() !== "" && !menuItemTexts(children).some((t) => menuMatches(query, t))
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      hidden={empty || undefined}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.RadioGroup>
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  disabled,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> & {
  inset?: boolean
}) {
  const hiddenBySearch = useMenuSearchHidden(props.textValue ?? menuTextOf(children))
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      disabled={disabled || hiddenBySearch}
      hidden={hiddenBySearch || undefined}
      data-inset={inset}
      className={cn(
        "cn-dropdown-menu-radio-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span
        className="cn-dropdown-menu-item-indicator pointer-events-none"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  const query = React.useContext(MenuSearchContext)
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      hidden={query.trim() !== "" || undefined}
      data-inset={inset}
      className={cn("cn-dropdown-menu-label", className)}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  const query = React.useContext(MenuSearchContext)
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      hidden={query.trim() !== "" || undefined}
      className={cn("cn-dropdown-menu-separator", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("cn-dropdown-menu-shortcut", className)}
      {...props}
    />
  )
}

function DropdownMenuSub({
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  const query = React.useContext(MenuSearchContext)
  const matches = query.trim() === "" || menuItemTexts(children).some((t) => menuMatches(query, t))
  return (
    <MenuSubMatchContext.Provider value={matches}>
      <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props}>
        {children}
      </DropdownMenuPrimitive.Sub>
    </MenuSubMatchContext.Provider>
  )
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  const hiddenBySearch = !React.useContext(MenuSubMatchContext)
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      disabled={disabled || hiddenBySearch}
      hidden={hiddenBySearch || undefined}
      data-inset={inset}
      className={cn(
        "cn-dropdown-menu-sub-trigger flex cursor-default items-center outline-hidden select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon
        className="cn-rtl-flip ml-auto"
      />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <MenuSearchContext.Provider value="">
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        className={cn(
          "cn-dropdown-menu-sub-content cn-menu-target cn-menu-translucent z-50 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden",
          className
        )}
        {...props}
      />
    </MenuSearchContext.Provider>
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
