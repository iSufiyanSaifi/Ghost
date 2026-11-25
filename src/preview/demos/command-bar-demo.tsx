import * as React from "react"

import { StatusBadge } from "@/components/ghost/status-badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CommandBar,
  CommandBarBar,
  CommandBarCommand,
  CommandBarSeparator,
  CommandBarValue,
} from "@/components/ui/command-bar"

type Order = { id: string; plate: string; service: string; ready: boolean }

const ORDERS: Order[] = [
  { id: "SO-1042", plate: "MH 12 AB 1234", service: "General service", ready: false },
  { id: "SO-1043", plate: "KA 03 MN 4521", service: "Brake pad change", ready: false },
  { id: "SO-1044", plate: "DL 8C AF 7710", service: "AC gas refill", ready: true },
  { id: "SO-1045", plate: "TN 09 BZ 3398", service: "Wheel alignment", ready: false },
]

export default function CommandBarDemo() {
  const [orders, setOrders] = React.useState(ORDERS)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const toggle = (id: string, checked: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })

  const markReady = () => {
    setOrders((prev) => prev.map((o) => (selected.has(o.id) ? { ...o, ready: true } : o)))
    setSelected(new Set())
  }
  const remove = () => {
    setOrders((prev) => prev.filter((o) => !selected.has(o.id)))
    setSelected(new Set())
  }

  return (
    // The transform makes this box the containing block, so the fixed bar stays inside the tile.
    <div className="relative flex min-h-56 w-full transform-gpu flex-col">
      <ul className="flex flex-col divide-y divide-divider rounded-xl border bg-card">
        {orders.map((order) => (
          <li key={order.id}>
            <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5">
              <Checkbox
                checked={selected.has(order.id)}
                onCheckedChange={(c) => toggle(order.id, c === true)}
                aria-label={`Select ${order.id}`}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{order.service}</span>
                <span className="text-xs text-muted-foreground">
                  {order.id} · {order.plate}
                </span>
              </span>
              {order.ready ? (
                <StatusBadge tone="success">Ready</StatusBadge>
              ) : (
                <StatusBadge tone="info">In bay</StatusBadge>
              )}
            </label>
          </li>
        ))}
        {orders.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">No service orders</li>
        ) : null}
      </ul>
      <CommandBar open={selected.size > 0} className="bottom-2">
        <CommandBarBar>
          <CommandBarValue>{selected.size} selected</CommandBarValue>
          <CommandBarSeparator />
          <CommandBarCommand action={markReady} label="Mark ready" shortcut="r" />
          <CommandBarSeparator />
          <CommandBarCommand action={remove} label="Delete" shortcut="d" />
        </CommandBarBar>
      </CommandBar>
    </div>
  )
}
