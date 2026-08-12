import { useEffect, useState } from 'react';

export const EPIK_MINT = '3BgwJ8b7b9hHX4sgfZ2KJhv9496CoVfsMK2YePevsBRw';
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
const PRICE_URL = `https://api.jup.ag/price/v3?ids=${EPIK_MINT},${SOL_MINT}`;
export const REFRESH_INTERVAL = 60_000;
export const REQUEST_TIMEOUT = 8_000;
const RETRY_DELAY = 5_000;

let latestMarketData;
let lastUpdatedAt;
let lastRequestAt = 0;
let inFlight;
let retryTimer;
let marketSnapshot = { data: undefined, status: 'idle', updatedAt: undefined, error: undefined };
const subscribers = new Set();

const publish = (nextSnapshot) => {
  marketSnapshot = nextSnapshot;
  subscribers.forEach((update) => update(marketSnapshot));
};

export function getMarketSnapshot() {
  return marketSnapshot;
}

export async function refreshMarketData() {
  if (inFlight || Date.now() - lastRequestAt < REFRESH_INTERVAL - 1000) return inFlight;

  lastRequestAt = Date.now();
  publish({
    data: latestMarketData,
    status: latestMarketData ? 'refreshing' : 'loading',
    updatedAt: lastUpdatedAt,
    error: undefined,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  inFlight = fetch(PRICE_URL, { signal: controller.signal })
    .then((response) => {
      if (!response.ok) throw new Error(`Price request failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      latestMarketData = data;
      lastUpdatedAt = Date.now();
      publish({ data, status: 'ready', updatedAt: lastUpdatedAt, error: undefined });
    })
    .catch((error) => {
      lastRequestAt = 0;
      publish({
        data: latestMarketData,
        status: latestMarketData ? 'stale' : 'error',
        updatedAt: lastUpdatedAt,
        error: error.name === 'AbortError' ? 'Price request timed out.' : 'Price data is unavailable.',
      });
      if (!retryTimer) {
        retryTimer = setTimeout(() => {
          retryTimer = undefined;
          refreshMarketData();
        }, RETRY_DELAY);
      }
    })
    .finally(() => {
      clearTimeout(timeoutId);
      inFlight = undefined;
    });

  return inFlight;
}

export function useMarketData() {
  const [snapshot, setSnapshot] = useState(() => marketSnapshot);

  useEffect(() => {
    if (import.meta.env.MODE === 'test') return undefined;
    subscribers.add(setSnapshot);
    refreshMarketData();
    const interval = window.setInterval(refreshMarketData, REFRESH_INTERVAL);
    return () => {
      subscribers.delete(setSnapshot);
      window.clearInterval(interval);
    };
  }, []);

  return snapshot;
}
