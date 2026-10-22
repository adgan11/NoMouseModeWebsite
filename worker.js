// nomousemode.com — one canonical host for search engines.
// The old address (nomousemode.ahmedgagan.in) and www. answer with a permanent redirect to the same
// path on https://nomousemode.com, so links and rankings carry over. Everything else is the static site.
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
    return env.ASSETS.fetch(request);
  },
};
