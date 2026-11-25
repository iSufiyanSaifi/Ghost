import * as React from "react"

import { MobileInput } from "@/components/ghost/mobile-input"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"

export default function MobileInputDemo() {
  const [full, setFull] = React.useState("")
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="mobile-input-demo">Mobile number</FieldLabel>
      <MobileInput id="mobile-input-demo" name="mobile" onValueChange={(next) => setFull(next)} required />
      <FieldDescription>{full ? `Submitted as ${full}` : "10-digit mobile number, e.g. +91 97850 12345"}</FieldDescription>
    </Field>
  )
}
