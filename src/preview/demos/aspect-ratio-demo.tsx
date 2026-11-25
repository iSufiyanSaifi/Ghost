
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function AspectRatioDemo() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted">
        <img
          src="https://avatar.vercel.sh/ghost1"
          alt="Photo"
          className="w-full rounded-lg object-cover grayscale dark:brightness-20"
        />
      </AspectRatio>
    </div>
  )
}
