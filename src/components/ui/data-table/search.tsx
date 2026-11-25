"use client"

import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Skeleton } from "@/components/ui/skeleton"

import { useDataTableContext } from "./context"

interface DataTableSearchProps extends Omit<React.ComponentProps<"input">, "value" | "onChange" | "type" | "size"> {
  /** Classes for the field wrapper. */
  className?: string
  /** @default "Search" */
  placeholder?: string
}

/** Search field for the data table. Typing updates at once; `onSearchChange` is debounced. */
function DataTableSearch({ className, placeholder = "Search", autoFocus, ...props }: DataTableSearchProps) {
  const { instance } = useDataTableContext()
  const inputRef = React.useRef<HTMLInputElement>(null)

  if (!instance.enableSearch) {
    throw new Error("DataTableSearch needs `search` in useDataTable.")
  }

  if (instance.showSkeleton) {
    return <Skeleton data-slot="data-table-search-skeleton" className="h-8 w-48" />
  }

  const value = instance.getSearch()

  return (
    <InputGroup data-slot="data-table-search" className={cn("h-8 w-full max-w-64", className)}>
      <InputGroupAddon>
        <SearchIcon aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => instance.onSearchChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault()
            instance.onSearchChange("")
          }
        }}
        placeholder={placeholder}
        aria-label={props["aria-label"] ?? placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className="h-full text-sm"
        {...props}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            onClick={() => {
              instance.onSearchChange("")
              inputRef.current?.focus()
            }}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

export { DataTableSearch }
export type { DataTableSearchProps }
