/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/ui/card'
import { JSX, SVGProps } from 'react'
import { SparklesIcon } from '../ui/icons'
import { useActions, useUIState } from 'ai/rsc'

export const suggestions = [
  "Tell me about Mohd Kaif's projects",
  'Give me the resume download link of Mohd Kaif',
  'Show me Portfolio of Kaif'
]
export function ContactInfo() {
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState()
  return (
    <>
      <Card className="w-full max-w-md p-6 grid gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold">Mohd Kaif</h3>
            <p className="text-muted-foreground">
              Full Stack Developer | Freelancer
            </p>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <MailIcon className="size-5 text-muted-foreground" />
            <a
              href="mailto:kaifmohd2014@gmail.com"
              className="text-muted-foreground hover:underline"
            >
              kaifmohd2014@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="size-5 text-muted-foreground" />
            <a
              href="tel:+91936834706"
              className="text-muted-foreground hover:underline"
            >
              +91 9336834706
            </a>
          </div>
          <div className="flex items-center gap-2">
            <LinkedinIcon className="size-5 text-muted-foreground" />
            <a
              href="https://in.linkedin.com/in/mohdkaif00"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </Card>
      <div className="flex flex-col mt-4 sm:flex-row max-w-2xl items-start gap-2">
        {suggestions.map(suggestion => (
          <div
            key={suggestion}
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors bg-zinc-50 hover:bg-zinc-100 rounded-xl cursor-pointer"
            onClick={async () => {
              const response = await submitUserMessage(suggestion)
              setMessages((currentMessages: any[]) => [
                ...currentMessages,
                response
              ])
            }}
          >
            <SparklesIcon />
            {suggestion}
          </div>
        ))}
      </div>
    </>
  )
}

function LinkedinIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function MailIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function PhoneIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}
