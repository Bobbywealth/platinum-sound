/**
 * Rate Limiting Middleware
 * Simple in-memory rate limiter for API routes
 * 
 * NOTE: For production, use a distributed solution like Upstash Redis
 * This is a basic implementation for development/prototyping
 */

// In-memory store for rate limiting
// In production, replace with Redis or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

/**
 * Simple rate limiter function
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 100 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = `${identifier}:${Math.floor(now / config.windowMs)}`
  
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    // New window
    const resetTime = now + config.windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: config.maxRequests - 1, resetTime }
  }
  
  if (record.count >= config.maxRequests) {
    // Rate limited
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }
  
  // Increment count
  record.count++
  rateLimitStore.set(key, record)
  
  return { 
    allowed: true, 
    remaining: config.maxRequests - record.count, 
    resetTime: record.resetTime 
  }
}

/**
 * Clean up expired entries from the store
 * Should be called periodically
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Cleanup interval (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}

/**
 * Rate limit configurations for different routes
 */
export const rateLimitConfigs = {
  // Strict: 5 requests per minute (login, sensitive ops)
  strict: { windowMs: 60000, maxRequests: 5 },
  
  // Standard: 60 requests per minute (general API)
  standard: { windowMs: 60000, maxRequests: 60 },
  
  // Relaxed: 200 requests per minute (read operations)
  relaxed: { windowMs: 60000, maxRequests: 200 },
  
  // Auth-specific limits
  login: { windowMs: 60000, maxRequests: 5 }, // 5 login attempts per minute
  passwordReset: { windowMs: 3600000, maxRequests: 3 }, // 3 per hour
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}
