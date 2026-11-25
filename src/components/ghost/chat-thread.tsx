import * as React from "react"
import { Send } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export interface ChatMessage {
  /** Stable key; falls back to the list index. */
  id?: string
  from: "me" | "them"
  text: string
  /** Display time, e.g. "10:42". */
  time?: string
}

export interface ChatThreadProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
  messages: ChatMessage[]
  /** @default "Type a message" */
  placeholder?: string
  /** Called with the trimmed draft when the user sends a message. The draft is then cleared. */
  onSend?: (text: string) => void
}

/**
 * Customer conversation with composer (Figma "Chat Container", "Chat", "Message").
 * Outgoing bubbles sit right in the primary colour; incoming bubbles sit left on muted.
 */
export function ChatThread({
  messages,
  placeholder = "Type a message",
  onSend,
  className,
  ...props
}: ChatThreadProps) {
  const [draft, setDraft] = React.useState("")
  const inputId = React.useId()

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend?.(text)
    setDraft("")
  }

  return (
    <div
      data-slot="chat-thread"
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
        className
      )}
      {...props}
    >
      <div role="log" aria-live="polite" className="flex flex-col gap-2 p-4">
        {messages.map((message, i) => {
          const me = message.from === "me"
          return (
            <div
              key={message.id ?? i}
              className={cn("flex max-w-[75%] flex-col", me ? "self-end items-end" : "self-start items-start")}
            >
              <span className="sr-only">{me ? "You" : "Customer"}: </span>
              <div
                className={cn(
                  "rounded-xl px-3 py-2 text-sm leading-5",
                  me
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted text-foreground"
                )}
              >
                {message.text}
              </div>
              {message.time && (
                <time className="mt-1 text-[11px] text-muted-foreground tabular-nums">
                  {message.time}
                </time>
              )}
            </div>
          )
        })}
      </div>
      <form onSubmit={submit} className="border-t border-divider p-2.5">
        <label htmlFor={inputId} className="sr-only">
          Message
        </label>
        <InputGroup>
          <InputGroupInput
            id={inputId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={placeholder}
            autoComplete="off"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="submit"
              size="icon-xs"
              variant="default"
              aria-label="Send"
              disabled={!draft.trim()}
            >
              <Send />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}
