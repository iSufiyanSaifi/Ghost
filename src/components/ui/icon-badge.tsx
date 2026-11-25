import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const iconBadgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "border-border bg-neutral-subtle text-neutral-text",
        success: "border-success/20 bg-success-subtle text-success-text",
        warning: "border-warning/20 bg-warning-subtle text-warning-text",
        error: "border-error/20 bg-error-subtle text-error-text",
        info: "border-info/20 bg-info-subtle text-info-text",
        pending: "border-pending/20 bg-pending-subtle text-pending-text",
        primary: "border-primary/20 bg-primary/10 text-primary",
      },
      size: {
        base: "size-6 [&_svg:not([class*='size-'])]:size-3.5",
        large: "size-7 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "base",
    },
  }
)

/** A small square tile holding one icon, tinted with a Ghost tone. */
function IconBadge({
  className,
  tone = "neutral",
  size = "base",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof iconBadgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="icon-badge"
      data-tone={tone}
      data-size={size}
      className={cn(iconBadgeVariants({ tone, size }), className)}
      {...props}
    />
  )
}

export { IconBadge, iconBadgeVariants }
