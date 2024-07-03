import { ExternalLink } from '@/components/external-link'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-zinc-50 sm:p-8 p-4 text-sm sm:text-base">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-semibold max-w-fit inline-block">
          {/* Generative ui portfolio */}
          Generative UI Portfolio
        </h1>
        <p className="leading-normal text-zinc-900">
          {/* describe this portfolio to users */}
          This is a unique Portfolio of Mohd Kaif In which user can interact
          with the AI chatbot and can see the projects and blogs. This is Made
          with Google Gemini, Next.js and Vercel AI SDK. Login to save your
          chats and share with others. Enjoy! 🚀
        </p>
      </div>
    </div>
  )
}
