import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const textVariants = cva("", {
  variants: {
    size: {
      xsmall: "text-xs",
      small: "text-[13px]",
      base: "text-sm",
      large: "text-base",
      xlarge: "text-lg",
    },
    weight: {
      regular: "font-normal",
      plus: "font-medium",
    },
    family: {
      sans: "font-sans",
      mono: "font-mono",
    },
    leading: {
      normal: "leading-normal",
      compact: "leading-tight",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "regular",
    family: "sans",
    leading: "normal",
    tone: "default",
  },
})

type TextProps = React.ComponentProps<"p"> &
  VariantProps<typeof textVariants> & {
    /** Render the single child element instead of a wrapper, merging props and classes onto it. */
    asChild?: boolean
    /** Wrapper element when `asChild` is off. */
    as?: "p" | "span" | "div"
  }

/**
 * Body copy. Sizes are 12 / 13 / 14 / 16 / 18px (`xsmall` to `xlarge`), `weight="plus"` is medium,
 * `leading="compact"` tightens line height for single-line labels.
 */
function Text({
  className,
  asChild = false,
  as = "p",
  size = "base",
  weight = "regular",
  family = "sans",
  leading = "normal",
  tone = "default",
  ...props
}: TextProps) {
  const Comp = asChild ? Slot.Root : as

  return (
    <Comp
      data-slot="text"
      className={cn(textVariants({ size, weight, family, leading, tone }), className)}
      {...props}
    />
  )
}

export { Text, textVariants }
export type { TextProps }
