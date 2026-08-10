import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, within } from '@testing-library/react';
import App from './App.jsx';

describe('navbar animation contract', () => {
  it('renders navigation links with stable section targets', () => {
    const { container } = render(<App />);
    const navigation = within(container.querySelector('.nav'));
    expect(navigation.getByRole('link', { name: 'Lore' }).getAttribute('href')).toBe('#lore');
    expect(navigation.getByRole('link', { name: 'Vault' }).getAttribute('href')).toBe('#vault');
    expect(navigation.getByRole('link', { name: 'Community' }).getAttribute('href')).toBe('#community');
    expect(navigation.getByRole('link', { name: 'About' }).getAttribute('href')).toBe('#about');
  });
});
