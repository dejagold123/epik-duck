import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { calculateExitReturn, calculateMonthlyRewards } from './VaultCalculator.jsx';

afterEach(cleanup);

describe('vault calculations', () => {
  it('calculates monthly rewards from editable assumptions', () => {
    expect(calculateMonthlyRewards(10_000, 100_000, 20_000)).toBe(2_000);
    expect(calculateMonthlyRewards(10_000, 0, 20_000)).toBe(0);
  });

  it('clamps invalid exit inputs to zero', () => {
    expect(calculateExitReturn(-10, 0.9)).toBe(0);
    expect(calculateExitReturn(100, 0.8)).toBe(80);
  });

  it('renders all calculator modes in one tablist', async () => {
    const { VaultCalculator } = await import('./VaultCalculator.jsx');
    render(<VaultCalculator />);
    expect(screen.getAllByRole('tab')).toHaveLength(5);
    expect(screen.getByRole('tab', { name: 'Stake' }).getAttribute('aria-selected')).toBe('true');
  });
});
