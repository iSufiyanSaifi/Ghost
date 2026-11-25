import { CodeBlock, CodeBlockBody, CodeBlockHeader, CodeBlockMeta, type CodeSnippet } from "@/components/ui/code-block"

const snippets: CodeSnippet[] = [
  {
    label: "TypeScript",
    language: "tsx",
    code: `// Cars currently in a bay
const res = await fetch("/api/service-orders?status=in_workshop")
const orders: ServiceOrder[] = await res.json()

const total = orders.reduce((sum, o) => sum + o.estimate, 0)
console.log(orders.length, total)
`,
  },
  {
    label: "Terminal",
    language: "bash",
    code: `curl "http://localhost:5173/api/service-orders?status=in_workshop"`,
    hideLineNumbers: true,
  },
]

export default function CodeBlockDemo() {
  return (
    <CodeBlock snippets={snippets}>
      <CodeBlockHeader>
        <CodeBlockMeta>GET</CodeBlockMeta>
      </CodeBlockHeader>
      <CodeBlockBody />
    </CodeBlock>
  )
}
