import * as React from "react"
import { Star } from "lucide-react"

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

export interface ReviewCardProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Reviewer name. */
  name: string
  /** Star rating, 0–5. @default 5 */
  rating?: number
  /** Review text. */
  text?: string
  /** Review date (DD/MM/YYYY). */
  date?: string
}

/**
 * Customer feedback card (Figma "Review Card").
 */
function ReviewCard({ name, rating = 5, text, date, className, ...props }: ReviewCardProps) {
  const stars = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <Card data-slot="review-card" className={cn("gap-2.5 p-4", className)} {...props}>
      <div className="flex items-center gap-2.5">
        <Avatar>
          <AvatarFallback>{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">{name}</div>
          {date && <div className="text-xs text-muted-foreground tabular-nums">{date}</div>}
        </div>
        <div role="img" aria-label={`Rated ${stars} out of 5`} className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              aria-hidden="true"
              className={cn("size-3.5", i < stars ? "fill-warning text-warning" : "text-border")}
            />
          ))}
        </div>
      </div>
      {text && <p className="text-sm leading-5 text-muted-foreground">{text}</p>}
    </Card>
  )
}

export { ReviewCard }
