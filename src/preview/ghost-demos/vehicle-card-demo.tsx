import { VehicleCard } from "@/components/ghost/vehicle-card"

export default function VehicleCardDemo() {
  return (
    <div className="grid max-w-md gap-3">
      <VehicleCard model="Hyundai Creta SX" reg="MH 12 AB 1234" meta="Diesel · 48,210 km" status="In workshop" />
      <VehicleCard model="Maruti Suzuki Baleno Zeta" reg="KA 05 MN 4821" meta="Petrol · 22,640 km" status="Ready" tone="success" />
      <VehicleCard model="Mahindra XUV700 AX7" reg="DL 3C AY 0917" meta="Diesel · 61,305 km" status="Awaiting parts" tone="warning" />
    </div>
  )
}
