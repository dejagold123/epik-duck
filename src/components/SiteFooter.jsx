import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/epik-logo-v2.png';
import { contractAddress } from '../data/site.js';
import { useCopyContract } from '../hooks/useCopyContract.js';
import { useRevealOnView } from '../hooks/useRevealOnView.js';

const desktopNav = [
  { label: 'Lore', id: 'lore' },
  { label: 'Vault', id: 'vault' },
  { label: 'Community', id: 'community' },
  { label: 'About', id: 'about' },
];

const mobileNav = [
  { label: 'Lore', to: '/lore' },
  { label: 'Vault', to: '/vault' },
  { label: 'Community', to: '/#community' },
  { label: 'About', to: '/about' },
];

export function SiteFooter({ variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  const [footerRef, footerVisible] = useRevealOnView(.12);
  const [isContractCopied, copyContractAddress] = useCopyContract(contractAddress);

  return (
    <footer ref={footerRef} className={`site-footer${footerVisible ? ' is-visible' : ''}`}>
      <div className="site-footer__main">
        <div className="site-footer__brand">
          {isMobile ? (
            <Link className="site-footer__brand-link" to="/" aria-label="EPIK-DUCK home">
              <img src={logo} alt="" />
              <span>EPIK-DUCK</span>
            </Link>
          ) : (
            <a className="site-footer__brand-link" href="#top" aria-label="EPIK-DUCK home">
              <img src={logo} alt="" />
              <span>EPIK-DUCK</span>
            </a>
          )}
          <p>Born as a joke. Forged by conviction.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer navigation">
          <p>Explore</p>
          {isMobile
            ? mobileNav.map((item) => <Link key={item.label} to={item.to}>{item.label}</Link>)
            : desktopNav.map((item) => <a key={item.label} href={`#${item.id}`}>{item.label}</a>)}
        </nav>

        <div className="site-footer__socials">
          <p>Join the flock</p>
          <a href="https://x.com/educkcoin" target="_blank" rel="noreferrer">E-DUCK on X</a>
          <a href="https://x.com/rektmando" target="_blank" rel="noreferrer">Mando on X</a>
          <a href="https://discord.gg/e-duck" target="_blank" rel="noreferrer">Discord</a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="site-footer__contract">
          <span>Solana contract</span>
          <code>{contractAddress}</code>
          <button className="site-footer__copy-button" type="button" onClick={copyContractAddress}>
            {isContractCopied ? 'Copied' : 'Copy CA'}
          </button>
          <a href={`https://solscan.io/token/${contractAddress}`} target="_blank" rel="noreferrer">Solscan</a>
        </div>
        <p>© 2024–2026 EPIK-DUCK. $EPIK is a meme coin, not financial advice.</p>
      </div>
    </footer>
  );
}
