// Server-side proxy for Jupiter's Price API v3.
//
// The client can't call api.jup.ag directly from the browser — Jupiter's
// price endpoint doesn't return permissive CORS headers for unauthenticated
// browser-origin requests, even though the same request works fine
// server-to-server (verified directly: a plain, keyless fetch from a server
// returns valid price data). Routing through this same-origin endpoint
// sidesteps CORS entirely, since the browser only ever talks to its own
// domain.
//
// Mint ids are fixed here (not accepted from the client) so this can't be
// used as an open proxy for arbitrary token lookups.
//
// If a Jupiter API key is ever added (see JUPITER_API_KEY in Vercel's
// project settings -> Environment Variables), it's forwarded automatically
// via the x-api-key header. None of this is required for correctness today —
// keyless requests are allowed by Jupiter, just rate-limited to 0.5 req/s,
// far above what this endpoint needs.

const EPIK_MINT = '3BgwJ8b7b9hHX4sgfZ2KJhv9496CoVfsMK2YePevsBRw';
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const JUPITER_PRICE_URL = `https://api.jup.ag/price/v3?ids=${EPIK_MINT},${SOL_MINT}`;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const headers = {};
    if (process.env.JUPITER_API_KEY) {
      headers['x-api-key'] = process.env.JUPITER_API_KEY;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const upstream = await fetch(JUPITER_PRICE_URL, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!upstream.ok) {
      res.status(502).json({ error: `Upstream price request failed: ${upstream.status}` });
      return;
    }

    const data = await upstream.json();
    // Edge/CDN cache for 30s, serve stale up to 60s while revalidating —
    // keeps this well within Jupiter's keyless rate limit regardless of
    // how many visitors hit the site at once.
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json(data);
  } catch (error) {
    res.status(502).json({ error: 'Failed to fetch price data' });
  }
}
