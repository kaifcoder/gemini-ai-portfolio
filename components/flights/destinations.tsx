'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

export const Destinations = ({ destinations, chatId }: { destinations: string[]; chatId?: string }) => {
  const { sendMessage } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({ api: '/api/chat' })
  })

  return (
    <div className="grid gap-4">
      <p>
        Here is a list of holiday destinations based on the books you have read.
        Choose one to proceed to booking a flight.
      </p>
      <div className="flex flex-col sm:flex-row items-start gap-2">
        {destinations.map(destination => (
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer"
            key={destination}
            onClick={async () => {
              sendMessage({ text: `I would like to fly to ${destination}, proceed to choose flights.` })
            }}
          >
            {destination}
          </button>
        ))}
      </div>
    </div>
  )
}
