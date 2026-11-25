"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

/** Near full-screen modal for focused, multi-field tasks. Built on the Radix Dialog primitive. */
function FocusModal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="focus-modal" {...props} />
}

function FocusModalTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="focus-modal-trigger" {...props} />
}

function FocusModalClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="focus-modal-close" {...props} />
}

function FocusModalPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="focus-modal-portal" {...props} />
}

function FocusModalOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="focus-modal-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-200 supports-backdrop-filter:backdrop-blur-xs",
        "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function FocusModalContent({
  className,
  overlayProps,
  portalProps,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  overlayProps?: React.ComponentProps<typeof DialogPrimitive.Overlay>
  portalProps?: React.ComponentProps<typeof DialogPrimitive.Portal>
}) {
  return (
    <FocusModalPortal {...portalProps}>
      <FocusModalOverlay {...overlayProps} />
      <DialogPrimitive.Content
        data-slot="focus-modal-content"
        className={cn(
          "fixed inset-2 z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg outline-none duration-200",
          "data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-2",
          className
        )}
        {...props}
      />
    </FocusModalPortal>
  )
}

/** Top bar with a close button and an "esc" hint on the left; children (title, actions) follow. */
function FocusModalHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="focus-modal-header"
      className={cn(
        "flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-2",
        className
      )}
      {...props}
    >
      <div className="flex shrink-0 items-center gap-2">
        <DialogPrimitive.Close asChild>
          <Button type="button" variant="ghost" size="icon-sm" data-slot="focus-modal-header-close">
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        </DialogPrimitive.Close>
        <Kbd aria-hidden="true">esc</Kbd>
      </div>
      {children}
    </div>
  )
}

function FocusModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="focus-modal-title"
      className={cn("text-base font-medium text-foreground", className)}
      {...props}
    />
  )
}

function FocusModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="focus-modal-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/** Scrollable main area between header and footer. */
function FocusModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="focus-modal-body"
      className={cn("min-h-0 flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
}

function FocusModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="focus-modal-footer"
      className={cn(
        "flex shrink-0 items-center justify-end gap-2 border-t border-border p-4",
        className
      )}
      {...props}
    />
  )
}

export {
  FocusModal,
  FocusModalBody,
  FocusModalClose,
  FocusModalContent,
  FocusModalDescription,
  FocusModalFooter,
  FocusModalHeader,
  FocusModalOverlay,
  FocusModalPortal,
  FocusModalTitle,
  FocusModalTrigger,
}
