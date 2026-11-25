import { ColorChip } from "@/components/ghost/color-chip"

export default function ColorChipDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <ColorChip color="blue">Periodic service</ColorChip>
      <ColorChip color="green">Washing</ColorChip>
      <ColorChip color="yellow">Body shop</ColorChip>
      <ColorChip color="red">Accident repair</ColorChip>
      <ColorChip color="orange">Insurance claim</ColorChip>
      <ColorChip>Consumables</ColorChip>
    </div>
  )
}
