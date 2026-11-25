import { PlateNumber } from "@/components/ghost/plate-number"

export default function PlateNumberDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <PlateNumber>MH 12 AB 1234</PlateNumber>
      <PlateNumber>KA 03 EF 9012</PlateNumber>
      <PlateNumber size="sm">DL 3C AY 0917</PlateNumber>
    </div>
  )
}
