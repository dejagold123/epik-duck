import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage.jsx';
import { LorePage } from './pages/LorePage.jsx';
import { VaultPage } from './pages/VaultPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { useScrollManager } from './hooks/useScrollManager.js';

function MobileApp() {
  useScrollManager();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lore" element={<LorePage />} />
      <Route path="/vault" element={<VaultPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default MobileApp;
