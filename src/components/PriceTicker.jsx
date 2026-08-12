import React from 'react';
import { EPIK_MINT, useMarketData } from '../data/marketData.js';

export function formatUsdPrice(value) {
  if (!Number.isFinite(value) || value <= 0) return null;
  const fractionDigits = value >= 1 ? 2 : Math.min(8, Math.max(4, Math.ceil(-Math.log10(value)) + 2));
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function PriceTicker() {
  const { data: marketData, status } = useMarketData();
  const price = marketData?.[EPIK_MINT];
  const usdPrice = Number(price?.usdPrice);
  const priceChange24h = Number(price?.priceChange24h);

  if (!Number.isFinite(usdPrice) || usdPrice <= 0) {
    const unavailable = status === 'error';
    const liveLabel = unavailable ? 'Unavailable' : 'Loading';
    return <span className="price-ticker price-ticker--loading" aria-label={unavailable ? 'Live EPIK market data is unavailable' : 'Live EPIK market data is loading'}><span className="price-ticker__live" aria-hidden="true"><i /> {liveLabel}</span><span>$EPIK</span></span>;
  }

  const formattedPrice = formatUsdPrice(usdPrice);
  const hasChange = Number.isFinite(priceChange24h);
  const isPositive = hasChange && priceChange24h >= 0;
  const changeLabel = hasChange ? `${isPositive ? '+' : ''}${priceChange24h.toFixed(2)}%` : null;
  const isStale = status === 'stale';
  const liveLabel = isStale ? 'Stale' : status === 'refreshing' ? 'Updating' : 'Live';

  return <span className={`price-ticker${isStale ? ' price-ticker--stale' : ''}`} aria-label={`${isStale ? 'Stale' : 'Live'} EPIK market data: ${formattedPrice}${changeLabel ? `, ${changeLabel} over 24 hours` : ''}`}><span className="price-ticker__live" aria-hidden="true"><i /> {liveLabel}</span><span className="price-ticker__symbol">$EPIK</span><span key={formattedPrice} className="price-ticker__value">{formattedPrice}</span>{changeLabel && <span key={changeLabel} className={`price-ticker__change price-ticker__change--${isPositive ? 'up' : 'down'}`}><span aria-hidden="true">{isPositive ? '▲' : '▼'}</span> {changeLabel}</span>}</span>;
}
