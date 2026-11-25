import { DirectionProvider } from "@/components/ui/direction"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function DirectionDemo() {
  return (
    <DirectionProvider dir="rtl">
      <div dir="rtl" className="flex w-full max-w-sm items-center gap-2">
        <Input placeholder="ابحث عن مركبة" aria-label="Search vehicles (right-to-left)" />
        <Button>بحث</Button>
      </div>
    </DirectionProvider>
  )
}
