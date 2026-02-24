import { kv } from '@vercel/kv'
import type { NextFetchEvent, NextRequest } from 'next/server'

const MAX_REQUESTS = 50

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Skip rate limiting in development mode
  if (process.env.NODE_ENV === 'development') {
    return undefined
  }

  // Skip rate limiting if KV is not configured
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return undefined
  }

  if (req.method === 'POST') {
    try {
      // Use x-real-ip, x-forwarded-for for rate limiting
      const realIp = req.headers.get('x-real-ip') || 
                     req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                     'anonymous'
      const pipeline = kv.pipeline()
      pipeline.incr(`rate-limit:${realIp}`)
      pipeline.expire(`rate-limit:${realIp}`, 60 * 60 * 24)
      const [requests] = (await pipeline.exec()) as [number]

      if (requests > MAX_REQUESTS) {
        return new Response('Too many requests', { status: 429 })
      }
    } catch (error) {
      // Failed to perform rate limit check - allowing request to proceed
      console.error('Rate limit check failed, allowing request to proceed:', error)
      return undefined
    }
  }
}

export const config = {
  matcher: ['/', '/chat/:id*', '/share/:id*']
}
