"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"


function InputOTP({
  className,
  containerClassName,
  value,
  defaultValue,
  onChange,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  // Ghost: input-otp forwards `defaultValue` onto an <input> it also controls with `value`,
  // which React warns about. Keep uncontrolled state here and only ever pass `value`.
  const [inner, setInner] = React.useState(defaultValue == null ? "" : String(defaultValue))
  const controlled = value !== undefined
  return (
    <OTPInput
      value={controlled ? value : inner}
      onChange={(next: string) => {
        if (!controlled) setInner(next)
        onChange?.(next)
      }}
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn(
        "cn-input-otp-input disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("cn-input-otp-group flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="cn-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="cn-input-otp-caret-line" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="cn-input-otp-separator flex items-center"
      role="separator"
      {...props}
    >
      <MinusIcon
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
