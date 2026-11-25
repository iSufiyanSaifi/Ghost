import { Code } from "@/components/ui/code"
import { Text } from "@/components/ui/text"

export default function CodeDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Text>
        Filter the list with <Code>status=in_workshop</Code> to see only cars currently in a bay.
      </Text>
      <Text tone="muted" size="small">
        Each order has a stable id such as <Code>SO-2481</Code> and a <Code>bay_id</Code> once it is
        assigned.
      </Text>
    </div>
  )
}
