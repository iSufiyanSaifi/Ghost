import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { MobileInput } from "@/components/ghost/mobile-input"

export interface AuthCardValues {
  /** Full number with country code, e.g. `+919785012345`. */
  mobile: string
  password: string
}

export interface AuthCardProps extends Omit<React.ComponentProps<typeof Card>, "onSubmit" | "title"> {
  /** @default "Sign in to Ghost" */
  title?: React.ReactNode
  /** @default "Manage your garage from one place." */
  subtitle?: React.ReactNode
  /** Submit button label. @default "Sign in" */
  cta?: string
  /** Called with the entered values on submit (default browser submit is prevented). */
  onSubmit?: (values: AuthCardValues) => void
  /** Target of the "Reset with OTP" link. @default "#" */
  resetHref?: string
}

/**
 * Sign-in / create-account form card (Figma "Authentication", "Create Account",
 * "Login/Logout"): mobile number and password with a reset-with-OTP link.
 */
export function AuthCard({
  title = "Sign in to Ghost",
  subtitle = "Manage your garage from one place.",
  cta = "Sign in",
  onSubmit,
  resetHref = "#",
  className,
  ...props
}: AuthCardProps) {
  const id = React.useId()

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    onSubmit?.({
      mobile: String(data.get("mobile") ?? ""),
      password: String(data.get("password") ?? ""),
    })
  }

  return (
    <Card
      data-slot="auth-card"
      className={cn("w-full max-w-[400px] gap-5 py-8 shadow-md", className)}
      {...props}
    >
      <CardHeader className="px-8">
        <CardTitle className="text-[22px] leading-7 font-semibold">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="px-8">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor={`${id}-mobile`}>Mobile number</FieldLabel>
              <MobileInput id={`${id}-mobile`} name="mobile" aria-describedby={`${id}-mobile-hint`} required />
              <FieldDescription id={`${id}-mobile-hint`}>10-digit mobile number, e.g. +91 97850 12345</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
              <Input
                id={`${id}-password`}
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full">
            {cta}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-0 bg-transparent px-8 pt-0 text-[13px] text-muted-foreground">
        <span>
          Forgot password?{" "}
          <a href={resetHref} className="text-primary underline-offset-4 hover:underline">
            Reset with OTP
          </a>
        </span>
      </CardFooter>
    </Card>
  )
}
