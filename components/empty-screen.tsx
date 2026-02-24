import { ExternalLink } from '@/components/external-link'
import { LinkPreview } from './ui/link-preview'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 sm:p-8 p-4 text-sm sm:text-base shadow-lg">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-semibold max-w-fit inline-block text-zinc-900 dark:text-zinc-100">
          {/* Generative ui portfolio */}
          AI Portfolio of Mohd Kaif
        </h1>
        <div className="leading-normal text-zinc-700 dark:text-zinc-300">
          {/* describe this portfolio to users */}
          This is a unique Portfolio of Mohd Kaif In which user can interact
          with the AI chatbot and can see the projects and blogs. This is Made
          with{' '}
          <LinkPreview
            url="https://ui.aceternity.com"
            className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
          >
            Aceternity UI
          </LinkPreview>
          ,{' '}
          <LinkPreview
            url="https://ai.google.dev/gemini-api/docs"
            className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-violet-500"
          >
            Google Gemini
          </LinkPreview>
          ,{' '}
          <LinkPreview url="https://www.vercel.com/next" className="font-bold text-zinc-900 dark:text-zinc-100">
            Next.JS
          </LinkPreview>{' '}
          and Vercel AI SDK. Enjoy! 🚀
        </div>
      </div>
    </div>
  )
}
