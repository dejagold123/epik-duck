import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App.jsx';

afterEach(cleanup);

describe('chapter navigation', () => {
  it('starts on chapter one and advances to chapter two', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'A JOKE IS BORN' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /next chapter/i }));
    expect(screen.getByRole('heading', { name: 'THE RISE' })).toBeTruthy();
    expect(screen.getByText('....Within minutes, the duck took flight.')).toBeTruthy();
  });

  it('does not show next on chapter seven and can move backward', () => {
    render(<App />);
    const next = () => fireEvent.click(screen.getByRole('button', { name: /next chapter/i }));
    next(); next(); next(); next(); next(); next();
    expect(screen.getByRole('heading', { name: 'THE LEGEND CONTINUES' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /next chapter/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /previous chapter/i }));
    expect(screen.getByRole('heading', { name: 'THE ETERNAL VAULT' })).toBeTruthy();
  });
});
