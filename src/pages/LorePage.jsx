import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header.jsx';
import { LoreSection } from '../components/sections/LoreSection.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';

export function LorePage() {
  const location = useLocation();

  return (
    <main>
      <Header variant="mobile" activePath={location.pathname} activeHash={location.hash} />
      <LoreSection />
      <SiteFooter variant="mobile" />
    </main>
  );
}
