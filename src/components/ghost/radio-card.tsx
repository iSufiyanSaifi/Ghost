import * as React from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface RadioCardOption {
  value: string
  label: string
  description?: string
  /** Lucide icon component (was a Jin icon-name string in the legacy API). */
  icon?: LucideIcon
  disabled?: boolean
}

export interface RadioCardProps
  extends Omit<
    React.ComponentProps<typeof RadioGroup>,
    "onChange" | "onValueChange" | "children"
  > {
  options: RadioCardOption[]
  value?: string
  onChange?: (value: string) => void
}

/**
 * Large selectable option tiles (Figma "Radio Card", "Payment Mode"). Use for payment method,
 * service type, pickup choice. A real radio group: arrow keys move the selection.
 */
export function RadioCard({ options, value, onChange, className, ...props }: RadioCardProps) {
  const baseId = React.useId()

  return (
    <RadioGroup
      data-slot="radio-card"
      value={value}
      onValueChange={onChange}
      className={cn("gap-2.5", className)}
      {...props}
    >
      {options.map((option) => {
        const id = `${baseId}-${option.value}`
        const Icon = option.icon
        return (
          <FieldLabel key={option.value} htmlFor={id} className="w-full rounded-lg">
            <Field orientation="horizontal" data-disabled={option.disabled || undefined} className="items-center p-3.5!">
              {Icon && (
                <Icon
                  className="size-5 shrink-0 text-muted-foreground group-has-data-[state=checked]/field-label:text-primary"
                  aria-hidden
                />
              )}
              <FieldContent>
                <FieldTitle>{option.label}</FieldTitle>
                {option.description && (
                  <FieldDescription>{option.description}</FieldDescription>
                )}
              </FieldContent>
              <RadioGroupItem value={option.value} id={id} disabled={option.disabled} />
            </Field>
          </FieldLabel>
        )
      })}
    </RadioGroup>
  )
}
