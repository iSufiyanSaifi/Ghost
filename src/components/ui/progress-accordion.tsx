"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { ProgressStatusIndicator, type ProgressStatus } from "@/components/ui/progress-tabs"

/** Accordion for multi-step flows; each header shows the step's progress status. */
function ProgressAccordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="progress-accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function ProgressAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="progress-accordion-item"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  )
}

/** The whole header row is the toggle: status icon, children (step title), then a plus/close icon. */
function ProgressAccordionHeader({
  className,
  children,
  status = "not-started",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { status?: ProgressStatus }) {
  return (
    <AccordionPrimitive.Header data-slot="progress-accordion-header" className="flex">
      <AccordionPrimitive.Trigger
        data-slot="progress-accordion-trigger"
        data-status={status}
        className={cn(
          "group/progress-accordion-trigger flex min-h-12 flex-1 items-center gap-3 px-4 py-2 text-left text-sm font-medium text-foreground outline-none transition-colors",
          "hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        <ProgressStatusIndicator status={status} />
        <span className="min-w-0 flex-1">{children}</span>
        <PlusIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open/progress-accordion-trigger:rotate-45"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function ProgressAccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="progress-accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div className={cn("pr-4 pb-4 pl-11", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export {
  ProgressAccordion,
  ProgressAccordionItem,
  ProgressAccordionHeader,
  ProgressAccordionContent,
}
