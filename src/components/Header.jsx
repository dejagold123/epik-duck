import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/epik-logo-v2.png';
import { PriceTicker } from './PriceTicker.jsx';

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

export function Header({ variant = 'desktop', activeSection = '', activePath = '', activeHash = '' }) {
  const isMobile = variant === 'mobile';

  return (
    <header className="header reveal reveal--header">
      {isMobile ? (
        <Link className="brand" to="/" aria-label="EPIK-DUCK home">
          <img className="brand__logo" src={logo} alt="EPIK-DUCK logo" />
          <span className="brand__name">EPIK-DUCK</span>
        </Link>
      ) : (
        <a className="brand" href="#top" aria-label="EPIK-DUCK home">
          <img className="brand__logo" src={logo} alt="EPIK-DUCK logo" />
          <span className="brand__name">EPIK-DUCK</span>
        </a>
      )}

      <div className="header__market">
        <PriceTicker />
      </div>

      <nav className="nav" aria-label="Primary navigation">
        {isMobile
          ? mobileNav.map((item, index) => {
              const isCommunity = item.to === '/#community';
              const isActive = isCommunity
                ? activePath === '/' && activeHash === '#community'
                : activePath === item.to;
              return (
                <Link
                  key={item.label}
                  className={`nav__link${isActive ? ' is-active' : ''}`}
                  to={item.to}
                  aria-current={isActive ? 'location' : undefined}
                  style={{ '--nav-index': index }}
                >
                  {item.label}
                </Link>
              );
            })
          : desktopNav.map((item, index) => (
              <a
                key={item.label}
                className={`nav__link${activeSection === item.id ? ' is-active' : ''}`}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? 'location' : undefined}
                style={{ '--nav-index': index }}
              >
                {item.label}
              </a>
            ))}
      </nav>
    </header>
  );
}
