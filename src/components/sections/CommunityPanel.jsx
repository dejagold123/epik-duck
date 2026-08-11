import React from 'react';

export function CommunityPanel({ className = '' }) {
  return (
    <article id="community" className={`destination-panel destination-panel--community motion-item motion-item--community${className ? ` ${className}` : ''}`}>
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
  );
}
