"use client"

import * as React from "react"
import { Highlight, type PrismTheme, type Token } from "prism-react-renderer"
import { cn } from "@/lib/utils"
import { Copy } from "@/components/ui/copy"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type CodeSnippet = {
  /** Tab label, unique within the block. */
  label: string
  /**
   * Prism language, e.g. `tsx`, `typescript`, `json`, `sql`, `yaml`. Languages that are not
   * bundled with prism-react-renderer (such as `bash`) render as plain text.
   */
  language: string
  /** The code itself. */
  code: string
  /** Hide the line-number gutter for this snippet. */
  hideLineNumbers?: boolean
  /** Hide the copy button for this snippet. */
  hideCopy?: boolean
}

type CodeBlockContextValue = {
  snippets: CodeSnippet[]
  active: CodeSnippet
  setActive: (label: string) => void
}

const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(null)

function useCodeBlock() {
  const context = React.useContext(CodeBlockContext)
  if (!context) throw new Error("CodeBlock parts must be used inside <CodeBlock>.")
  return context
}

/*
 * Token colours come from Ghost theme utilities instead of a Prism colour theme, so the
 * highlighting follows light / dark mode with the rest of the system. The first matching
 * token type wins.
 */
const TOKEN_CLASS: Record<string, string> = {
  comment: "text-muted-foreground",
  prolog: "text-muted-foreground",
  doctype: "text-muted-foreground",
  cdata: "text-muted-foreground",
  keyword: "text-primary",
  atrule: "text-primary",
  selector: "text-primary",
  important: "text-primary",
  string: "text-success-text",
  "template-string": "text-success-text",
  char: "text-success-text",
  "attr-value": "text-success-text",
  regex: "text-success-text",
  inserted: "text-success-text",
  number: "text-pending-text",
  boolean: "text-pending-text",
  constant: "text-pending-text",
  symbol: "text-pending-text",
  function: "text-info-text",
  "class-name": "text-info-text",
  "maybe-class-name": "text-info-text",
  builtin: "text-info-text",
  property: "text-error-text",
  tag: "text-error-text",
  "attr-name": "text-error-text",
  deleted: "text-error-text",
  punctuation: "text-muted-foreground",
  operator: "text-muted-foreground",
}

/** Empty Prism theme: no inline colours, everything is styled through TOKEN_CLASS. */
const NO_THEME: PrismTheme = { plain: {}, styles: [] }

function tokenClass(token: Token) {
  for (const type of token.types) {
    const cls = TOKEN_CLASS[type]
    if (cls) return cls
  }
  return undefined
}

type CodeBlockProps = Omit<React.ComponentProps<typeof Tabs>, "value" | "defaultValue" | "onValueChange"> & {
  /** One snippet per tab. Must contain at least one. */
  snippets: CodeSnippet[]
  /** Label of the initially active snippet (uncontrolled). */
  defaultValue?: string
  /** Label of the active snippet (controlled). */
  value?: string
  onValueChange?: (label: string) => void
}

/**
 * A code surface with one or more tabbed snippets, syntax highlighting, optional line numbers and
 * a copy button. Compose with CodeBlockHeader (tabs, meta, copy) and CodeBlockBody (the code).
 */
function CodeBlock({
  snippets,
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? snippets[0]?.label)
  const current = value ?? uncontrolled
  const active = snippets.find((s) => s.label === current) ?? snippets[0]

  const setActive = React.useCallback(
    (label: string) => {
      if (value === undefined) setUncontrolled(label)
      onValueChange?.(label)
    },
    [value, onValueChange]
  )

  const context = React.useMemo(() => ({ snippets, active, setActive }), [snippets, active, setActive])

  if (!active) return null

  return (
    <CodeBlockContext.Provider value={context}>
      <Tabs
        data-slot="code-block"
        value={active.label}
        onValueChange={setActive}
        className={cn("w-full min-w-0 gap-0 overflow-hidden rounded-xl border border-border bg-card", className)}
        {...props}
      >
        {children}
      </Tabs>
    </CodeBlockContext.Provider>
  )
}

type CodeBlockHeaderProps = React.ComponentProps<"div"> & {
  /** Hide the snippet tabs, e.g. for a single snippet with a filename in CodeBlockMeta. */
  hideLabels?: boolean
}

/** Header row: snippet tabs, then any children (usually CodeBlockMeta), then the copy button. */
function CodeBlockHeader({ hideLabels = false, className, children, ...props }: CodeBlockHeaderProps) {
  const { snippets, active } = useCodeBlock()

  return (
    <div
      data-slot="code-block-header"
      className={cn("flex min-h-10 items-center gap-2 border-b border-border bg-muted/40 pr-1 pl-2", className)}
      {...props}
    >
      {!hideLabels && (
        <TabsList variant="line" className="h-10 min-w-0 justify-start overflow-x-auto">
          {snippets.map((snippet) => (
            <TabsTrigger key={snippet.label} value={snippet.label} className="flex-none text-xs">
              {snippet.label}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      {children}
      {!active.hideCopy && (
        <Copy data-slot="code-block-copy" content={active.code} className={cn(!children && "ml-auto")} />
      )}
    </div>
  )
}

/** Secondary header text such as a file name or method, pushed to the right. */
function CodeBlockMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-meta"
      className={cn("ml-auto truncate font-mono text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

/** The highlighted code of the active snippet. Scrolls when the code is wider or taller than the block. */
function CodeBlockBody({ className, ...props }: React.ComponentProps<"div">) {
  const { active } = useCodeBlock()
  const showLineNumbers = !active.hideLineNumbers

  return (
    <div
      data-slot="code-block-body"
      className={cn("overflow-auto p-4 font-mono text-xs leading-5 text-foreground", className)}
      {...props}
    >
      <Highlight theme={NO_THEME} code={active.code.replace(/\n$/, "")} language={active.language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre
            data-slot="code-block-pre"
            className={cn("m-0 w-max min-w-full bg-transparent", showLineNumbers && "grid grid-cols-[auto_1fr] gap-x-4")}
          >
            {showLineNumbers && (
              <div aria-hidden="true" className="flex flex-col text-right text-muted-foreground/70 tabular-nums select-none">
                {tokens.map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
            )}
            <code>
              {tokens.map((line, i) => {
                const { style: _lineStyle, className: lineClass, ...lineProps } = getLineProps({ line })
                return (
                  <div key={i} className={lineClass} {...lineProps}>
                    {line.map((token, key) => {
                      const { style: _tokenStyle, className: tokClass, ...tokenProps } = getTokenProps({ token })
                      return <span key={key} className={cn(tokClass, tokenClass(token))} {...tokenProps} />
                    })}
                  </div>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}

export { CodeBlock, CodeBlockHeader, CodeBlockMeta, CodeBlockBody }
export type { CodeSnippet, CodeBlockProps }
