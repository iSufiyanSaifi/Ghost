import * as React from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const inputClassName =
  "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  // Ghost: password inputs get a show/hide (eye) button.
  const [revealed, setRevealed] = React.useState(false)
  if (type === "password") {
    return (
      <div data-slot="input-password" className="relative w-full min-w-0">
        <input
          type={revealed ? "text" : "password"}
          data-slot="input"
          className={cn(inputClassName, "pr-10", className)}
          {...props}
        />
        <button
          type="button"
          data-slot="input-password-toggle"
          onClick={() => setRevealed((r) => !r)}
          disabled={props.disabled}
          aria-label={revealed ? "Hide password" : "Show password"}
          aria-pressed={revealed}
          aria-controls={props.id}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4"
        >
          {revealed ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
        </button>
      </div>
    )
  }
  if (type === "email") {
    // Ghost email rule: name@domain.tld, no spaces (the browser alone accepts "name@domain").
    return (
      <input
        type="email"
        data-slot="input"
        className={cn(inputClassName, className)}
        pattern={EMAIL_PATTERN}
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        inputMode="email"
        {...props}
        onInput={(event) => {
          event.currentTarget.setCustomValidity("")
          props.onInput?.(event)
        }}
        onInvalid={(event) => {
          const { validity } = event.currentTarget
          if (!validity.valueMissing) event.currentTarget.setCustomValidity(EMAIL_MESSAGE)
          props.onInvalid?.(event)
        }}
      />
    )
  }
  return <input type={type} data-slot="input" className={cn(inputClassName, className)} {...props} />
}

/** name@domain.tld: letters, digits and . _ % + - before the @, a domain, and a 2+ letter ending. */
const EMAIL_PATTERN = "[A-Za-z0-9._%+\\-]+@[A-Za-z0-9\\-]+(\\.[A-Za-z0-9\\-]+)*\\.[A-Za-z]{2,}"
const EMAIL_MESSAGE = "Enter a valid email address, e.g. sufiyan@ghost.com"

/** Check an email against the Ghost rule in code (same rule as `<Input type="email">`). */
function isValidEmail(value: string) {
  return new RegExp(`^(?:${EMAIL_PATTERN})$`).test(value)
}

export { Input, isValidEmail, EMAIL_PATTERN, EMAIL_MESSAGE }
