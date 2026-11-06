// nomousemode.com — one canonical host for search engines.
// The old address (nomousemode.ahmedgagan.in) and www. answer with a permanent redirect to the same
// path on https://nomousemode.com, so links and rankings carry over. Everything else is the static site.
import { datacheapProxy, withTracker } from './datacheap.js';
import { saleCheckout } from './sale.js';

const CANONICAL = 'nomousemode.com';
const MOVED = new Set(['www.nomousemode.com', 'nomousemode.ahmedgagan.in']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // The Host header is what the visitor typed (the same as url.hostname in production).
    const host = (request.headers.get('host') || url.hostname).split(':')[0].toLowerCase();
    if (MOVED.has(host)) {
      url.protocol = 'https:';
      url.hostname = CANONICAL;
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }
    // DataCheap analytics: first-party tracker + proxy (buy links get the visitor id automatically).
    const analytics = await datacheapProxy(request, env);
    if (analytics) return analytics;
    // Black Friday: /buy opens a checkout with the code applied (only during the sale).
    const sale = await saleCheckout(request, env);
    if (sale) return sale;
    return withTracker(await env.ASSETS.fetch(request), env, request);
  },
};
