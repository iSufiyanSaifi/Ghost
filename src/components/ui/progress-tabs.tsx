"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { CircleCheckIcon, CircleDashedIcon, CircleDotIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type ProgressStatus = "not-started" | "in-progress" | "completed"

const STATUS_LABEL: Record<ProgressStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
}

/** Status icon shared by ProgressTabs and ProgressAccordion. */
function ProgressStatusIndicator({
  status = "not-started",
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { status?: ProgressStatus }) {
  const Icon =
    status === "completed" ? CircleCheckIcon : status === "in-progress" ? CircleDotIcon : CircleDashedIcon
  return (
    <span
      data-slot="progress-status-indicator"
      data-status={status}
      className={cn(
        "inline-flex shrink-0 items-center justify-center [&_svg]:size-4",
        status === "completed" && "text-success-text",
        status === "in-progress" && "text-primary",
        status === "not-started" && "text-muted-foreground",
        className
      )}
      {...props}
    >
      <Icon aria-hidden="true" />
      <span className="sr-only">{STATUS_LABEL[status]}</span>
    </span>
  )
}

/** Tabs for multi-step flows; each trigger shows the step's progress status. */
function ProgressTabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="progress-tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function ProgressTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="progress-tabs-list"
      className={cn(
        "flex w-full items-stretch overflow-x-auto border-b border-border bg-background",
        className
      )}
      {...props}
    />
  )
}

function ProgressTabsTrigger({
  className,
  children,
  status = "not-started",
  ...props
}: Omit<React.ComponentProps<typeof TabsPrimitive.Trigger>, "asChild"> & {
  status?: ProgressStatus
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="progress-tabs-trigger"
      data-status={status}
      className={cn(
        "group/progress-tabs-trigger relative inline-flex h-12 max-w-[200px] shrink-0 grow basis-auto items-center gap-2 border-r border-border px-3 text-left text-sm font-medium whitespace-nowrap text-muted-foreground outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-active:bg-card data-active:text-foreground",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary after:opacity-0 after:transition-opacity data-active:after:opacity-100",
        className
      )}
      {...props}
    >
      <ProgressStatusIndicator status={status} />
      <span>{children}</span>
    </TabsPrimitive.Trigger>
  )
}

function ProgressTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="progress-tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export {
  ProgressTabs,
  ProgressTabsList,
  ProgressTabsTrigger,
  ProgressTabsContent,
  ProgressStatusIndicator,
  type ProgressStatus,
}
