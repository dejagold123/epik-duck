import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header.jsx';
import { AboutPanel } from '../components/sections/AboutPanel.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';

export function AboutPage() {
  const location = useLocation();

  return (
    <main>
      <Header variant="mobile" activePath={location.pathname} activeHash={location.hash} />
      <section className="destination-section is-visible" aria-label="About Epik">
        <AboutPanel />
      </section>
      <SiteFooter variant="mobile" />
    </main>
  );
}
