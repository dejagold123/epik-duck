import React, { useEffect, useRef, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import logo from './assets/epik-logo-v2.png';
import heroArtwork from './assets/hero-artwork-v2.png';
import mobileHeroArtwork from './assets/hero-artwork-mobile.png';
import rektBrands from './assets/rekt-brands.jpg';
import yeet from './assets/yeet.jpg';
import pantheonVaults from './assets/pantheon-vaults.jpg';
import { ChapterCard } from './components/ChapterCard.jsx';
import { PriceTicker } from './components/PriceTicker.jsx';
import { VaultCalculator } from './components/VaultCalculator.jsx';
import { useRevealOnView } from './hooks/useRevealOnView.js';
import { chapters } from './data/chapters.js';

const navigation = ['Lore', 'Vault', 'Community', 'About'];
const mobileNavigation = ['Home', ...navigation];
const contractAddress = '3BgwJ8b7b9hHX4sgfZ2KJhv9496CoVfsMK2YePevsBRw';

function App() {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [isContractCopied, setIsContractCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [loreVisible, setLoreVisible] = useState(false);
  const [chapterTransition, setChapterTransition] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobilePage, setMobilePage] = useState('home');
  const transitionTimer = useRef(null);
  const copyStatusTimer = useRef(null);
  const [ecosystemRef, ecosystemVisible] = useRevealOnView(.22);
  const [destinationsRef, destinationsVisible] = useRevealOnView(.1);
  const [footerRef, footerVisible] = useRevealOnView(.12);
  const chapter = chapters[chapterIndex];

  const changeChapter = (nextIndex, direction) => {
    if (nextIndex === chapterIndex) return;
    if (import.meta.env.MODE === 'test') {
      setChapterIndex(nextIndex);
      return;
    }
    if (chapterTransition) return;
    setChapterTransition({ previous: chapters[chapterIndex], direction });
    setChapterIndex(nextIndex);
    window.clearTimeout(transitionTimer.current);
    transitionTimer.current = window.setTimeout(() => setChapterTransition(null), 620);
  };
  const goPrevious = () => changeChapter(Math.max(0, chapterIndex - 1), 'previous');
  const goNext = () => changeChapter(Math.min(chapters.length - 1, chapterIndex + 1), 'next');
  const copyContractAddress = async () => {
    let copied = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(contractAddress);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      const temporaryInput = document.createElement('textarea');
      temporaryInput.value = contractAddress;
      temporaryInput.setAttribute('readonly', '');
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.top = '-999px';
      temporaryInput.style.opacity = '0';
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      temporaryInput.setSelectionRange(0, temporaryInput.value.length);

      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(temporaryInput);
      }
    }

    setIsContractCopied(true);
    window.clearTimeout(copyStatusTimer.current);
    copyStatusTimer.current = window.setTimeout(() => setIsContractCopied(false), 1800);
  };

  const goToMobilePage = (event, item) => {
    event.preventDefault();
    const sectionId = item.toLowerCase();
    const targetId = sectionId === 'home' ? 'top' : sectionId;
    setMobilePage(sectionId);
    setIsMobileMenuOpen(false);
    window.history.replaceState(null, '', sectionId === 'home' ? window.location.pathname + window.location.search : `#${targetId}`);
    window.setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      document.getElementById(targetId)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 0);
  };

  useEffect(() => {
    const syncMobilePageFromHash = () => {
      const hashPage = window.location.hash.replace('#', '').toLowerCase();
      setMobilePage(navigation.map((item) => item.toLowerCase()).includes(hashPage) ? hashPage : 'home');
    };
    syncMobilePageFromHash();
    window.addEventListener('hashchange', syncMobilePageFromHash);
    return () => window.removeEventListener('hashchange', syncMobilePageFromHash);
  }, []);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const sections = navigation
      .map((item) => document.getElementById(item.toLowerCase()))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-22% 0px -58% 0px', threshold: [0, .1, .25, .5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lore = document.getElementById('lore');
    if (!lore || typeof IntersectionObserver === 'undefined') {
      setLoreVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoreVisible(true);
        observer.disconnect();
      }
    }, { threshold: .18 });
    observer.observe(lore);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    window.clearTimeout(transitionTimer.current);
    window.clearTimeout(copyStatusTimer.current);
  }, []);

  return (
    <main data-mobile-page={mobilePage}>
      <section className="hero">
        <header className="header reveal reveal--header">
          <a className="brand" href="#top" aria-label="EPIK-DUCK home" onClick={() => setMobilePage('home')}>
            <img className="brand__logo" src={logo} alt="EPIK-DUCK logo" />
            <span className="brand__name">EPIK-DUCK</span>
          </a>

          <div className="header__market">
            <PriceTicker />
          </div>

          <nav className="nav nav--desktop" aria-label="Primary navigation">
            {navigation.map((item, index) => {
              const sectionId = item.toLowerCase();
              return (
                <a
                  key={item}
                  className={`nav__link${activeSection === sectionId ? ' is-active' : ''}`}
                  href={`#${sectionId}`}
                  aria-current={activeSection === sectionId ? 'location' : undefined}
                  style={{ '--nav-index': index }}
                >
                  {item}
                </a>
              );
            })}
          </nav>
          <button
            className={`mobile-menu-toggle${isMobileMenuOpen ? ' is-open' : ''}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        {isMobileMenuOpen && (
          <nav className="mobile-menu is-open" aria-label="Mobile navigation">
            {mobileNavigation.map((item) => {
              const sectionId = item.toLowerCase();
              const href = sectionId === 'home' ? '#top' : `#${sectionId}`;
              const isActive = sectionId === 'home' ? mobilePage === 'home' : activeSection === sectionId || mobilePage === sectionId;
              return (
                <a
                  key={item}
                  className={isActive ? 'is-active' : ''}
                  href={href}
                  onClick={(event) => goToMobilePage(event, item)}
                >
                  {item}
                </a>
              );
            })}
            <div className="mobile-menu__market">
              <PriceTicker />
            </div>
          </nav>
        )}

        <div id="top" className="hero__artwork">
          <img className="hero__artwork-image" src={heroArtwork} alt="" aria-hidden="true" />
          <img className="hero__artwork-image hero__artwork-image--mobile" src={mobileHeroArtwork} alt="" aria-hidden="true" />
          <div className="hero__artwork-shade" aria-hidden="true" />

          <section className="hero__content" aria-labelledby="hero-title">
            <p className="hero__eyebrow hero__eyebrow-accent reveal reveal--eyebrow">
              &mdash; SOLANA&nbsp;&nbsp; EST - 2024 &mdash;
            </p>
            <h1 id="hero-title" className="hero__title reveal reveal--title">
              <span className="hero__title-line">TEH EPIK</span>
              <span className="hero__title-line">DUCK</span>
            </h1>
            <div className="hero__subtitle reveal reveal--subtitle">
              <p>Born as a joke, Forged by conviction.</p>
              <p>The duck that refused to die.</p>
            </div>
          </section>

          <div className="hero__footer">
            <div className="hero__actions reveal reveal--actions" aria-label="Hero actions">
              <a className="cta" href="#lore" onClick={() => setMobilePage('lore')}>Read the Lore</a>
              <a
                className="cta cta--primary"
                href="https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=3BgwJ8b7b9hHX4sgfZ2KJhv9496CoVfsMK2YePevsBRw"
                target="_blank"
                rel="noreferrer"
              >
                Buy $EPIK
              </a>
            </div>

            <a className="scroll-cue reveal reveal--scroll" href="#lore">
              <span>SCROLL TO BEGIN THE STORY</span>
              <span className="scroll-cue__line" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="lore" className={`chapter-review${loreVisible ? ' is-visible' : ''}`} aria-labelledby="lore-title">
        <header className="lore-heading-block">
          <h2 id="lore-title">THE LORE OF EPIK</h2>
          <p>A timeline written in blood, sweat and Solana block confirmations.</p>
        </header>
        <div className="chapter-stage">
          {chapterTransition && (
            <ChapterCard
              chapter={chapterTransition.previous}
              motionState="exiting"
              direction={chapterTransition.direction}
              ariaHidden
            />
          )}
          <ChapterCard
            key={chapter.number}
            chapter={chapter}
            motionState={chapterTransition ? 'entering' : ''}
            direction={chapterTransition?.direction ?? 'next'}
            onPrevious={chapterIndex > 0 && !chapterTransition ? goPrevious : undefined}
            onNext={chapterIndex < chapters.length - 1 && !chapterTransition ? goNext : undefined}
          />
        </div>
      </section>

      <section ref={ecosystemRef} className={`ecosystem-band motion-section${ecosystemVisible ? ' is-visible' : ''}`} aria-label="Part of the Ecosystem">
        <div className="ecosystem-strip">
          <p className="ecosystem-strip__label">Part of the Ecosystem</p>
            <div className="ecosystem-strip__logos" aria-label="Ecosystem members">
              <figure>
                <img src={rektBrands} alt="Rekt Brands" />
                <figcaption>Rekt Brands</figcaption>
              </figure>
              <figure>
                <img src={yeet} alt="YEET" />
                <figcaption>YEET</figcaption>
              </figure>
              <figure>
                <img src={pantheonVaults} alt="Pantheon Vaults" />
                <figcaption>Pantheon Vaults</figcaption>
              </figure>
          </div>
        </div>
      </section>

      <section ref={destinationsRef} className={`destination-section motion-section${destinationsVisible ? ' is-visible' : ''}`} aria-label="Explore EPIK-DUCK">
        <article id="about" className="destination-panel destination-panel--about motion-item motion-item--about">
          <h2>About Epik</h2>
          <div className="about-panel__content">
            <p className="about-panel__intro">
              E-DUCK ($EPIK) is a Solana meme coin inspired by the classic &ldquo;Teh Epik Duck is coming&rdquo; meme.
              Launched in May 2024 as a joke on stream, it was later rebranded to E-DUCK while keeping the $EPIK ticker.
            </p>

            <dl className="about-panel__facts">
              <div><dt>Token</dt><dd>TEH EPIK DUCK / E-DUCK</dd></div>
              <div><dt>Ticker</dt><dd>$EPIK</dd></div>
              <div><dt>Network</dt><dd>Solana</dd></div>
              <div><dt>Decimals</dt><dd>6</dd></div>
              <div><dt>Supply</dt><dd>&asymp; 846.2&ndash;846.7M EPIK<br />Max commonly listed: 1B</dd></div>
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
                Verify on Solscan &#8599;
              </a>
            </div>

          </div>
        </article>

        <div className="destination-section__right-column">
          <article id="vault" className="destination-panel destination-panel--vault motion-item motion-item--vault">
            <h2>The Pantheon Vault</h2>
            <div className="vault-panel__content">
              <div className="vault-panel__details">
                <p>Pantheon is EPIK&rsquo;s official staking vault, where holders lock $EPIK for six months to earn monthly rewards.</p>
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

          <article id="community" className="destination-panel destination-panel--community motion-item motion-item--community">
            <h2>Community</h2>
            <div className="community-panel__content">
              <p>Join the holders who stayed through the quiet periods and are still here building.</p>
              <div className="community-panel__links">
                <a href="https://x.com/educkcoin" target="_blank" rel="noreferrer">Follow E-DUCK on X</a>
                <a href="https://x.com/rektmando" target="_blank" rel="noreferrer">Follow Mando on X</a>
                <a href="https://discord.gg/e-duck" target="_blank" rel="noreferrer">Join the Discord</a>
              </div>
            </div>
          </article>
        </div>
      </section>
      <footer ref={footerRef} className={`site-footer${footerVisible ? ' is-visible' : ''}`}>
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <a className="site-footer__brand-link" href="#top" aria-label="EPIK-DUCK home">
              <img src={logo} alt="" />
              <span>EPIK-DUCK</span>
            </a>
            <p>Born as a joke. Forged by conviction.</p>
          </div>

          <nav className="site-footer__nav" aria-label="Footer navigation">
            <p>Explore</p>
            {navigation.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>
            ))}
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
          <p>&copy; 2024&ndash;2026 EPIK-DUCK. $EPIK is a meme coin, not financial advice.</p>
        </div>
      </footer>
      <SpeedInsights />
    </main>
  );
}

export default App;












