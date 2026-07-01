import type { Handler, HandlerEvent } from "@netlify/functions";

const UPSTREAM_URL =
  "https://healthyday-backend-v2-773381060399.asia-south1.run.app/api/register";

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
  let parsedBody: Record<string, unknown> = {};
  try {
    parsedBody = JSON.parse(event.body || "{}");
    referrerMobile = normalizeMobile((parsedBody.source as string) || "");
  } catch {
    // malformed body — proceed without checks
  }

  const isLoopback = (s: string) => s === "::1" || s === "127.0.0.1";

  const nfIp = event.headers["x-nf-client-connection-ip"] || "";
  const rawXff = event.headers["x-forwarded-for"] || "";
  const xffIp = rawXff.split(",")[0].trim();
  const ip = xffIp && !isLoopback(xffIp) ? xffIp : (nfIp && !isLoopback(nfIp) ? nfIp : "");

  const blacklistedIps = parseList(process.env.BLACKLISTED_IPS);
  const blacklistedMobiles = parseMobileList(process.env.BLACKLISTED_MOBILES);

  const REDACT_HEADERS = new Set(["authorization", "cookie", "x-api-key"]);
  const sanitizedHeaders = Object.fromEntries(
    Object.entries(event.headers).filter(([key]) => !REDACT_HEADERS.has(key.toLowerCase()))
  );

  console.log(
    "[ip-debug] nfIp:", JSON.stringify(nfIp),
    "rawXff:", JSON.stringify(rawXff),
    "resolvedIp:", JSON.stringify(ip),
    "userAgent:", JSON.stringify(event.headers["user-agent"] || ""),
    "origin:", JSON.stringify(event.headers["origin"] || ""),
    "referer:", JSON.stringify(event.headers["referer"] || ""),
    "referrerMobile:", JSON.stringify(referrerMobile)
  );
  console.log("[ip-debug] allHeaders:", JSON.stringify(sanitizedHeaders));
  console.log("[ip-debug] body:", event.body);
  console.log("[blacklist] ip:", JSON.stringify(ip), "blacklistedIps:", blacklistedIps, "referrerMobile:", JSON.stringify(referrerMobile), "blacklistedMobiles:", blacklistedMobiles);

  if (
    (ip && blacklistedIps.includes(ip)) ||
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

  const outboundBody = JSON.stringify({ ...parsedBody, ip_address: ip });

  const upstream = await fetch(UPSTREAM_URL, {
    method: "POST",
    headers: upstreamHeaders,
    body: outboundBody,
  });

  const responseText = await upstream.text();

  return {
    statusCode: upstream.status,
    headers: { "Content-Type": "application/json" },
    body: responseText,
  };
};
