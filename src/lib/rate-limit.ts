import { env } from "@/lib/env";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding-window rate limiter for the contact form: 3 requests per hour per IP.
 *
 * When Upstash credentials are unset (local/CI/fresh clones), the limiter is
 * not constructed and `checkRateLimit` fails open — every request is allowed.
 * Real credentials in production activate throttling.
 */
const ratelimit =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(3, "1 h"),
        prefix: "portfolio:contact",
      })
    : null;

export async function checkRateLimit(identifier: string): Promise<{ allowed: boolean; remaining: number }> {
  // Fail open when rate limiting is not configured.
  if (!ratelimit) {
    return { allowed: true, remaining: 3 };
  }

  const { success, remaining } = await ratelimit.limit(identifier);
  return { allowed: success, remaining };
}
