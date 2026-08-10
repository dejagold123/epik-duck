import React, { useState } from 'react';
import { EPIK_MINT, SOL_MINT, useMarketData } from '../data/marketData.js';
import { formatUsdPrice } from './PriceTicker.jsx';

const MONTHLY_REWARD_ALLOCATION = 50_000_000 / 24;
const DEFAULT_TOTAL_STAKED = 57_100_000;
const VAULT_URL = 'https://launch.pantheonvaults.com/vaults/3BgwJ8b7b9hHX4sgfZ2KJhv9496CoVfsMK2YePevsBRw';
const tabs = ['Stake', 'Swap', 'What If', 'Exit', 'Portfolio'];
const number = (value) => Math.max(0, Number(value) || 0);
const epik = (value) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value || 0);

export function VaultCalculator() {
  const [tab, setTab] = useState('Stake');
  const [stakeAmount, setStakeAmount] = useState('');
  const [totalStaked, setTotalStaked] = useState(String(DEFAULT_TOTAL_STAKED));
  const [conversionAmount, setConversionAmount] = useState('');
  const [scenarioAmount, setScenarioAmount] = useState('');
  const [scenarioPrice, setScenarioPrice] = useState(0.01);
  const [portfolioBalance, setPortfolioBalance] = useState('');
  const [exitType, setExitType] = useState('normal');
  const [resultRevision, setResultRevision] = useState(0);
  const marketData = useMarketData();
  const epikPrice = Number(marketData?.[EPIK_MINT]?.usdPrice);
  const solPrice = Number(marketData?.[SOL_MINT]?.usdPrice);
  const hasPrice = Number.isFinite(epikPrice) && epikPrice > 0;
  const amount = number(stakeAmount);
  const total = number(totalStaked);
  const monthlyRewards = amount && total ? (amount / total) * MONTHLY_REWARD_ALLOCATION : 0;
  const exitRate = exitType === 'normal' ? .9 : exitType === 'emergency' ? .8 : 1;

  const updateValue = (setValue) => (event) => {
    setValue(event.target.value);
    setResultRevision((revision) => revision + 1);
  };
  const selectOption = (setValue, value) => () => {
    setValue(value);
    setResultRevision((revision) => revision + 1);
  };
  const input = (label, value, setValue, suffix = 'EPIK') => <label className="vault-calculator__field"><span>{label}</span><div><input type="number" min="0" value={value} onChange={updateValue(setValue)} placeholder="0" /><b>{suffix}</b></div></label>;
  const result = (label, value, note) => <div key={`${label}-${resultRevision}`} className="vault-calculator__result vault-calculator__result--updated" aria-live="polite"><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>;

  return <section className="vault-calculator" aria-label="Pantheon Vault calculator"><div className="vault-calculator__tabs" role="tablist" aria-label="Calculator modes">{tabs.map((name) => <button key={name} type="button" role="tab" aria-selected={tab === name} className={tab === name ? 'is-active' : ''} onClick={() => setTab(name)}>{name}</button>)}</div>
    {tab === 'Stake' && <div className="vault-calculator__view vault-calculator__view--active"><div className="vault-calculator__intro"><span>Stake estimate</span><p>Six-month commitment.</p></div>{input('Amount to stake', stakeAmount, setStakeAmount)}<details className="vault-calculator__assumptions"><summary>Vault assumptions</summary>{input('Total eligible stake', totalStaked, setTotalStaked)}<p>Monthly allocation: {epik(MONTHLY_REWARD_ALLOCATION)} EPIK</p></details><div className="vault-calculator__reward-grid">{result('Est. monthly rewards', `${epik(monthlyRewards)} EPIK`, amount && total ? null : 'Enter an amount to calculate.')}{result('Six-month scenario', `${epik(monthlyRewards * 6)} EPIK`, 'Assumes stake and reward allocation stay unchanged.')}</div><a className="vault-calculator__action" href={VAULT_URL} target="_blank" rel="noreferrer">Enter Vault</a></div>}
    {tab === 'Swap' && <div className="vault-calculator__view vault-calculator__view--active"><div className="vault-calculator__intro"><span>Live conversion</span><p>Market-price conversion, not an executable quote.</p></div>{input('EPIK amount', conversionAmount, setConversionAmount)}{result('USD value', hasPrice ? formatUsdPrice(number(conversionAmount) * epikPrice) : 'Live price unavailable')}{result('SOL value', hasPrice && Number.isFinite(solPrice) ? `${(number(conversionAmount) * epikPrice / solPrice).toFixed(6)} SOL` : 'Live price unavailable')}</div>}
    {tab === 'What If' && <div className="vault-calculator__view vault-calculator__view--active"><div className="vault-calculator__intro"><span>Hypothetical scenario</span><p>Not a price prediction.</p></div>{input('EPIK amount', scenarioAmount, setScenarioAmount)}<div className="vault-calculator__scenarios">{[.01, .05, .1, 1].map((value) => <button key={value} type="button" className={scenarioPrice === value ? 'is-active' : ''} onClick={selectOption(setScenarioPrice, value)}>{formatUsdPrice(value)}</button>)}</div>{result('Scenario value', formatUsdPrice(number(scenarioAmount) * scenarioPrice) || '$0.0000', `At ${formatUsdPrice(scenarioPrice)} per EPIK.`)}</div>}
    {tab === 'Exit' && <div className="vault-calculator__view vault-calculator__view--active"><div className="vault-calculator__intro"><span>Early exit calculator</span><p>Penalties are returned to remaining stakers.</p></div>{input('Staked amount', stakeAmount, setStakeAmount)}<div className="vault-calculator__options"><button type="button" className={exitType === 'normal' ? 'is-active' : ''} onClick={selectOption(setExitType, 'normal')}>Normal<br /><small>10% + 7 days</small></button><button type="button" className={exitType === 'emergency' ? 'is-active' : ''} onClick={selectOption(setExitType, 'emergency')}>Emergency<br /><small>20% immediate</small></button><button type="button" className={exitType === 'full' ? 'is-active' : ''} onClick={selectOption(setExitType, 'full')}>Full term<br /><small>0% after 6 months</small></button></div>{result('Amount returned', `${epik(amount * exitRate)} EPIK`, exitType === 'normal' ? 'Available after a seven-day cooldown.' : exitType === 'emergency' ? 'Available immediately.' : 'No penalty after six months.')}</div>}
    {tab === 'Portfolio' && <div className="vault-calculator__view vault-calculator__view--active"><div className="vault-calculator__intro"><span>Portfolio value</span><p>Manual balance entry. Wallet connection can come later.</p></div>{input('Your EPIK balance', portfolioBalance, setPortfolioBalance)}{result('Current value', hasPrice ? formatUsdPrice(number(portfolioBalance) * epikPrice) : 'Live price unavailable')}{result('24h movement', Number.isFinite(Number(marketData?.[EPIK_MINT]?.priceChange24h)) ? `${Number(marketData[EPIK_MINT].priceChange24h).toFixed(2)}%` : 'Unavailable')}</div>}
  </section>;
}
