'use client'

/* eslint-disable @next/next/no-img-element */

import { IconUser } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

// Different types of message bubbles.

interface UserMessageProps {
  readonly children: React.ReactNode
  readonly showAvatar?: boolean
}

export function UserMessage({ children, showAvatar }: UserMessageProps) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className={cn(
        "bg-background flex size-6.25 shrink-0 select-none items-center justify-center rounded-lg border shadow-sm",
        !showAvatar && 'invisible'
      )}>
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  )
}

export function BotMessage({
  content,
  className
}: {
  content: string
  className?: string
}) {
  return (
    <div className={cn('group relative flex items-start md:-ml-12', className)}>
      <div className="bg-background flex size-6.25 shrink-0 select-none items-center justify-center rounded-lg border shadow-sm">
        <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
            pre({ children }) {
              return <>{children}</>
            },
            code({ node, className, children, ...props }) {
              const childArray = Array.isArray(children) ? children : [children]
              
              if (childArray.length) {
                if (childArray[0] === '▍') {
                  return (
                    <span className="mt-1 animate-pulse cursor-default">▍</span>
                  )
                }

                if (typeof childArray[0] === 'string') {
                  childArray[0] = childArray[0].replace('`▍`', '▍')
                }
              }

              const match = /language-(\w+)/.exec(className || '')
              
              // Check if this is inline code (no language class and not inside pre)
              const isInline = !match && !className

              if (isInline) {
                return (
                  <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\\n$/, '')}
                  {...props}
                />
              )
            }
          }}
        >
          {content}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          'bg-background flex size-6.25 shrink-0 select-none items-center justify-center rounded-lg border shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-150 flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="bg-background flex size-6.25 shrink-0 select-none items-center justify-center rounded-lg border shadow-sm">
        <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
      </div>
      <div className="ml-4 h-6 flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}
