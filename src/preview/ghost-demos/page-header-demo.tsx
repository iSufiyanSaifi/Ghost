import { Download, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ghost/page-header"

export default function PageHeaderDemo() {
  return (
    <PageHeader
      title="Service orders"
      description="Track every job from check-in to delivery."
      breadcrumb="Workshop / Service orders"
      actions={
        <>
          <Button variant="outline">
            <Download /> Export
          </Button>
          <Button>
            <Plus /> Create service order
          </Button>
        </>
      }
    />
  )
}
