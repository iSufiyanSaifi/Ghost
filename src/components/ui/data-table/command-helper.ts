import type { DataTableCommand } from "./types"

/** Typed builder for bulk commands shown in the command bar. */
function createDataTableCommandHelper() {
  return {
    command: (command: DataTableCommand) => command,
  }
}

export { createDataTableCommandHelper }
