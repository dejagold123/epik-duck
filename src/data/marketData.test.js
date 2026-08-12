import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('market data refresh', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('publishes a successful price response', async () => {
    const response = { 'epik-mint': { usdPrice: 0.01 } };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => response }));
    const { getMarketSnapshot, refreshMarketData } = await import('./marketData.js');

    await refreshMarketData();

    expect(getMarketSnapshot()).toMatchObject({ data: response, status: 'ready' });
    expect(getMarketSnapshot().updatedAt).toEqual(expect.any(Number));
  });

  it('moves to an error state when a request times out', async () => {
    vi.stubGlobal('fetch', vi.fn((_url, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => {
        const error = new Error('aborted');
        error.name = 'AbortError';
        reject(error);
      });
    })));
    const { getMarketSnapshot, refreshMarketData, REQUEST_TIMEOUT } = await import('./marketData.js');

    const request = refreshMarketData();
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT);
    await request;

    expect(getMarketSnapshot()).toMatchObject({ status: 'error', error: 'Price request timed out.' });
  });

  it('treats malformed responses as unavailable data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => { throw new Error('invalid json'); } }));
    const { getMarketSnapshot, refreshMarketData } = await import('./marketData.js');

    await refreshMarketData();

    expect(getMarketSnapshot()).toMatchObject({ status: 'error', error: 'Price data is unavailable.' });
  });
});
