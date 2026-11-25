import * as React from "react"

import { ChatThread, type ChatMessage } from "@/components/ghost/chat-thread"

const now = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })

export default function ChatThreadDemo() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: "1", from: "them", text: "Is my car ready? MH 12 AB 1234", time: "10:42" },
    { id: "2", from: "me", text: "Yes, ready for pickup after 4 PM.", time: "10:44" },
    { id: "3", from: "them", text: "Great, can I pay by UPI?", time: "10:45" },
  ])

  return (
    <ChatThread
      className="max-w-md"
      messages={messages}
      onSend={(text) =>
        setMessages((prev) => [
          ...prev,
          { id: String(prev.length + 1), from: "me", text, time: now() },
        ])
      }
    />
  )
}
