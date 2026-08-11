import React from 'react';
import { contractAddress } from '../../data/site.js';
import { useCopyContract } from '../../hooks/useCopyContract.js';

export function AboutPanel({ className = '' }) {
  const [isContractCopied, copyContractAddress] = useCopyContract(contractAddress);

  return (
    <article id="about" className={`destination-panel destination-panel--about motion-item motion-item--about${className ? ` ${className}` : ''}`}>
      <h2>About Epik</h2>
      <div className="about-panel__content">
        <p className="about-panel__intro">
          E-DUCK ($EPIK) is a Solana meme coin inspired by the classic “Teh Epik Duck is coming” meme.
          Launched in May 2024 as a joke on stream, it was later rebranded to E-DUCK while keeping the $EPIK ticker.
        </p>

        <dl className="about-panel__facts">
          <div><dt>Token</dt><dd>TEH EPIK DUCK / E-DUCK</dd></div>
          <div><dt>Ticker</dt><dd>$EPIK</dd></div>
          <div><dt>Network</dt><dd>Solana</dd></div>
          <div><dt>Decimals</dt><dd>6</dd></div>
          <div><dt>Supply</dt><dd>≈ 846.2–846.7M EPIK<br />Max commonly listed: 1B</dd></div>
        </dl>

        <div className="about-panel__contract">
          <p>Contract address</p>
          <div className="about-panel__contract-row">
            <code>{contractAddress}</code>
            <button className="about-panel__copy-button" type="button" onClick={copyContractAddress}>
              {isContractCopied ? 'Copied' : 'Copy CA'}
            </button>
          </div>
          <span className="about-panel__copy-status" role="status" aria-live="polite">
            {isContractCopied ? 'Contract address copied to clipboard.' : ''}
          </span>
          <a href={`https://solscan.io/token/${contractAddress}`} target="_blank" rel="noreferrer">
            Verify on Solscan ↗
          </a>
        </div>
      </div>
    </article>
  );
}
