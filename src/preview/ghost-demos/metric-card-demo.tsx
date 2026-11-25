import { CarFront, IndianRupee, Timer, Wrench } from "lucide-react"

import { MetricCard } from "@/components/ghost/metric-card"

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`

export default function MetricCardDemo() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
      <MetricCard icon={IndianRupee} label="Today's revenue" value={inr(84250)} delta="+12%" trend="up" hint="vs yesterday" />
      <MetricCard icon={CarFront} label="Vehicles in workshop" value="18" delta="+3" hint="since morning" />
      <MetricCard icon={Timer} label="Avg. turnaround" value="2.4 days" delta="-0.3 days" trend="down" tone="success" hint="vs last week" />
      <MetricCard icon={Wrench} label="Month-to-date billing" value={inr(1245600)} delta="-4%" trend="down" hint="vs October" />
    </div>
  )
}
