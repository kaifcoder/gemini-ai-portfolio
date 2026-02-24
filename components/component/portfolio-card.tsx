/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
'use client'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

interface GitHubProject {
  html_url: string
  name: string
  updated_at: string
  description: string
  full_name: string
  stargazers_count: number
  owner?: {
    avatar_url?: string
  }
}

export function PortfolioCard({ user }: Readonly<{ user?: string }>) {
  // fetch top 2 projects of kaifcoder from github
  const [projects, setProjects] = useState<GitHubProject[]>([])
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
    data.sort((a: GitHubProject, b: GitHubProject) => b.stargazers_count - a.stargazers_count)
    data = data.slice(0, 4)
    console.log(data)
    setAvatar(data[0]?.owner?.avatar_url || '')
    setProjects(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <Card className="w-full max-w-2xl p-8 grid gap-8 mb-2">
      <div className="flex flex-col items-center gap-6">
        <Avatar className="size-24">
          <AvatarImage src={avatar} />
          <AvatarFallback>MK</AvatarFallback>
          </Avatar>
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold">Mohd Kaif</h3>
            <p className="text-muted-foreground text-lg">
              STAR Student, Full Stack Developer | SAP Labs India
            </p>
            <p className="text-muted-foreground text-base">
              Full Stack Developer at SAP Labs India building MCP servers, Spring WebFlux streaming,
              and AI/ML integrations. Pursuing M.Tech from BITS Pilani (8.77 CGPA). 
              300+ LeetCode problems solved. Innvent for Scholars 2nd Runner Up.
            </p>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="flex flex-wrap gap-3">
            <div>Java 17/21</div>
            <div>Spring Boot</div>
            <div>WebFlux</div>
            <div>LangGraph</div>
            <div>MCP</div>
            <div>Next.JS</div>
            <div>SAP UI5</div>
            <div>Kafka</div>
            <div>gRPC</div>
            <div>Docker</div>
            <div>K8s</div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {!loading &&
              projects &&
              projects.map((project, index) => (
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
  )
}
