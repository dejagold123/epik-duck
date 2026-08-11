import React, { useEffect, useState } from 'react';
import { HeroSection } from './components/sections/HeroSection.jsx';
import { LoreSection } from './components/sections/LoreSection.jsx';
import { EcosystemBand } from './components/sections/EcosystemBand.jsx';
import { AboutPanel } from './components/sections/AboutPanel.jsx';
import { VaultPanel } from './components/sections/VaultPanel.jsx';
import { CommunityPanel } from './components/sections/CommunityPanel.jsx';
import { SiteFooter } from './components/SiteFooter.jsx';
import { useRevealOnView } from './hooks/useRevealOnView.js';

const sectionIds = ['lore', 'vault', 'community', 'about'];

function DesktopApp() {
  const [activeSection, setActiveSection] = useState('');
  const [destinationsRef, destinationsVisible] = useRevealOnView(.1);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-22% 0px -58% 0px', threshold: [0, .1, .25, .5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <HeroSection variant="desktop" activeSection={activeSection} />
      <LoreSection />
      <EcosystemBand />

      <section ref={destinationsRef} className={`destination-section motion-section${destinationsVisible ? ' is-visible' : ''}`} aria-label="Explore EPIK-DUCK">
        <AboutPanel />
        <div className="destination-section__right-column">
          <VaultPanel />
          <CommunityPanel />
        </div>
      </section>

      <SiteFooter variant="desktop" />
    </main>
  );
}

export default DesktopApp;
