/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import { SparklesIcon } from '../ui/icons'
import { useActions, useUIState } from 'ai/rsc'
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState
} from 'react'

export const suggestions = [
  "Tell me about Mohd Kaif's projects",
  'Give me the resume download link of Mohd Kaif',
  'How can I contact Mohd Kaif?'
]
export function PortfolioCard({ user }: { user: string }) {
  // fetch top 2 projects of kaifcoder from github
  const [projects, setProjects] = useState([]) as any
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')

  // fetch top 2 projects of kaifcoder from github
  const fetchProjects = async () => {
    setLoading(true)
    const response = await fetch(
      `https://api.github.com/users/kaifcoder/repos?sort=updated`
    )
    let data = await response.json()
    // get most starred 2 repositories
    data.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    data = data.slice(0, 4)
    console.log(data)
    setAvatar(data[0].owner.avatar_url)
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState()
  return (
    <>
      <Card className="w-full max-w-2xl p-8 grid gap-8 mb-2">
        <div className="flex flex-col items-center gap-6">
          <Avatar className="size-24">
            <AvatarImage src={avatar} />
            <AvatarFallback>MK</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold">Mohd Kaif</h3>
            <p className="text-muted-foreground text-lg">
              Full Stack developer | Freelancer
            </p>
            <p className="text-muted-foreground text-base">
              I'm a skilled software engineer with a passion for building
              innovative solutions. My latest project was a cutting-edge web
              application that revolutionized the way users interact with data.
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="flex flex-wrap gap-3">
            <div>JavaScript</div>
            <div>React</div>
            <div>Next.JS</div>
            <div>Node.js</div>
            <div>TypeScript</div>
            <div>Git</div>
            <div>Flutter</div>
            <div>Firebase</div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {!loading &&
              projects &&
              projects.map(
                (
                  project: {
                    html_url: string | URL | undefined
                    name:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined
                    updated_at: string | number | Date
                    description:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined
                    full_name:
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | ReactPortal
                      | Promise<AwaitedReactNode>
                      | null
                      | undefined
                  },
                  index: Key | null | undefined
                ) => (
                  <Card
                    key={index}
                    className="flex flex-col gap-6 p-6 hover:cursor-pointer hover:shadow-lg"
                    onClick={() => window.open(project.html_url, '_blank')}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="text-xl font-semibold">
                          {project.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Updated{' '}
                          {new Date(project.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs flex-1">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <GitHubLogoIcon className="size-5" />
                      <span>{project.full_name}</span>
                    </div>
                  </Card>
                )
              )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="https://www.github.com/kaifcoder"
              className="flex items-center gap-2 text-muted-foreground hover:underline"
              prefetch={false}
            >
              <GitHubLogoIcon className="size-5" />
              <span>@kaifcoder</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/mohdkaif00"
              className="flex items-center gap-2 text-muted-foreground hover:underline"
              prefetch={false}
            >
              <LinkedInLogoIcon className="size-5" />
              <span>@LinkedIn</span>
            </Link>
          </div>
        </div>
      </Card>
      <div className="flex flex-col sm:flex-row items-start gap-2">
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
