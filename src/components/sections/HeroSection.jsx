import React from 'react';
import { Link } from 'react-router-dom';
import heroArtwork from '../../assets/hero-artwork-v2.png';
import { Header } from '../Header.jsx';

export function HeroSection({ variant = 'desktop', activeSection = '', activePath = '', activeHash = '' }) {
  const isMobile = variant === 'mobile';
  const LoreLink = isMobile ? Link : 'a';
  const loreLinkProps = isMobile ? { to: '/lore' } : { href: '#lore' };

  return (
    <section className="hero">
      <Header variant={variant} activeSection={activeSection} activePath={activePath} activeHash={activeHash} />

      <div id="top" className="hero__artwork">
        <img className="hero__artwork-image" src={heroArtwork} alt="" aria-hidden="true" />
        <div className="hero__artwork-shade" aria-hidden="true" />

        <section className="hero__content" aria-labelledby="hero-title">
          <p className="hero__eyebrow hero__eyebrow-accent reveal reveal--eyebrow">
            — SOLANA&nbsp;&nbsp; EST - 2024 —
          </p>
          <h1 id="hero-title" className="hero__title reveal reveal--title">TEH EPIK DUCK</h1>
          <div className="hero__subtitle reveal reveal--subtitle">
            <p>Born as a joke, Forged by conviction.</p>
            <p>The duck that refused to die.</p>
          </div>
        </section>

        <div className="hero__footer">
          <div className="hero__actions reveal reveal--actions" aria-label="Hero actions">
            <LoreLink className="cta" {...loreLinkProps}>Read the Lore</LoreLink>
            <a
              className="cta cta--primary"
              href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=3BgwJ8b7b9hHX4sgfZ2KJhv9496CoVfsMK2YePevsBRw"
              target="_blank"
              rel="noreferrer"
            >
              Buy $EPIK
            </a>
          </div>

          <LoreLink className="scroll-cue reveal reveal--scroll" {...loreLinkProps}>
            <span>SCROLL TO BEGIN THE STORY</span>
            <span className="scroll-cue__line" aria-hidden="true" />
          </LoreLink>
        </div>
      </div>
    </section>
  );
}
