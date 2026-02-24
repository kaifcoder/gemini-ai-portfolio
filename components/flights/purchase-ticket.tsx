'use client'

import {
  CardIcon,
  GoogleIcon,
  LockIcon,
  SparklesIcon
} from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'

type Status =
  | 'requires_confirmation'
  | 'requires_code'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'in_progress'

interface PurchaseProps {
  status: Status
  summary: {
    airline: string
    departureTime: string
    arrivalTime: string
    price: number
    seat: string
  }
  chatId?: string
}

export const suggestions = [
  'Show flight status',
  'Show boarding pass for flight'
]

export const PurchaseTickets = ({
  status = 'requires_confirmation',
  summary = {
    airline: 'American Airlines',
    departureTime: '10:00 AM',
    arrivalTime: '12:00 PM',
    price: 100,
    seat: '1A'
  },
  chatId
}: PurchaseProps) => {
  const [currentStatus, setCurrentStatus] = useState(status)
  const { sendMessage } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({ api: '/api/chat' })
  })

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 p-4 sm:p-6 border border-zinc-200 rounded-2xl bg-white">
        <div className="flex">
          <div className="flex items-center gap-2 text-zinc-950">
            <div className="size-6 flex items-center justify-center bg-zinc-100 rounded-full text-zinc-500 [&>svg]:size-3">
              <CardIcon />
            </div>
            <div className="text-sm text-zinc-600">Visa · · · · 0512</div>
          </div>
          <div className="text-sm flex ml-auto items-center gap-1 border border-zinc-200 px-3 py-0.5 rounded-full">
            <GoogleIcon />
            Pay
          </div>
        </div>
        {currentStatus === 'requires_confirmation' ? (
          <div className="flex flex-col gap-4">
            <p className="">
              Thanks for choosing your flight and hotel reservations! Confirm
              your purchase to complete your booking.
            </p>
            <button
              className="p-2 text-center rounded-full cursor-pointer bg-zinc-900 text-zinc-50 hover:bg-zinc-600 transition-colors"
              onClick={() => {
                setCurrentStatus('completed')
              }}
            >
              Pay $981
            </button>
          </div>
        ) : currentStatus === 'completed' || currentStatus === 'in_progress' ? (
          <div className="flex items-center justify-center gap-3 text-green-600">
            Purchase completed successfully!
          </div>
        ) : currentStatus === 'expired' ? (
          <div className="flex items-center justify-center gap-3">
            Your Session has expired!
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          'flex flex-col sm:flex-row items-start gap-2',
          currentStatus === 'completed' ? 'opacity-100' : 'opacity-0'
        )}
      >
        {suggestions.map(suggestion => (
          <button
            key={suggestion}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer"
            onClick={async () => {
              sendMessage({ text: suggestion })
            }}
          >
            <SparklesIcon />
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
