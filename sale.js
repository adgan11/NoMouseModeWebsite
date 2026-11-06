// Black Friday: during the sale, /buy (and /buy/1, /3, /5, /20) opens a Dodo
// checkout with the discount code already applied, made by the
// nmm-sale-checkout Supabase function (../NoMouseMode/supabase/functions).
// Before and after the sale, or if that fails, this returns null and /buy goes
// to the normal payment link in _redirects.
import { checkoutAttribution } from './datacheap.js';

// Same window as the banner in js/site.js and the nmm-sale-checkout function.
const START = Date.UTC(2026, 10, 23, 0, 0); // Mon 23 Nov 2026, 00:00 UTC
const END = Date.UTC(2026, 11, 1, 7, 59); // Mon 30 Nov 2026, 23:59 Pacific

const FUNCTION_URL = 'https://sulnpqfikkcpstixqepy.functions.supabase.co/nmm-sale-checkout';
// The project's public anon key (also shipped in the app).
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bG5wcWZpa2tjcHN0aXhxZXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5ODkyNTQsImV4cCI6MjEwMTU2NTI1NH0.sWRkJCzbjrZ8i0AFtG6P9PH71kF3lOO8-iiLI5ILPTU';
const BUY = /^\/buy(?:\/(1|3|5|20))?\/?$/;

export async function saleCheckout(request, env) {
  const match = BUY.exec(new URL(request.url).pathname);
  if (!match || request.method !== 'GET') return null;
  const now = Date.now();
  // SALE_PREVIEW_TOKEN (a local .dev.vars value, never set in production) sends a test request through early.
  const preview = env.SALE_PREVIEW_TOKEN || '';
  if (!(now >= START && now < END) && !preview) return null;

  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        ...(preview ? { 'x-nmm-sale-preview': preview } : {}),
      },
      body: JSON.stringify({ tier: match[1] || '1', metadata: checkoutAttribution(request) }),
      signal: AbortSignal.timeout(6000),
    });
    const data = await response.json();
    if (!data || typeof data.checkout_url !== 'string' || !/^https:\/\/[a-z0-9.-]*dodopayments\.com\//.test(data.checkout_url)) {
      return null;
    }
    return new Response(null, {
      status: 302,
      headers: { Location: data.checkout_url, 'Cache-Control': 'no-store' },
    });
  } catch {
    return null;
  }
}
