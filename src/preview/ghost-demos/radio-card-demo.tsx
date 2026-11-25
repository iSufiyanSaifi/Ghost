import * as React from "react"
import { CreditCard, Smartphone, Wallet } from "lucide-react"

import { RadioCard } from "@/components/ghost/radio-card"

export default function RadioCardDemo() {
  const [mode, setMode] = React.useState("upi")

  return (
    <RadioCard
      className="max-w-sm"
      aria-label="Payment mode"
      value={mode}
      onChange={setMode}
      options={[
        { value: "upi", label: "UPI", description: "GPay, PhonePe, Paytm", icon: Smartphone },
        { value: "card", label: "Card", description: "Debit or credit card", icon: CreditCard },
        { value: "cash", label: "Cash", description: "Pay at the counter", icon: Wallet },
      ]}
    />
  )
}
