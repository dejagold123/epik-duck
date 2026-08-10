import React, { useEffect, useState } from 'react';

export const EPIK_MINT = '3BgwJ8b7b9hHX4sgfZ2KJhv9496CoVfsMK2YePevsBRw';
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
const PRICE_URL = `https://api.jup.ag/price/v3?ids=${EPIK_MINT},${SOL_MINT}`;
const REFRESH_INTERVAL = 60_000;
let latestMarketData;
let lastRequestAt = 0;
let inFlight;
const subscribers = new Set();

async function refreshMarketData() {
  if (inFlight || Date.now() - lastRequestAt < REFRESH_INTERVAL - 1000) return inFlight;
  lastRequestAt = Date.now();
  inFlight = fetch(PRICE_URL)
    .then((response) => {
      if (!response.ok) throw new Error(`Price request failed: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      latestMarketData = data;
      subscribers.forEach((update) => update(data));
    })
    .catch(() => undefined)
    .finally(() => { inFlight = undefined; });
  return inFlight;
}

export function useMarketData() {
  const [marketData, setMarketData] = useState(() => latestMarketData);

  useEffect(() => {
    if (import.meta.env.MODE === 'test') return undefined;
    subscribers.add(setMarketData);
    refreshMarketData();
    const interval = window.setInterval(refreshMarketData, REFRESH_INTERVAL);
    return () => {
      subscribers.delete(setMarketData);
      window.clearInterval(interval);
    };
  }, []);

  return marketData;
}