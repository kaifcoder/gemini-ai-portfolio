import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import type { UIMessage as Message } from 'ai'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  messages: Message[]
  sendMessage: (message: { text: string }) => void
  isLoading: boolean
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  messages,
  sendMessage,
  isLoading
}: ChatPanelProps) {
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  const exampleMessages = [
    {
      heading: 'Know more about me',
      subheading: 'Get my projects, and more',
      message: 'Show me the profile of Mohd Kaif'
    },
    {
      heading: 'My Projects',
      subheading: "See what I've been working on",
      message: "Tell me about Mohd Kaif's projects"
    },
    {
      heading: 'Get my resume',
      subheading: 'Download my resume',
      message: 'Give me the resume download link of Mohd Kaif'
    },
    {
      heading: 'Contact me',
      subheading: 'Learn more about my background and experience',
      message: 'How can I contact Mohd Kaif?'
    }
  ]

  return (
    <div className="fixed inset-x-0 bg-zinc-50/95 dark:bg-zinc-950/70 backdrop-blur-sm bottom-0 w-full duration-300 ease-in-out peer-data-[state=open]:group-[]:lg:pl-62.5 peer-data-[state=open]:group-[]:xl:pl-75">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-3xl sm:px-4">
        <div className="mb-4 grid sm:grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={cn(
                  'cursor-pointer bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 rounded-2xl p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm hover:shadow-md',
                  index > 1 && 'hidden md:block'
                )}
                onClick={async () => {
                  try {
                    sendMessage({ text: example.message })
                  } catch {
                    toast(
                      <div className="text-red-600">
                        You have reached your message limit! Please try again
                        later.
                      </div>
                    )
                  }
                }}
              >
                <div className="font-medium text-zinc-900 dark:text-zinc-100">{example.heading}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-fit items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:pb-4">
          <PromptForm input={input} setInput={setInput} sendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
