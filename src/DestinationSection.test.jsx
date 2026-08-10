import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('destination section', () => {
  it('renders the three desktop destination panels as navigation targets', () => {
    const { container } = render(<App />);

    expect(screen.getByRole('heading', { name: 'About Epik' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'The Pantheon Vault' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Community' })).toBeTruthy();
    expect(screen.getByText(/846\.2–846\.7M EPIK/)).toBeTruthy();
    expect(screen.getAllByText('3BgwJ8b7b9hHX4sgfZ2KJhv9496CoVfsMK2YePevsBRw')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Verify on Solscan ↗' })).toBeTruthy();
    expect(container.querySelector('#about')).toBeTruthy();
    expect(container.querySelector('#vault')).toBeTruthy();
    expect(container.querySelector('#community')).toBeTruthy();
  });
});
