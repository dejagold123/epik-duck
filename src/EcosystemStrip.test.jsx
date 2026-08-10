import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, within } from '@testing-library/react';
import App from './App.jsx';

describe('ecosystem strip', () => {
  it('renders the inline label and all three non-clickable logos', () => {
    const { container } = render(<App />);
    const strip = container.querySelector('.ecosystem-strip');
    const queries = within(strip);

    expect(queries.getByText('Part of the Ecosystem')).toBeTruthy();
    expect(queries.getByAltText('Rekt Brands')).toBeTruthy();
    expect(queries.getByAltText('YEET')).toBeTruthy();
    expect(queries.getByAltText('Pantheon Vaults')).toBeTruthy();
    expect(strip.querySelectorAll('a')).toHaveLength(0);
    expect(strip.querySelectorAll('button')).toHaveLength(0);
  });
});
