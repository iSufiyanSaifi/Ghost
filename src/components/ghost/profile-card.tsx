import * as React from "react"
import { Mail, Phone } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("")
}

export interface ProfileCardProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Person's full name. */
  name: string
  /** Role or segment, e.g. `Customer · Gold`. */
  role?: string
  /** Phone number, e.g. `+91 97850 12345`; rendered as a `tel:` link. */
  phone?: string
  /** Email address; rendered as a `mailto:` link. */
  email?: string
}

/**
 * Customer or staff information block.
 */
function ProfileCard({ name, role, phone, email, className, ...props }: ProfileCardProps) {
  return (
    <Card data-slot="profile-card" className={cn("flex-row items-center gap-3.5 p-4", className)} {...props}>
      <Avatar size="lg" className="size-12 after:rounded-lg">
        <AvatarFallback className="text-base">{initials(name)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-foreground">{name}</span>
        {role && <span className="text-[13px] text-muted-foreground">{role}</span>}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="inline-flex items-center gap-1.5 text-[13px] text-foreground tabular-nums hover:underline"
          >
            <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
            {phone}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1.5 truncate text-[13px] text-foreground hover:underline"
          >
            <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
            {email}
          </a>
        )}
      </div>
    </Card>
  )
}

export { ProfileCard }
