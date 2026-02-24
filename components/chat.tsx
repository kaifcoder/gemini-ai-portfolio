'use client'

import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { Session } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useChat } from '@ai-sdk/react'
import type { UIMessage as Message } from 'ai'
import { DefaultChatTransport } from 'ai'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  session?: Session
  missingKeys: string[]
}

export function Chat({ id, className, session, missingKeys, initialMessages }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [_, setNewChatId] = useLocalStorage('newChatId', id)
  const [input, setInput] = useState('')

  const { messages, sendMessage, status } = useChat({
    id,
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    messages: initialMessages,
    onFinish: () => {
      if (session?.user) {
        router.refresh()
      }
    }
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, path, session?.user, messages])

  useEffect(() => {
    setNewChatId(id)
  })

  useEffect(() => {
    missingKeys.map(key => {
      toast.error(`Missing ${key} environment variable!`)
    })
  }, [missingKeys])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group w-full overflow-y-auto overflow-x-hidden scroll-smooth pl-0 peer-data-[state=open]:lg:pl-50 peer-data-[state=open]:xl:pl-62.5"
      ref={scrollRef}
    >
      <div className={cn('pb-37.5 pt-4 min-h-full', className)} ref={messagesRef}>
        {messages.length ? (
          <ChatList messages={messages} isShared={false} session={session} />
        ) : (
          <EmptyScreen />
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        messages={messages}
        sendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}
