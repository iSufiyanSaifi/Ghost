import { Copy } from "@/components/ui/copy"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { LinkIcon } from "lucide-react"

export default function CopyDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border border-border bg-card py-1 pr-1 pl-3">
        <div className="flex flex-col">
          <Text size="xsmall" tone="muted" leading="compact">
            Invoice number
          </Text>
          <Text weight="plus" family="mono" leading="compact">
            INV-2026-00318
          </Text>
        </div>
        <Copy content="INV-2026-00318" />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-card py-1 pr-1 pl-3">
        <Text leading="compact">sufiyan@ghost.com</Text>
        <Copy content="sufiyan@ghost.com" />
      </div>
      <Copy content="https://ghost.com/track/SO-2481" asChild>
        <Button variant="outline" size="sm" className="self-start">
          <LinkIcon />
          Copy tracking link
        </Button>
      </Copy>
    </div>
  )
}
