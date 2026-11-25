import { PartCard } from "@/components/ghost/part-card"

export default function PartCardDemo() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <PartCard name="Brake pad set (front)" sku="BP-HY-CR-F01" stock={3} price="₹2,450" low />
      <PartCard name="Engine oil 5W-30, 3.5 L" sku="EO-CA-5W30-35" stock={42} price="₹2,180" />
      <PartCard name="Cabin air filter" sku="CF-MS-SW-110" stock={18} price="₹640" />
    </div>
  )
}
