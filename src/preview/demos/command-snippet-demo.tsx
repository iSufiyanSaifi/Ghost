import {
  CommandSnippet,
  CommandSnippetCode,
  CommandSnippetCopy,
  CommandSnippetPrompt,
} from "@/components/ui/command-snippet"

const COMMANDS = ["npm run dev", "npm run check:design"]

export default function CommandSnippetDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      {COMMANDS.map((command) => (
        <CommandSnippet key={command}>
          <CommandSnippetPrompt />
          <CommandSnippetCode>{command}</CommandSnippetCode>
          <CommandSnippetCopy content={command} />
        </CommandSnippet>
      ))}
    </div>
  )
}
