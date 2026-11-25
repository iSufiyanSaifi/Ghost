import { Heading } from "@/components/ui/heading"

export default function HeadingDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Heading level="h1">Service order SO-2481</Heading>
      <Heading level="h2">Hyundai Creta, MH 12 AB 1234</Heading>
      <Heading level="h3">Work in bay 3</Heading>
    </div>
  )
}
