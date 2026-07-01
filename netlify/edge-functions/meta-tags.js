export default async (request, context) => {
  const response = await context.next();
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const isPricingOrCheckout =
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/usd-pricing') ||
    pathname.startsWith('/renew') ||
    pathname.startsWith('/usd-renew') ||
    pathname.startsWith('/upgrade') ||
    pathname.startsWith('/usd_upgrade') ||
    pathname.includes('checkout') ||
    pathname.startsWith('/12m') ||
    pathname.startsWith('/6m') ||
    pathname.startsWith('/3m') ||
    pathname.startsWith('/thank-you');

  if (!isPricingOrCheckout) {
    return response;
  }

  const isUsd = pathname.includes('usd') || pathname.includes('_usd');

  const newTitle = "Yoga Plans-Healthyday";
  const newImage = isUsd
    ? "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/6795ce3db71ab6291dfa64b7/5397638_IntlEnglish%20Free%20Batch%20%20Day%207%20Vertical.png"
    : "https://d3jt6ku4g6z5l8.cloudfront.net/IMAGE/6795ce3db71ab6291dfa64b7/9753192_English%20Free%20Batch%20%20Day%207%20Vertical.png";

  let html = await response.text();

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${newTitle}</title>`);
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*"/i, `$1${newTitle}"`);
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*"/i, `$1${newTitle}"`);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*"/i, `$1${newTitle}"`);
  html = html.replace(/(<meta\s+property="og:image"\s+content=")[^"]*"/i, `$1${newImage}"`);
  html = html.replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*"/i, `$1${newImage}"`);

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
};
