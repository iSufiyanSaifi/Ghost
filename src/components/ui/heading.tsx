import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva("font-sans font-semibold text-foreground", {
  variants: {
    level: {
      h1: "text-2xl leading-8 tracking-tight",
      h2: "text-xl leading-7 tracking-tight",
      h3: "text-base leading-6",
    },
  },
  defaultVariants: {
    level: "h1",
  },
})

/**
 * Page and section headings. `level` picks both the element (`h1`/`h2`/`h3`) and its size
 * (24 / 20 / 16px, semibold).
 */
function Heading({
  level = "h1",
  className,
  ...props
}: React.ComponentProps<"h1"> & VariantProps<typeof headingVariants>) {
  const Comp = level ?? "h1"

  return (
    <Comp
      data-slot="heading"
      data-level={Comp}
      className={cn(headingVariants({ level }), className)}
      {...props}
    />
  )
}

export { Heading, headingVariants }
