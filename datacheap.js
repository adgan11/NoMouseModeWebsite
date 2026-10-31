/**
 * DataCheap analytics (https://datacheap.ahmedgagan.in), served first-party from this site:
 *   - every HTML page gets the tracker <script> injected (HTMLRewriter), loaded from /js/script.js
 *   - /js/script.js and /api/events are proxied to DataCheap over a service binding, so ad blockers
 *     see a same-site request and the visitor's real country/device still reach DataCheap
 *   - checkoutAttribution() puts the visitor id cookies into Dodo checkout metadata, which is how a
 *     sale gets tied to the traffic source that brought the buyer
 *
 * Config (wrangler.jsonc): vars DATACHEAP_SITE_ID + DATACHEAP_DOMAIN, service binding DATACHEAP.
 * Secret: DATACHEAP_TOKEN (the site's proxy token from DataCheap → site settings).
 */

const ORIGIN = "https://datacheap.ahmedgagan.in";
const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

function upstream(env, path, init) {
  const req = new Request(ORIGIN + path, init);
  return env.DATACHEAP ? env.DATACHEAP.fetch(req) : fetch(req);
}

/** Handles the tracker routes; returns null for every other request. */
export async function datacheapProxy(request, env) {
  const { pathname } = new URL(request.url);
  if (pathname === "/js/script.js" && (request.method === "GET" || request.method === "HEAD")) {
    try {
      const res = await upstream(env, "/js/script.js", { method: "GET" });
      return new Response(request.method === "HEAD" ? null : res.body, {
        status: res.status,
        headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "public, max-age=3600" },
      });
    } catch {
      return new Response("/* analytics unavailable */", { status: 200, headers: { "Content-Type": "text/javascript" } });
    }
  }
  if (pathname === "/api/events" && (request.method === "POST" || request.method === "OPTIONS")) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204 });
    const cf = request.cf || {};
    const headers = new Headers({
      "Content-Type": "text/plain",
      "User-Agent": request.headers.get("User-Agent") || "",
      "x-datacheap-proxy": env.DATACHEAP_TOKEN || "",
      "x-dc-ip": request.headers.get("CF-Connecting-IP") || "",
      "x-dc-ua": request.headers.get("User-Agent") || "",
      "x-dc-geo": JSON.stringify({
        country: cf.country, region: cf.region, city: cf.city, continent: cf.continent,
        latitude: cf.latitude, longitude: cf.longitude, asn: cf.asn,
      }),
    });
    try {
      const res = await upstream(env, "/api/events", { method: "POST", headers, body: await request.text() });
      return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" } });
    } catch {
      return new Response("OK", { status: 202 }); // analytics must never break the site
    }
  }
  return null;
}

/**
 * Adds the tracker to HTML responses. With `request`, redirects to a Dodo payment link
 * (e.g. /buy → checkout.dodopayments.com/buy/pdt_…) also get the visitor ids as checkout metadata.
 */
export function withTracker(response, env, request) {
  if (request && response.status >= 300 && response.status < 400) return tagCheckoutRedirect(response, request);
  const type = response.headers.get("Content-Type") || "";
  if (!env.DATACHEAP_SITE_ID || !type.includes("text/html")) return response;
  const tag = `<script defer data-website-id="${env.DATACHEAP_SITE_ID}" data-domain="${env.DATACHEAP_DOMAIN}" src="/js/script.js"></script>`;
  return new HTMLRewriter()
    .on("head", { element(el) { el.append(tag, { html: true }); } })
    .transform(response);
}

function tagCheckoutRedirect(response, request) {
  const location = response.headers.get("Location");
  if (!location) return response;
  let url;
  try { url = new URL(location, request.url); } catch { return response; }
  if (!/(^|\.)dodopayments\.com$/.test(url.hostname) || !url.pathname.startsWith("/buy/")) return response;
  const ids = checkoutAttribution(request);
  if (!ids.datacheap_visitor_id) return response;
  for (const [k, v] of Object.entries(ids)) url.searchParams.set(`metadata_${k}`, v);
  const headers = new Headers(response.headers);
  headers.set("Location", url.toString());
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: response.status, headers });
}

function cookie(request, name) {
  for (const part of (request.headers.get("Cookie") || "").split(";")) {
    const i = part.indexOf("=");
    if (i > -1 && part.slice(0, i).trim() === name) {
      try { return decodeURIComponent(part.slice(i + 1).trim()); } catch { return null; }
    }
  }
  return null;
}

/** Metadata fields for a Dodo checkout session (empty when the visitor has no tracking cookie). */
export function checkoutAttribution(request) {
  const out = {};
  const vid = cookie(request, "datacheap_visitor_id");
  const sid = cookie(request, "datacheap_session_id");
  if (vid && ID_RE.test(vid)) out.datacheap_visitor_id = vid;
  if (sid && ID_RE.test(sid)) out.datacheap_session_id = sid;
  return out;
}
