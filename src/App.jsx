import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import DesktopApp from './DesktopApp.jsx';
import MobileApp from './MobileApp.jsx';
import { useIsMobile } from './hooks/useIsMobile.js';

function App() {
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      {isMobile ? <MobileApp /> : <DesktopApp />}
    </BrowserRouter>
  );
}

export default App;
