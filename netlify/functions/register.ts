import type { Handler, HandlerEvent } from "@netlify/functions";

const UPSTREAM_URL =
  "https://test-healthyday-backend-773381060399.asia-south1.run.app/api/register";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): { allowed: true } | { allowed: false; retryAfter: number } {
  const now = Date.now();
  for (const [key, val] of rateLimitStore) {
    if (now - val.windowStart > RATE_LIMIT_WINDOW_MS) rateLimitStore.delete(key);
  }
  const entry = rateLimitStore.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000),
    };
  }
  entry.count++;
  return { allowed: true };
}

const normalizeMobile = (s: string) => s.trim().replace(/^\+/, "");

const parseList = (envVar: string | undefined): string[] =>
  (envVar || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const parseMobileList = (envVar: string | undefined): string[] =>
  parseList(envVar).map(normalizeMobile);

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let referrerMobile = "";
  let bodyIp = "";
  try {
    const body = JSON.parse(event.body || "{}");
    referrerMobile = normalizeMobile(body.source || "");
    bodyIp = (body.ip_address || "").trim();
  } catch {
    // malformed body — proceed without checks
  }

  const isLoopback = (s: string) => s === "::1" || s === "127.0.0.1";

  const nfIp = event.headers["x-nf-client-connection-ip"] || "";
  const ip = nfIp && !isLoopback(nfIp)
    ? nfIp
    : bodyIp || event.headers["x-forwarded-for"]?.split(",")[0].trim() || "";

  const blacklistedIps = parseList(process.env.BLACKLISTED_IPS);
  const blacklistedMobiles = parseMobileList(process.env.BLACKLISTED_MOBILES);

  console.log("[blacklist] ip:", JSON.stringify(ip), "bodyIp:", JSON.stringify(bodyIp), "blacklistedIps:", blacklistedIps, "referrerMobile:", JSON.stringify(referrerMobile), "blacklistedMobiles:", blacklistedMobiles);

  if (
    (ip && blacklistedIps.includes(ip)) ||
    (bodyIp && blacklistedIps.includes(bodyIp)) ||
    (referrerMobile && blacklistedMobiles.includes(referrerMobile))
  ) {
    return {
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Access denied" }),
    };
  }

  if (ip) {
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      return {
        statusCode: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfter),
        },
        body: JSON.stringify({ message: "Too many requests. Please try again later." }),
      };
    }
  }

  const upstreamHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (event.headers["authorization"]) {
    upstreamHeaders["authorization"] = event.headers["authorization"];
  }
  if (event.headers["x-api-key"]) {
    upstreamHeaders["x-api-key"] = event.headers["x-api-key"];
  }

  const upstream = await fetch(UPSTREAM_URL, {
    method: "POST",
    headers: upstreamHeaders,
    body: event.body,
  });

  const responseText = await upstream.text();

  return {
    statusCode: upstream.status,
    headers: { "Content-Type": "application/json" },
    body: responseText,
  };
};
