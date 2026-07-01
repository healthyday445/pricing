export default async (request, context) => {
  const url = new URL(request.url);
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // Do not redirect social media crawlers, link preview bots, or search engines so they scrape the correct URL tags
  const isBot = /bot|crawler|spider|crawling|whatsapp|facebookexternalhit|facebookcatalog|twitter|telegram|linkedin|slack|discord|google|bing|apple|duckduckgo|baiduspider|yandex/i.test(userAgent);
  if (isBot) {
    return context.next();
  }

  // Get the country code, defaulting to IN if not found just in case
  const countryCode = context.geo?.country?.code || "IN";

  // If outside India, redirect to the USD equivalent pages
  if (countryCode !== "IN") {
    if (url.pathname === "/pricing" || url.pathname === "/") {
      return Response.redirect(new URL("/usd-pricing", request.url), 302);
    }
    if (url.pathname === "/renew" || url.pathname.startsWith("/renew/")) {
      return Response.redirect(new URL("/usd-renew", request.url), 302);
    }
    if (url.pathname === "/upgrade") {
      return Response.redirect(new URL("/usd_upgrade", request.url), 302);
    }
  }

  // Otherwise, allow the request to proceed as normal
  return context.next();
};
