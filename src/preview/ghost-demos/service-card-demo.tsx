import { ServiceCard } from "@/components/ghost/service-card"

export default function ServiceCardDemo() {
  return (
    <div className="grid max-w-sm gap-3">
      <ServiceCard title="Brake overhaul" subtitle="SO-2025-0411" progress={60} eta="02/11/2026" />
      <ServiceCard title="Periodic service · 40,000 km" subtitle="SO-2025-0418" progress={25} eta="03/11/2026" />
      <ServiceCard title="AC gas refill" subtitle="SO-2025-0402" progress={100} />
    </div>
  )
}
