import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, within } from '@testing-library/react';
import App from './App.jsx';

describe('revised hero', () => {
  it('keeps the site header outside the inset artwork panel', () => {
    const { container } = render(<App />);
    const hero = container.querySelector('.hero');
    const header = container.querySelector('.header');
    const artwork = container.querySelector('.hero__artwork');

    expect(hero).toBeTruthy();
    expect(header).toBeTruthy();
    expect(artwork).toBeTruthy();
    expect(header.parentElement).toBe(hero);
    expect(artwork.parentElement).toBe(hero);
    expect(artwork.contains(header)).toBe(false);
  });

  it('keeps the approved hero content inside the artwork panel', () => {
    const { container } = render(<App />);
    const artwork = container.querySelector('.hero__artwork');
    const artworkQueries = within(artwork);

    expect(artworkQueries.getByRole('heading', { name: 'TEH EPIK DUCK' })).toBeTruthy();
    expect(artworkQueries.getByText('Born as a joke, Forged by conviction.')).toBeTruthy();
    expect(artworkQueries.getByText('Read the Lore')).toBeTruthy();
    const buyLink = artworkQueries.getByRole('link', { name: 'Buy $EPIK' });
    expect(buyLink.getAttribute('href')).toBe('https://jup.ag/swap?sell=So11111111111111111111111111111111111111112&buy=3BgwJ8b7b9hHX4sgfZ2KJhv9496CoVfsMK2YePevsBRw');
    expect(buyLink.getAttribute('target')).toBe('_blank');
    expect(buyLink.getAttribute('rel')).toContain('noreferrer');
  });
});
