const ORIGIN_HOST = "G-FKTWBWEW5Y.fps.goog";

export default async (request, context) => {
  const url = new URL(request.url);
  url.hostname = ORIGIN_HOST;
  url.port = "";
  url.protocol = "https:";

  const proxyRequest = new Request(url, request);
  proxyRequest.headers.set("Host", ORIGIN_HOST);

  const country = context.geo?.country?.code;
  const region = context.geo?.subdivision?.code;
  if (country) proxyRequest.headers.set("X-Forwarded-Country", country);
  if (region) proxyRequest.headers.set("X-Forwarded-Region", region);

  return fetch(proxyRequest);
};
