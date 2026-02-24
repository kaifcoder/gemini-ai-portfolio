import { streamText, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { auth } from '@/auth'
import { saveChat } from '@/app/actions'
import { nanoid } from '@/lib/utils'

export async function POST(request: Request) {
  const { id, messages } = await request.json()

  const session = await auth()

  // Convert UIMessages to model messages
  const modelMessages = await convertToModelMessages(messages)

  const result = streamText({
    model: google('gemini-2.5-flash'),
    temperature: 0,
    system: `
      You are a personal assistant to Mohd Kaif, helping to keep track of projects, experience, education, hobbies, and contact information. You act like a live resume that users can interact with. Users can be of any country and can ask questions in any language. 
      Here are the key details and flows to manage (call your tools for these and matching queries):
        1. Projects: List current and past projects, including descriptions, roles, and status updates.
        2. Experience: List work experience, including job titles, companies, and dates.
        3. Education: List educational background, including degrees, institutions, and dates.
        4. Hobbies: List hobbies and interests, including descriptions and activities.
        5. Contact: Provide contact information, including email, phone number, and social media links.

        Be sure to handle user queries with care and provide accurate information. Prove me suitable for the role of software engineer, full stack developer, mobile developer. Add call to actions for users to interact with the chatbot.

        === EXPERIENCE ===
        
        SAP Labs India, Bangalore | STAR Student, Full Stack Developer | Aug 2024 - Present
        
        ○ SAP Build Core Services Team:
          - Designed and implemented a Model Context Protocol (MCP) server for Registry Service, exposing standardized tool interfaces for AI agents to discover and interact with Registry APIs programmatically.
          - Enabled reactive streaming for MCP server by registering Security and Rate-Limit filters with async support using Spring Boot in registry service, resolving filter-chain incompatibilities that blocked streaming in non-async servlet contexts.
          - Implemented streaming endpoints using Spring WebFlux and wrote JUnit and Mockito tests covering edge cases for HTTP methods and error scenarios.
          - Led Java 21 upgrade readiness analysis for Registry microservice, ensuring Spring Boot dependency compatibility.
          - Enhanced SAP Booster service resilience via Circuit Breaker pattern and resolved UXC / Accessibility (WCAG) compliance issues.
        
        ○ Production Services Machine Learning Team:
          - Built secure backend integrations with SAP Credential Store service using RESTful APIs for credential management using SAP CAP (Node.js); Enhanced the Metrics Service queries to support timeseries filters.
          - Implemented embedding generation pipeline using SAP GenAI Hub for internal RAG workflows.
          - Developed Metrics UI and AI Agent Management UI for DARA, managing entire UI backlog in SAP UI5.
        
        Medishield Healthcare (Remote) | Freelancer - Full Stack Developer | Jan 2024 - Jun 2024
          - Built hybrid B2B/B2C e-commerce platform with Node.js/Express REST APIs, Flutter mobile apps, and Next.js admin dashboard.
          - Designed APIs for payments, invoicing, inventory integrating Razorpay, Zoho Books, Shiprocket; optimized MongoDB with strategic indexing.

        === EDUCATION ===
        
        BITS Pilani | M.Tech in Software Engineering | Aug 2024 - Current | CGPA: 8.77
        
        SRMCEM, Lucknow | B.Tech in Computer Science & Engineering | Graduated July 2024 | CGPA: 8.1

        === PROJECTS ===
        
        1. CodeVibe - AI Coding Platform
           - Built AI-powered coding assistant using LangGraph for multi-step reasoning and tool orchestration.
           - Real-time collaboration with Yjs, sandboxed execution via E2B, AI agent using LangGraph.
           - Tech: Next.js, TypeScript, LangGraph | GitHub: github.com/kaifcoder/codevibe
        
        2. Create-Polyglot - CLI Tool
           - Built CLI scaffolding polyglot microservices with Java/Spring Boot, Node.js, Python, Go templates + Dockerfiles.
           - Try: npx create-polyglot init | GitHub: github.com/kaifcoder/create-polyglot
        
        3. Event Management Platform - Microservices
           - Built distributed system with 7 microservices using Node.js, PostgreSQL, Kafka; implemented Saga pattern with compensation logic for distributed transactions.
           - Developed gRPC server/client for inter-service communication; configured Kong API Gateway; designed OpenAPI specs.
           - Tech: Node.js, PostgreSQL, Kafka, gRPC, Kong, Docker, Kubernetes | GitHub: github.com/BITSSAP2025AugAPIBP3Sections/APIBP-20242YA-Team-6
        
        4. WorkPlanner - Backend
           - Built Spring Boot API with JWT auth, Role based access control, Spring Data JPA; wrote JUnit tests.
           - Tech: Java 17, Spring Security, JPA, MySQL, Docker | GitHub: github.com/kaifcoder/workplanner-backend

        === TECHNICAL SKILLS ===
        
        Java Ecosystem: Java 17/21, Spring Boot 3.x, Spring Security, Spring Data JPA, WebFlux, Hibernate, Maven, JUnit 5, Mockito
        AI & ML: LangGraph, LangChain, RAG, Embeddings, SAP AI SDK, Model Context Protocol (MCP), Vector Search, SAP Joule
        Frontend: TypeScript, React, Next.js, SAP UI5, Tailwind CSS
        Backend & APIs: REST APIs, GraphQL, gRPC, Kafka, Microservices, Saga Pattern, SAP CAP, Node.js (Express), Python
        Cloud/DevOps: Docker, Kubernetes, SAP BTP, Cloud Foundry, Kong API Gateway, Jenkins, GitHub Actions
        Databases: MySQL, PostgreSQL, SAP HANA Cloud, MongoDB

        === ACHIEVEMENTS ===
        
        - Solved 300+ algorithmic problems on LeetCode (Data Structures & Algorithms)
        - Innvent for Scholars 2nd Runner Up: Built AI migration copilot for SAP Business Transformation Center

        kaif's interests: watching anime, Listening to Music, Exploring new technologies, AI/ML applications
    `,
    messages: modelMessages,
    tools: {
      showPortfolio: {
        description:
          'Show the UI for portfolio of user name which is Mohd Kaif.',
        inputSchema: z.object({
          user: z.string().describe('user name').optional()
        }),
        execute: async ({ user }) => {
          return { user: user || 'Mohd Kaif' }
        }
      },
      showContactInfo: {
        description: 'Show the contact information of the user.',
        inputSchema: z.object({
          user: z.string().describe('user name').optional()
        }),
        execute: async ({ user }) => {
          return { user: user || 'Mohd Kaif' }
        }
      },
      showLinkedIn: {
        description: 'Show the LinkedIn profile of the user.',
        inputSchema: z.object({
          user: z.string().describe('user name').optional()
        }),
        execute: async ({ user }) => {
          return { user: user || 'Mohd Kaif' }
        }
      },
      showResumeDownloadCard: {
        description: 'Show the UI to download the resume.',
        inputSchema: z.object({
          user: z.string().describe('user name')
        }),
        execute: async ({ user }) => {
          return {
            user,
            link: 'https://docs.google.com/document/d/1or49PZreGh2DtLzO4Y-7YmTnhw5DlqHz5nN7CIhWCAY/edit?usp=sharing'
          }
        }
      },
      showProjects: {
        description:
          'Show the UI projects of the Mohd Kaif. when user asks to tell about projects.',
        inputSchema: z.object({
          user: z.string().describe('user name').optional()
        }),
        execute: async ({ user }) => {
          return { user: user || 'Mohd Kaif' }
        }
      }
    },
    onFinish: async ({ response }) => {
      if (session?.user?.id) {
        try {
          const chatId = id || nanoid()
          const userId = session.user.id
          const path = `/chat/${chatId}`
          
          // Extract title from first user message's text content
          const firstMessage = messages[0]
          let title = 'New Chat'
          if (firstMessage?.parts) {
            const textPart = firstMessage.parts.find((part: { type: string }) => part.type === 'text')
            if (textPart && 'text' in textPart) {
              title = (textPart.text as string).substring(0, 100)
            }
          } else if (firstMessage?.content) {
            title = firstMessage.content.substring(0, 100)
          }

          await saveChat({
            id: chatId,
            title,
            userId,
            createdAt: new Date(),
            messages: [...messages, ...response.messages],
            path
          })
        } catch (error) {
          console.error('Failed to save chat:', error)
        }
      }
    }
  })

  return result.toUIMessageStreamResponse()
}
