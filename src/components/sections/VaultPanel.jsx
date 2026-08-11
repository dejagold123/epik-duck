import React from 'react';
import { VaultCalculator } from '../VaultCalculator.jsx';

export function VaultPanel({ className = '' }) {
  return (
    <article id="vault" className={`destination-panel destination-panel--vault motion-item motion-item--vault${className ? ` ${className}` : ''}`}>
      <h2>The Pantheon Vault</h2>
      <div className="vault-panel__content">
        <div className="vault-panel__details">
          <p>Pantheon is EPIK’s official staking vault, where holders lock $EPIK for six months to earn monthly rewards.</p>
          <p>$EPIK uses the vault to reward committed holders while reducing the tokens available to trade. Early-exit penalties return to remaining stakers, concentrating the benefits with long-term participation.</p>
          <ul>
            <li>Six-month staking period</li>
            <li>Monthly rewards</li>
            <li>Early stakers receive airdrop priority</li>
          </ul>
        </div>
        <VaultCalculator />
      </div>
    </article>
  );
}
