'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { Button } from '@/components/ui/button'
import { IconArrowElbow } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { toast } from 'sonner'

export function PromptForm({
  input,
  setInput,
  sendMessage,
  isLoading
}: {
  input: string
  setInput: (value: string) => void
  sendMessage: (message: { text: string }) => void
  isLoading: boolean
}) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          (e.target as HTMLFormElement)['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        try {
          sendMessage({ text: value })
        } catch {
          toast(
            <div className="text-red-600">
              You have reached your message limit! Please try again later, or{' '}
              <a
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
                href="https://vercel.com/templates/next.js/gemini-ai-chatbot"
              >
                deploy your own version
              </a>
              .
            </div>
          )
        }
      }}
    >
      <div className="relative flex max-h-50 w-full grow flex-col overflow-hidden bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-12 sm:rounded-full sm:px-12 shadow-sm">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-15 max-h-16 w-full bg-transparent placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-zinc-100 resize-none px-4 py-5 focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-4 top-3 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={input === '' || isLoading}
                className="bg-transparent shadow-none text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
