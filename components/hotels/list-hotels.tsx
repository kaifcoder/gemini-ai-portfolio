'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

interface Hotel {
  id: number
  name: string
  description: string
  price: number
}

interface ListHotelsProps {
  hotels: Hotel[]
  chatId?: string
}

export const ListHotels = ({
  hotels = [
    {
      id: 1,
      name: 'The St. Regis Rome',
      description: 'Renowned luxury hotel with a lavish spa',
      price: 450
    },
    {
      id: 2,
      name: 'The Inn at the Roman Forum',
      description: 'Upscale hotel with Roman ruins and a bar',
      price: 145
    },
    {
      id: 3,
      name: 'Hotel Roma',
      description: 'Vibrant property with free breakfast',
      price: 112
    }
  ],
  chatId
}: ListHotelsProps) => {
  const { sendMessage } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({ api: '/api/chat' })
  })

  return (
    <div className="grid gap-4">
      <p>
        We recommend a 3 night stay in Rome. Here are some hotels you can choose
        from.
      </p>
      <div className="grid gap-4 p-2 sm:p-4 border border-zinc-200 rounded-2xl bg-white">
        {hotels.map(hotel => (
          <div
            key={hotel.id}
            className="p-2 flex justify-between hover:bg-zinc-50 rounded-xl cursor-pointer gap-4"
            onClick={async () => {
              sendMessage({ text: `I want to book the ${hotel.name}, proceed to checkout by calling checkoutBooking function.` })
            }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-20 bg-zinc-100 aspect-video rounded-lg overflow-hidden">
                <img
                  className="object-cover aspect-video h-full rounded-lg"
                  src={`/images/${hotel.id}.jpg`}
                  alt={`${hotel.name} hotel`}
                />
              </div>
              <div>
                <div className="font-medium">{hotel.name}</div>
                <div className="text-sm text-zinc-600">{hotel.description}</div>
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-lg font-medium text-right">
                ${hotel.price}
              </div>
              <div className="text-zinc-600 text-xs text-right">per night</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
