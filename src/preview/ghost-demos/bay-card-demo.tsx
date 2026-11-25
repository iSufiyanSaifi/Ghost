import { BayCard } from "@/components/ghost/bay-card"

export default function BayCardDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <BayCard bay="Bay 1" state="free" />
      <BayCard bay="Bay 3" vehicle="Tata Nexon · KA 03 EF 9012" technician="Imran S." />
      <BayCard bay="Bay 4" vehicle="Honda City · MH 14 GH 7731" technician="Prakash N." />
      <BayCard bay="Bay 6" vehicle="Lift under maintenance" state="blocked" />
    </div>
  )
}
