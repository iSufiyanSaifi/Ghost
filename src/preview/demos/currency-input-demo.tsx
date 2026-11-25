import * as React from "react"

import { CurrencyInput } from "@/components/ui/currency-input"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"

const inr = (value: number) =>
  `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function CurrencyInputDemo() {
  const [labour, setLabour] = React.useState<string | undefined>("2450")
  const [parts, setParts] = React.useState<string | undefined>("124580.5")

  const labourValue = Number(labour ?? 0) || 0
  const partsValue = Number(parts ?? 0) || 0

  return (
    <FieldGroup className="w-full max-w-xs">
      <Field>
        <FieldLabel htmlFor="currency-input-labour">Labour charge</FieldLabel>
        <CurrencyInput
          id="currency-input-labour"
          name="labour"
          placeholder="0.00"
          defaultValue={labour}
          onValueChange={(value) => setLabour(value)}
        />
        <FieldDescription>Saved as {inr(labourValue)}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="currency-input-parts">Parts total</FieldLabel>
        <CurrencyInput
          id="currency-input-parts"
          name="parts"
          size="sm"
          placeholder="0.00"
          defaultValue={parts}
          onValueChange={(value) => setParts(value)}
        />
        <FieldDescription>Invoice total {inr(labourValue + partsValue)}</FieldDescription>
      </Field>
    </FieldGroup>
  )
}
