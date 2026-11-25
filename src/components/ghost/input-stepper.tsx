import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface InputStepperProps extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  /**
   * Current value. Seeds the internal state and re-syncs whenever it changes, so it works both as an
   * initial value and as a controlled value (together with `onChange`). @default 1
   */
  value?: number
  /** @default 0 */
  min?: number
  /** @default 99 */
  max?: number
  /** @default 1 */
  step?: number
  /** Unit shown after the value, e.g. `pcs`, `hrs`. */
  unit?: string
  /** Called with the clamped new value. */
  onChange?: (value: number) => void
  /** Accessible name of the value, e.g. `Quantity`. @default "Quantity" */
  label?: string
  disabled?: boolean
}

function decimals(n: number) {
  const s = String(n)
  return s.includes(".") ? s.split(".")[1]!.length : 0
}

/**
 * Numeric stepper (Figma "Input stepper", "Input steppers"). Use for quantities on parts and labour lines.
 * The value is a keyboard-operable spinbutton: arrow keys step, Page Up/Down step by 10×, Home/End jump to min/max.
 */
function InputStepper({
  value: valueProp = 1,
  min = 0,
  max = 99,
  step = 1,
  unit,
  onChange,
  label = "Quantity",
  disabled = false,
  className,
  ...props
}: InputStepperProps) {
  const clamp = React.useCallback(
    (n: number) => {
      const p = Math.max(decimals(step), decimals(min))
      return Number(Math.max(min, Math.min(max, n)).toFixed(p))
    },
    [min, max, step]
  )
  const [value, setValue] = React.useState(() => clamp(valueProp))
  React.useEffect(() => {
    setValue(clamp(valueProp))
  }, [valueProp, clamp])

  const set = (n: number) => {
    const next = clamp(n)
    if (next === value) return
    setValue(next)
    onChange?.(next)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowUp: value + step,
      ArrowRight: value + step,
      ArrowDown: value - step,
      ArrowLeft: value - step,
      PageUp: value + step * 10,
      PageDown: value - step * 10,
      Home: min,
      End: max,
    }
    if (e.key in map) {
      e.preventDefault()
      set(map[e.key]!)
    }
  }

  const text = `${value.toLocaleString("en-IN")}${unit ? ` ${unit}` : ""}`

  return (
    <div
      data-slot="input-stepper"
      data-disabled={disabled || undefined}
      className={cn(
        "inline-flex h-10 items-center rounded-lg border border-input bg-card data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="mx-0.5 text-muted-foreground"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={disabled || value <= min}
        onClick={() => set(value - step)}
      >
        <Minus />
      </Button>
      <span
        role="spinbutton"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={text}
        aria-disabled={disabled || undefined}
        onKeyDown={disabled ? undefined : onKeyDown}
        className="min-w-12 rounded-md px-1 text-center text-sm font-medium text-foreground tabular-nums outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {text}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="mx-0.5 text-muted-foreground"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={disabled || value >= max}
        onClick={() => set(value + step)}
      >
        <Plus />
      </Button>
    </div>
  )
}

export { InputStepper }
