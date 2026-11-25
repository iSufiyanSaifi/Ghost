import { LeadCard } from "@/components/ghost/lead-card"

export default function LeadCardDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <LeadCard
        name="Priya Nair"
        source="Walk-in"
        vehicle="Kia Seltos · KA 05 MN 4421"
        stage="Quoted"
        tone="pending"
        value="₹18,400"
        date="18/11/2026"
      />
      <LeadCard
        name="Rahul Deshmukh"
        source="Google Business"
        vehicle="Hyundai Creta · MH 12 AB 1234"
        stage="Won"
        tone="success"
        value="₹1,24,500"
        date="16/11/2026"
      />
    </div>
  )
}
