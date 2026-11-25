import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export type TopBarCrumb = string | { label: string; href?: string }

export interface TopBarProps extends React.ComponentProps<"header"> {
  /** Breadcrumb trail; the last item is the current page. Plain strings render as text. */
  crumbs?: TopBarCrumb[]
  /** Right-aligned search, actions or account controls. */
  actions?: React.ReactNode
}

/**
 * ERP top bar: breadcrumbs on the left, search and actions on the right.
 */
export function TopBar({ crumbs = [], actions, className, ...props }: TopBarProps) {
  return (
    <header
      data-slot="top-bar"
      className={cn(
        "flex h-16 items-center gap-4 border-b border-border bg-card px-4 md:px-6",
        className
      )}
      {...props}
    >
      {crumbs.length > 0 && (
        <Breadcrumb className="min-w-0">
          <BreadcrumbList>
            {crumbs.map((crumb, i) => {
              const { label, href } = typeof crumb === "string" ? { label: crumb, href: undefined } : crumb
              const last = i === crumbs.length - 1
              return (
                <React.Fragment key={`${label}-${i}`}>
                  <BreadcrumbItem>
                    {last ? (
                      <BreadcrumbPage>{label}</BreadcrumbPage>
                    ) : href ? (
                      <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                    ) : (
                      <span>{label}</span>
                    )}
                  </BreadcrumbItem>
                  {!last && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <span className="flex-1" />
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}
