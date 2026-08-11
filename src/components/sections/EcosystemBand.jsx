import React from 'react';
import rektBrands from '../../assets/rekt-brands.jpg';
import yeet from '../../assets/yeet.jpg';
import pantheonVaults from '../../assets/pantheon-vaults.jpg';
import { useRevealOnView } from '../../hooks/useRevealOnView.js';

export function EcosystemBand() {
  const [sectionRef, isVisible] = useRevealOnView(.22);

  return (
    <section ref={sectionRef} className={`ecosystem-band motion-section${isVisible ? ' is-visible' : ''}`} aria-label="Part of the Ecosystem">
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
  );
}
