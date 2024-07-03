// @ts-nocheck

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  createStreamableValue
} from 'ai/rsc'

import { nanoid, sleep } from '@/lib/utils'
import { saveChat } from '@/app/actions'
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  UserMessage
} from '@/components/stocks/message'
import { Chat } from '../types'
import { auth } from '@/auth'
import { FlightStatus } from '@/components/flights/flight-status'
import { SelectSeats } from '@/components/flights/select-seats'
import { ListFlights } from '@/components/flights/list-flights'
import { BoardingPass } from '@/components/flights/boarding-pass'
import { PurchaseTickets } from '@/components/flights/purchase-ticket'
import { CheckIcon, SpinnerIcon } from '@/components/ui/icons'
import { format } from 'date-fns'
import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import { ListHotels } from '@/components/hotels/list-hotels'
import { Destinations } from '@/components/flights/destinations'
import { Video } from '@/components/media/video'
import DownloadResumeCard from '@/components/portfolio/resume-card'
import { PortfolioCard } from '@/components/component/portfolio-card'
import LinkedinFrame from '@/components/component/linkedin-frame'
import { ContactInfo } from '@/components/component/contact-info'

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
)

async function describeImage(imageBase64: string) {
  'use server'

  const aiState = getMutableAIState()
  const spinnerStream = createStreamableUI(null)
  const messageStream = createStreamableUI(null)
  const uiStream = createStreamableUI()

  uiStream.update(
    <BotCard>
      <Video isLoading />
    </BotCard>
  )
  ;(async () => {
    try {
      let text = ''

      // attachment as video for demo purposes,
      // add your implementation here to support
      // video as input for prompts.
      if (imageBase64 === '') {
        await new Promise(resolve => setTimeout(resolve, 5000))

        text = `
      The books in this image are:

      1. The Little Prince by Antoine de Saint-Exupéry
      2. The Prophet by Kahlil Gibran
      3. Man's Search for Meaning by Viktor Frankl
      4. The Alchemist by Paulo Coelho
      5. The Kite Runner by Khaled Hosseini
      6. To Kill a Mockingbird by Harper Lee
      7. The Catcher in the Rye by J.D. Salinger
      8. The Great Gatsby by F. Scott Fitzgerald
      9. 1984 by George Orwell
      10. Animal Farm by George Orwell
      `
      } else {
        const imageData = imageBase64.split(',')[1]

        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })
        const prompt = 'List the books in this image.'
        const image = {
          inlineData: {
            data: imageData,
            mimeType: 'image/png'
          }
        }

        const result = await model.generateContent([prompt, image])
        text = result.response.text()
        console.log(text)
      }

      spinnerStream.done(null)
      messageStream.done(null)

      uiStream.done(
        <BotCard>
          <Video />
        </BotCard>
      )

      aiState.done({
        ...aiState.get(),
        interactions: [text]
      })
    } catch (e) {
      console.error(e)

      const error = new Error(
        'The AI got rate limited, please try again later.'
      )
      uiStream.error(error)
      spinnerStream.error(error)
      messageStream.error(error)
      aiState.done()
    }
  })()

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value
  }
}

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content: `${aiState.get().interactions.join('\n\n')}\n\n${content}`
      }
    ]
  })

  const history = aiState.get().messages.map(message => ({
    role: message.role,
    content: message.content
  }))
  // console.log(history)

  const textStream = createStreamableValue('')
  const spinnerStream = createStreamableUI(<SpinnerMessage />)
  const messageStream = createStreamableUI(null)
  const uiStream = createStreamableUI()

  ;(async () => {
    try {
      const result = await streamText({
        model: google('models/gemini-1.5-pro'),
        temperature: 0,
        tools: {
          showFlights: {
            description:
              "List available flights in the UI. List 3 that match user's query.",
            parameters: z.object({
              departingCity: z.string(),
              arrivalCity: z.string(),
              departingAirport: z.string().describe('Departing airport code'),
              arrivalAirport: z.string().describe('Arrival airport code'),
              date: z
                .string()
                .describe(
                  "Date of the user's flight, example format: 6 April, 1998"
                )
            })
          },
          showPortfolio: {
            description:
              'Show the UI for portfolio of user name which is Mohd Kaif.',
            parameters: z.object({
              user: z.string().describe('user name').optional()
            })
          },
          showContactInfo: {
            description: 'Show the contact information of the user.',
            parameters: z.object({
              user: z.string().describe('user name').optional()
            })
          },
          showLinkedIn: {
            description: 'Show the LinkedIn profile of the user.',
            parameters: z.object({
              user: z.string().describe('user name').optional()
            })
          },
          showSeatPicker: {
            description:
              'Show the UI to choose or change seat for the selected flight.',
            parameters: z.object({
              departingCity: z.string(),
              arrivalCity: z.string(),
              flightCode: z.string(),
              date: z.string()
            })
          },
          showResumeDownloadCard: {
            description: 'Show the UI to download the resume.',
            parameters: z.object({
              user: z.string().describe('user name')
            })
          }

          // showResumeDownloadCard: {
          //   description: 'Show a card to download the resume.'
          // }
        },
        system: `\
You are a personal assistant to Mohd Kaif, helping to keep track of projects, experience, education, hobbies, and contact information. You act like a live resume that users can interact with. users can be of any country and can ask questions in any language. 
        Here are the key details and flows to manage:
          1. Projects: List current and past projects, including descriptions, roles, and status updates.
          2. Experience: List work experience, including job titles, companies, and dates.
          3. Education: List educational background, including degrees, institutions, and dates.
          4. Hobbies: List hobbies and interests, including descriptions and activities.
          5. Contact: Provide contact information, including email, phone number, and social media links.
          6. Chat: Provide a chat interface for users to ask questions and receive responses.

          Be sure to handle user queries with care and provide accurate information.

          Information about Mohd Kaif: 
          Mohd Kaif
Lucknow, UP, India | P: +91 9336834706| kaifmohd2014@gmail.com | Github | LinkedIn

EDUCATION	


SHRI RAMSWAROOP MEMORIAL COLLEGE OF ENGINEERING AND MANAGEMENT	Lucknow, UP, India
Bachelor of Technology	Expected July 2024
Major in Computer Science and engineering
Cumulative GPA: 7.8/10.0
Relevant Coursework:  Software Engineering; Operating Systems; Algorithms; Database Management system

RANI LAXMI BAI MEMORIAL SCHOOL	Lucknow, UP, India
Intermediate in Science stream 	Apr 2018 - Mar 2019
Percentage: 92.6%

INTERNSHIP/FREELANCE  EXPERIENCE	


MEDISHIELD HEALTHCARE  	
Freelancer (Full Stack App Developer) 	Jan 2024 – Jun 2024
Single handedly Led the development of the MediShield application including design, development, and deployment of android / iOS applications.
Node.js backend with full-fledged admin panel on NextJS.
Created seamless integration with Razor pay payment gateway, zoho books and shiprocket for Payment processing, order and inventory synchronization and shipping process respectively. 

VISANKA TECHNOLOGIES PVT. LTD.	
Android App developer 	dec 2022 – jan 2023
Completed one month internship on android development worked on truecaller clone project.

PROJECTS	


GEMINI MULTIPDF CHATBOT	Apr 2024
Streamlit-based application powered by the Gemini conversational AI model. Upload multiple PDF files, extract text, and engage in natural language conversations to receive detailed responses based on the document context. Enhance your interaction with PDF documents using this intuitive and intelligent chatbot.
100+ stars and 80+ forks on github and 5000+ unique users. Live Link

MEDISHIELD APP	jun 2024
MediShield App offers a streamlined solution for dental equipment needs. Browse a diverse catalog, place orders seamlessly, and track in real-time.
Live application on google play store with 100+ downloads and soon will be available on app store 
Technologies used are Flutter, firebase, mongodb, node.js, express, next.js and gemini for chatbot.

ERASER.IO CLONE	Mar 2024
A clone of Eraser.io built with a modern tech stack! Leveraging Next.js, Tailwind CSS, Shadcn/UI, Convex Database, and Kinde Authentication, this project aims to push the boundaries of web development. 
https://eraser-clone-2.vercel.app/ ( live link )


ADDITIONAL	


Technical Skills: Advanced in Full Stack development using next.js/flutter; Proficient in Data Structures and algorithms, Python, React.js, Node.js, c++ 
Languages: Fluent in Hindi and English
Certifications & Training: Fundamentals of Data Analytics by NASSCOM, Python and Artificial Intelligence training by IBM.
Publications: Gemini MultiPDF Chatbot: Multiple Document RAG Chatbot using Gemini Large Language Model (IJRASET)
Interests:  Listening to Music, Exploring new technologies

      `,
        messages: [...history]
      })

      let textContent = ''
      spinnerStream.done(null)

      for await (const delta of result.fullStream) {
        const { type } = delta

        if (type === 'text-delta') {
          const { textDelta } = delta

          textContent += textDelta
          messageStream.update(<BotMessage content={textContent} />)

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: textContent
              }
            ]
          })
        } else if (type === 'tool-call') {
          const { toolName, args } = delta
          console.log(toolName, args)
          if (toolName === 'listDestinations') {
            const { destinations } = args

            uiStream.update(
              <BotCard>
                <Destinations destinations={destinations} />
              </BotCard>
            )

            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: `Here's a list of holiday destinations based on the books you've read. Choose one to proceed to booking a flight. \n\n ${args.destinations.join(', ')}.`,
                  display: {
                    name: 'listDestinations',
                    props: {
                      destinations
                    }
                  }
                }
              ]
            })
          } else if (toolName === 'showPortfolio') {
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: 'Here is the portfolio of Mohd Kaif.',
                  display: {
                    name: 'showPortfolio',
                    props: {
                      user: args
                    }
                  }
                }
              ]
            })

            uiStream.update(
              <BotCard>
                <PortfolioCard />
              </BotCard>
            )
          } else if (toolName === 'showLinkedIn') {
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: 'Here is the linkedin of Mohd Kaif.',
                  display: {
                    name: 'showLinkedIn',
                    props: {
                      user: args
                    }
                  }
                }
              ]
            })

            uiStream.update(
              <BotCard>
                <LinkedinFrame />
              </BotCard>
            )
          } else if (toolName === 'showContactInfo') {
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: 'Here is the Contact info of Mohd Kaif.',
                  display: {
                    name: 'showContactInfo',
                    props: {
                      user: args
                    }
                  }
                }
              ]
            })

            uiStream.update(
              <BotCard>
                <ContactInfo />
              </BotCard>
            )
          } else if (toolName === 'showResumeDownloadCard') {
            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: 'Here is a link to download the resume.',
                  display: {
                    name: 'showResumeDownloadCard',
                    props: {
                      summary: args
                    }
                  }
                }
              ]
            })
            uiStream.update(
              <BotCard>
                <DownloadResumeCard />
              </BotCard>
            )
          }
        }
      }

      uiStream.done()
      textStream.done()
      messageStream.done()
    } catch (e) {
      console.log(e)
      const error = new Error(
        'The AI got rate limited, please try again later.'
      )
      uiStream.error(error)
      textStream.error(error)
      messageStream.error(error)
      aiState.done()
    }
  })()

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id?: string
  name?: string
  display?: {
    name: string
    props: Record<string, any>
  }
}

export type AIState = {
  chatId: string
  interactions?: string[]
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
  spinner?: React.ReactNode
  attachments?: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,

    describeImage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), interactions: [], messages: [] },
  unstable_onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  unstable_onSetAIState: async ({ state }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'assistant' ? (
          message.display?.name === 'showFlights' ? (
            <BotCard>
              <ListFlights summary={message.display.props.summary} />
            </BotCard>
          ) : message.display?.name === 'showContactInfo' ? (
            <BotCard>
              <SelectSeats summary={message.display.props.summary} />
            </BotCard>
          ) : message.display?.name === 'showLinkedIn' ? (
            <BotCard>
              <LinkedinFrame />
            </BotCard>
          ) : message.display?.name === 'showPortfolio' ? (
            <BotCard>
              <PortfolioCard />
            </BotCard>
          ) : message.display?.name === 'showResumeDownloadCard' ? (
            <BotCard>
              <DownloadResumeCard
                link={
                  'https://docs.google.com/document/d/1or49PZreGh2DtLzO4Y-7YmTnhw5DlqHz5nN7CIhWCAY/edit?usp=sharing'
                }
              />
            </BotCard>
          ) : (
            <BotMessage content={message.content} />
          )
        ) : message.role === 'user' ? (
          <UserMessage showAvatar>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
