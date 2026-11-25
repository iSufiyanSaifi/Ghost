import * as React from "react"
import { ArrowUpRightIcon, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export interface DocsFeedbackProps {
  /** Page name, used in the pre-filled GitHub issue title. */
  page: string
  /** Repository URL; the follow-up opens a pre-filled issue there. */
  repo: string
}

/**
 * "Was this page helpful?" in two steps: the answer, then an optional "tell us more" that opens a
 * pre-filled GitHub issue. Ghost has no feedback backend, so nothing is sent without the reader
 * choosing to open the issue.
 */
export function DocsFeedback({ page, repo }: DocsFeedbackProps) {
  const [answer, setAnswer] = React.useState<"yes" | "no" | null>(null)

  if (answer) {
    const title = `Docs feedback: ${page} ${answer === "yes" ? "was helpful" : "needs work"}`
    const body = `Page: ${typeof location !== "undefined" ? location.href : page}\n\nWhat would make it better?\n`
    const issueUrl = `${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    return (
      <div data-slot="docs-feedback" role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-medium">{answer === "yes" ? "Thanks, glad it helped." : "Thanks for telling us."}</span>
        <a href={issueUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
          Tell us more on GitHub
          <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
        </a>
      </div>
    )
  }

  return (
    <div data-slot="docs-feedback" className="flex flex-wrap items-center gap-3 text-sm">
      <span className="font-medium">Was this page helpful?</span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setAnswer("yes")}>
          <ThumbsUpIcon data-icon="inline-start" />
          Yes
        </Button>
        <Button variant="outline" size="sm" onClick={() => setAnswer("no")}>
          <ThumbsDownIcon data-icon="inline-start" />
          No
        </Button>
      </div>
    </div>
  )
}
