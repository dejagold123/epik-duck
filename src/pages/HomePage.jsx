import React from 'react';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection.jsx';
import { EcosystemBand } from '../components/sections/EcosystemBand.jsx';
import { CommunityPanel } from '../components/sections/CommunityPanel.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';

export function HomePage() {
  const location = useLocation();

  return (
    <main>
      <HeroSection variant="mobile" activePath={location.pathname} activeHash={location.hash} />
      <EcosystemBand />
      <section className="destination-section is-visible" aria-label="Community">
        <CommunityPanel />
      </section>
      <SiteFooter variant="mobile" />
    </main>
  );
}
