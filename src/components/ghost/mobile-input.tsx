import * as React from "react"

import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"

/** Indian mobile numbers are +91 followed by exactly 10 digits. */
export const MOBILE_DIGITS = 10
export const MOBILE_MESSAGE = "Enter a 10-digit mobile number"

/** Keeps digits only, drops a pasted leading +91 / 91 / 0, caps at 10 digits. */
export function normalizeMobile(raw: string) {
  let digits = raw.replace(/\D/g, "")
  if (digits.length > MOBILE_DIGITS && digits.startsWith("91")) digits = digits.slice(2)
  if (digits.length > MOBILE_DIGITS && digits.startsWith("0")) digits = digits.slice(1)
  return digits.slice(0, MOBILE_DIGITS)
}

/** "9785012345" → "97850 12345" */
export function formatMobile(digits: string) {
  return digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits
}

export interface MobileInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "type" | "maxLength" | "name"> {
  /** The 10 digits (without +91). Controlled. */
  value?: string
  /** The 10 digits (without +91). Uncontrolled starting value. */
  defaultValue?: string
  /** Called with the full number (`+919785012345`, empty until digits are typed) and the bare digits. */
  onValueChange?: (fullNumber: string, digits: string) => void
  /** Form field name; the form receives the full number, e.g. `+919785012345`. */
  name?: string
  /** Classes for the outer group (the visible box). */
  groupClassName?: string
}

/**
 * Indian mobile number field: a fixed +91 prefix and exactly 10 digits, shown as "97850 12345".
 * Pasting "+91 97850-12345" or "09785012345" is cleaned up. Submitting with fewer than 10 digits
 * shows "Enter a 10-digit mobile number".
 */
export function MobileInput({
  value,
  defaultValue,
  onValueChange,
  name,
  groupClassName,
  placeholder = "97850 12345",
  autoComplete = "tel-national",
  onInvalid,
  ...props
}: MobileInputProps) {
  const [inner, setInner] = React.useState(() => normalizeMobile(defaultValue ?? ""))
  const digits = value !== undefined ? normalizeMobile(value) : inner
  const ref = React.useRef<HTMLInputElement>(null)

  // Keep the browser's validity in sync, so required/submit checks use the 10-digit rule.
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    el.setCustomValidity(digits.length === 0 || digits.length === MOBILE_DIGITS ? "" : MOBILE_MESSAGE)
  }, [digits])

  return (
    <InputGroup data-slot="mobile-input" className={groupClassName}>
      <InputGroupAddon>
        <InputGroupText>+91</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        ref={ref}
        type="tel"
        inputMode="numeric"
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={MOBILE_DIGITS + 1}
        value={formatMobile(digits)}
        onChange={(event) => {
          const next = normalizeMobile(event.target.value)
          if (value === undefined) setInner(next)
          onValueChange?.(next ? `+91${next}` : "", next)
        }}
        onInvalid={(event) => {
          if (event.currentTarget.validity.valueMissing) event.currentTarget.setCustomValidity(MOBILE_MESSAGE)
          onInvalid?.(event)
        }}
        {...props}
      />
      {name && <input type="hidden" name={name} value={digits ? `+91${digits}` : ""} />}
    </InputGroup>
  )
}
