/**
 * v0 by Vercel.
 * @see https://v0.dev/t/37OG1pmq7cM
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useActions, useUIState } from 'ai/rsc'
import { DownloadIcon } from '@radix-ui/react-icons'

interface DownloadResumeCardProps {
  summary: {
    link: string
  }
}

export default function DownloadResumeCard({
  summary = {
    link: 'https://docs.google.com/document/d/1or49PZreGh2DtLzO4Y-7YmTnhw5DlqHz5nN7CIhWCAY/edit?usp=sharing'
  }
}: DownloadResumeCardProps) {
  return (
    <Card className="w-full max-w-md p-6 grid gap-6">
      <div className="space-y-2">
        <CardTitle className="text-xl font-semibold">
          Download My Resume
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Get a copy of my up-to-date resume in PDF format.
        </CardDescription>
      </div>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => window.open(summary.link, '_blank')}
          variant="outline"
        >
          <DownloadIcon className="mr-2 h-5 w-5" />
          Download
        </Button>
        <div className="text-xs text-muted-foreground">
          Last updated: 2023-06-15
        </div>
      </div>
    </Card>
  )
}
