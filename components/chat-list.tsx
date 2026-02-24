import { Session } from '@/lib/types'
import { UIMessage as Message, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import { BotCard, BotMessage, UserMessage } from './ui/chat-message'
import DownloadResumeCard from './portfolio/resume-card'
import { PortfolioCard } from './component/portfolio-card'
import LinkedinFrame from './component/linkedin-frame'
import { ContactInfo } from './component/contact-info'
import { ProjectGrid } from './component/porject-grid'

export interface ChatList {
  messages: Message[]
  session?: Session
  isShared: boolean
}

interface ToolInvocationResultProps {
  readonly toolName: string
  readonly result: unknown
}

function ToolInvocationResult({ toolName, result }: ToolInvocationResultProps) {
  switch (toolName) {
    case 'showPortfolio':
      return (
        <BotCard>
          <PortfolioCard />
        </BotCard>
      )
    case 'showLinkedIn':
      return (
        <BotCard>
          <LinkedinFrame user="mohd kaif" />
        </BotCard>
      )
    case 'showContactInfo':
      return (
        <BotCard>
          <ContactInfo />
        </BotCard>
      )
    case 'showResumeDownloadCard':
      return (
        <BotCard>
          <DownloadResumeCard summary={{ link: (result as { link?: string })?.link || 'https://docs.google.com/document/d/1or49PZreGh2DtLzO4Y-7YmTnhw5DlqHz5nN7CIhWCAY/edit?usp=sharing' }} />
        </BotCard>
      )
    case 'showProjects':
      return (
        <BotCard>
          <ProjectGrid />
        </BotCard>
      )
    default:
      return null
  }
}

interface ToolInvocationLoadingProps {
  readonly toolName: string
}

function ToolInvocationLoading({ toolName }: ToolInvocationLoadingProps) {
  return (
    <BotCard>
      <div className="animate-pulse text-zinc-500">Loading {toolName}...</div>
    </BotCard>
  )
}

// Helper to extract text content from message parts
function getMessageText(message: Message): string {
  return message.parts
    .filter(isTextUIPart)
    .map(part => part.text)
    .join('')
}

// Helper to get tool invocations from message parts
function getToolParts(message: Message) {
  return message.parts.filter(isToolUIPart)
}

export function ChatList({ messages, session, isShared }: ChatList) {
  if (!messages.length) return null

  return (
    <div className="relative mx-auto max-w-4xl grid auto-rows-max gap-8 px-4">
      {!isShared && !session ? <></> : null}

      {messages.map((message) => {
        const textContent = getMessageText(message)
        const toolParts = getToolParts(message)

        if (message.role === 'user') {
          return (
            <div key={message.id}>
              <UserMessage showAvatar>{textContent}</UserMessage>
            </div>
          )
        }

        if (message.role === 'assistant') {
          return (
            <div key={message.id}>
              {textContent && <BotMessage content={textContent} />}
              {toolParts.map((toolPart) => {
                const toolName = getToolName(toolPart)
                const toolCallId = toolPart.toolCallId
                const state = toolPart.state

                if (state === 'output-available') {
                  return (
                    <ToolInvocationResult
                      key={toolCallId}
                      toolName={toolName}
                      result={toolPart.output}
                    />
                  )
                } else {
                  return (
                    <ToolInvocationLoading key={toolCallId} toolName={toolName} />
                  )
                }
              })}
            </div>
          )
        }

        return null
      })}
    </div>
  )
}
