"use client"

import * as React from "react"

import {
  CommandBar,
  CommandBarBar,
  CommandBarCommand,
  CommandBarSeparator,
  CommandBarValue,
} from "@/components/ui/command-bar"

import { useDataTableContext } from "./context"

interface DataTableCommandBarProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Text before the commands, e.g. `(count) => \`${count} selected\``. */
  selectedLabel?: ((count: number) => string) | string
}

/** Floating bar with the table's bulk commands, shown while one or more rows are selected. */
function DataTableCommandBar({ selectedLabel, ...props }: DataTableCommandBarProps) {
  const { instance } = useDataTableContext()
  const commands = instance.getCommands()
  const selection = instance.getRowSelection()
  const count = Object.values(selection).filter(Boolean).length

  if (commands.length === 0) return null

  const label = typeof selectedLabel === "function" ? selectedLabel(count) : selectedLabel

  return (
    <CommandBar data-slot="data-table-command-bar" open={count > 0} {...props}>
      <CommandBarBar>
        {label && (
          <>
            <CommandBarValue>{label}</CommandBarValue>
            <CommandBarSeparator />
          </>
        )}
        {commands.map((command, idx) => (
          <React.Fragment key={command.label}>
            <CommandBarCommand
              action={() => command.action(selection)}
              label={command.label}
              shortcut={command.shortcut}
            />
            {idx < commands.length - 1 && <CommandBarSeparator />}
          </React.Fragment>
        ))}
      </CommandBarBar>
    </CommandBar>
  )
}

export { DataTableCommandBar }
export type { DataTableCommandBarProps }
