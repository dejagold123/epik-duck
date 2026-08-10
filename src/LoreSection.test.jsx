import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, within } from '@testing-library/react';
import App from './App.jsx';

describe('Lore section composition', () => {
  it('renders the approved heading block above the reusable card', () => {
    const { container } = render(<App />);
    const lore = container.querySelector('#lore');
    const queries = within(lore);
    const heading = queries.getByRole('heading', { name: 'THE LORE OF EPIK' });
    const card = lore.querySelector('.chapter-card');

    expect(heading).toBeTruthy();
    expect(queries.getByText('A timeline written in blood, sweat and Solana block confirmations.')).toBeTruthy();
    expect(card).toBeTruthy();
    expect(heading.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('uses only one reusable chapter card without desktop-only duplicate markup', () => {
    const { container } = render(<App />);
    const lore = container.querySelector('#lore');

    expect(lore.querySelectorAll('.chapter-card')).toHaveLength(1);
    expect(lore.querySelector('.chapter-card--desktop')).toBeNull();
    expect(lore.querySelector('.desktop-chapter__terminal')).toBeNull();
  });
});
