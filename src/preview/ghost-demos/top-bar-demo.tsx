import { Bell, Plus, Search } from "lucide-react"

import { TopBar } from "@/components/ghost/top-bar"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export default function TopBarDemo() {
  return (
    <TopBar
      className="w-full min-w-[640px] rounded-xl border"
      crumbs={[{ label: "Workshop", href: "#" }, "Service orders"]}
      actions={
        <>
          <InputGroup className="hidden w-56 sm:flex">
            <InputGroupAddon>
              <Search aria-hidden />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search job cards" aria-label="Search job cards" />
          </InputGroup>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell />
          </Button>
          <Button size="sm">
            <Plus data-icon="inline-start" />
            Create
          </Button>
        </>
      }
    />
  )
}
