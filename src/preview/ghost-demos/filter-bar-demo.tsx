import { useState } from "react"

import { FilterBar } from "@/components/ghost/filter-bar"

const filters = ["Pending", "In workshop", "Ready", "Delivered"]
const counts: Record<string, number> = { Pending: 9, "In workshop": 12, Ready: 3, Delivered: 1248 }
const sorts = ["Newest first", "Oldest first", "Due date"]

export default function FilterBarDemo() {
  const [active, setActive] = useState<string[]>(["Pending"])
  const [sortIndex, setSortIndex] = useState(0)
  const count = (active.length ? active : filters).reduce((sum, f) => sum + (counts[f] ?? 0), 0)

  return (
    <FilterBar
      filters={filters}
      active={active}
      onToggle={(f) => setActive((a) => (a.includes(f) ? a.filter((x) => x !== f) : [...a, f]))}
      count={count}
      sort={sorts[sortIndex]}
      onSortClick={() => setSortIndex((i) => (i + 1) % sorts.length)}
    />
  )
}
