import * as React from "react"

import { cn } from "@/lib/utils"

export interface PageHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** Page title, rendered as the page's `h1`. */
  title: string
  /** One-line description under the title. */
  description?: string
  /** Breadcrumb trail shown above the title (e.g. the ui `Breadcrumb`). */
  breadcrumb?: React.ReactNode
  /** Primary page actions, right-aligned (e.g. `Button`s). */
  actions?: React.ReactNode
}

/**
 * Page title block with actions (Figma "Header", "Smart Heading").
 */
function PageHeader({ title, description, breadcrumb, actions, className, children, ...props }: PageHeaderProps) {
  return (
    <div data-slot="page-header" className={cn("flex flex-wrap items-end gap-4", className)} {...props}>
      <div className="min-w-60 flex-1">
        {breadcrumb && <div className="mb-1.5 text-[13px] text-muted-foreground">{breadcrumb}</div>}
        <h1 className="m-0 text-2xl leading-8 font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export { PageHeader }
