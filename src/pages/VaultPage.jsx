import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header.jsx';
import { VaultPanel } from '../components/sections/VaultPanel.jsx';
import { SiteFooter } from '../components/SiteFooter.jsx';

export function VaultPage() {
  const location = useLocation();

  return (
    <main>
      <Header variant="mobile" activePath={location.pathname} activeHash={location.hash} />
      <section className="destination-section is-visible" aria-label="The Pantheon Vault">
        <VaultPanel />
      </section>
      <SiteFooter variant="mobile" />
    </main>
  );
}
