'use client'
import React from 'react'
import { BentoGrid, BentoGridItem } from '../ui/bento-grid'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

export function ProjectGrid() {
  // fetch most starred repositories of kaifcoder in descending order
  const [items, setItems] = React.useState([]) as any
  React.useEffect(() => {
    fetch(
      'https://api.github.com/users/kaifcoder/repos?sort=updated&direction=desc'
    )
      .then(res => res.json())
      .then(data => {
        // sort the repositories with max stars in descending order and show top 7
        data.sort((a: any, b: any) => b.forks - a.forks)
        data = data.slice(0, 5)
        setItems(data)
      })
  }, [])

  return (
    <BentoGrid className="max-w-4xl mx-auto ">
      {items &&
        items.map(
          (
            item: {
              [x: string]: URL
              homepage: any
              full_name: any
              name: any
              description: any
            },
            i: React.Key | null | undefined
          ) => (
            <BentoGridItem
              key={i}
              title={item.name}
              description={
                <div className="h-full flex flex-col">
                  <p className="text-muted-foreground text-xs flex-1">
                    {item.description}
                  </p>
                  <div className="flex mt-5 items-center gap-2 text-muted-foreground text-sm">
                    <GitHubLogoIcon className="size-5" />
                    <span>{item.full_name}</span>
                  </div>
                </div>
              }
              icon={<GitHubLogoIcon className="size-4 text-neutral-500" />}
              className={cn(
                i === 3 || i === 6 ? 'md:col-span-2' : '',
                'bg-gray-100 cursor-pointer hover:shadow-lg p-6 rounded-xl transition-colors'
              )}
              onClick={() => {
                window.open(item.html_url, '_blank')
              }}
            />
          )
        )}
    </BentoGrid>
  )
}
