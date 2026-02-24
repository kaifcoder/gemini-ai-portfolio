import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { formatDate } from '@/lib/utils'
import { getSharedChat } from '@/app/actions'
import { ChatList } from '@/components/chat-list'
import { FooterText } from '@/components/footer'
import type { UIMessage as Message } from 'ai'

interface SharePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: SharePageProps): Promise<Metadata> {
  const chat = await getSharedChat(params.id)

  return {
    title: chat?.title.slice(0, 50) ?? 'Chat'
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const chat = await getSharedChat(params.id)

  if (!chat || !chat?.sharePath) {
    notFound()
  }

  // Convert chat messages to Message format for ChatList
  const messages: Message[] = chat.messages
    .filter((message: any) => message.role !== 'system')
    .map((message: any, index: number) => {
      const parts: Message['parts'] = []
      
      // Add text content as text part
      if (message.content) {
        parts.push({ type: 'text' as const, text: message.content })
      }
      
      // Note: Tool parts from stored messages may not have the full UI structure
      // For shared pages, we mainly show text content

      return {
        id: `${chat.id}-${index}`,
        role: message.role as 'user' | 'assistant',
        parts
      }
    })

  return (
    <>
      <div className="flex-1 space-y-6">
        <div className="border-b bg-background px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-2xl">
            <div className="space-y-1 md:-mx-8">
              <h1 className="text-2xl font-bold">{chat.title}</h1>
              <div className="text-sm text-muted-foreground">
                {formatDate(chat.createdAt)} · {chat.messages.length} messages
              </div>
            </div>
          </div>
        </div>
        <ChatList messages={messages} isShared={true} />
      </div>
      <FooterText className="py-8" />
    </>
  )
}
