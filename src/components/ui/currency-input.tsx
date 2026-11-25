"use client"

import * as React from "react"
import CurrencyInputPrimitive, {
  type CurrencyInputProps as CurrencyInputPrimitiveProps,
} from "react-currency-input-field"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const currencyInputVariants = cva(
  [
    "group/currency-input relative flex w-full min-w-0 cursor-text items-stretch overflow-hidden rounded-lg border border-input bg-card text-foreground transition-colors dark:bg-input/30",
    "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
    "data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
    "data-disabled:cursor-not-allowed data-disabled:bg-input/50 data-disabled:opacity-50 dark:data-disabled:bg-input/80",
  ],
  {
    variants: {
      size: {
        default: "h-10 text-base md:text-sm",
        sm: "h-8 text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type CurrencyInputProps = Omit<
  CurrencyInputPrimitiveProps,
  "prefix" | "suffix" | "size" | "intlConfig"
> &
  VariantProps<typeof currencyInputVariants> & {
    /** Symbol shown as a fixed prefix. Defaults to "₹". */
    symbol?: string
    /** Currency code shown as a muted suffix. Defaults to "INR". */
    code?: string
    /** Locale used for digit grouping. Defaults to "en-IN" (lakh grouping: 1,24,580.00). */
    locale?: string
    /** Class names for the outer field wrapper. `className` goes to the inner input. */
    containerClassName?: string
  }

/**
 * Money field built on react-currency-input-field. Formats as you type with the locale's
 * grouping, shows the currency symbol as a prefix and the code as a muted suffix.
 * `onValueChange(value, name, values)` receives the raw string value, e.g. "124580.5".
 */
function CurrencyInput({
  size = "default",
  symbol = "₹",
  code = "INR",
  locale = "en-IN",
  decimalsLimit = 2,
  decimalScale = 2,
  disabled,
  onInvalid,
  onInput,
  className,
  containerClassName,
  ...props
}: CurrencyInputProps) {
  // Track native constraint validation (e.g. `required`) like aria-invalid.
  const [nativeInvalid, setNativeInvalid] = React.useState(false)
  const ariaInvalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
  const invalid = ariaInvalid || nativeInvalid

  return (
    <div
      data-slot="currency-input"
      data-size={size}
      data-invalid={invalid ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      onClick={(event) => {
        if (disabled) return
        event.currentTarget.querySelector("input")?.focus()
      }}
      className={cn(currencyInputVariants({ size }), containerClassName)}
    >
      <span
        data-slot="currency-input-symbol"
        role="presentation"
        className={cn(
          "pointer-events-none flex min-w-8 shrink-0 items-center justify-center border-r border-input px-2.5 text-muted-foreground select-none"
        )}
      >
        {symbol}
      </span>
      <CurrencyInputPrimitive
        data-slot="currency-input-control"
        intlConfig={{ locale }}
        decimalsLimit={decimalsLimit}
        decimalScale={decimalScale}
        disabled={disabled}
        inputMode="decimal"
        onInput={(event: React.FormEvent<HTMLInputElement>) => {
          if (nativeInvalid) setNativeInvalid(!event.currentTarget.validity.valid)
          onInput?.(event)
        }}
        onInvalid={(event: React.FormEvent<HTMLInputElement>) => {
          setNativeInvalid(!event.currentTarget.validity.valid)
          onInvalid?.(event)
        }}
        className={cn(
          "h-full min-w-0 flex-1 appearance-none bg-transparent px-3 text-right tabular-nums outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      <span
        data-slot="currency-input-code"
        role="presentation"
        className="pointer-events-none flex shrink-0 items-center pr-3 text-xs font-medium text-muted-foreground uppercase select-none"
      >
        {code}
      </span>
    </div>
  )
}

export { CurrencyInput, currencyInputVariants, type CurrencyInputProps }
